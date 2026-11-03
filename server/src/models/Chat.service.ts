import mongoose from "mongoose";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { CHAT_HISTORY_LIMIT, OPERATOR_WAIT_MS, SUPPORT_END_HOUR, SUPPORT_START_HOUR } from "../libs/config";
import { getKstNow, isBusinessHours } from "../libs/utils/supportHours";
import { Lang } from "../libs/enums/ai.enum";
import { ChatSender, SupportMode } from "../libs/enums/chat.enum";
import {
    ChatMessage,
    ChatMessageInput,
    ChatSession,
    ChatThread,
    SupportStatus,
} from "../libs/types/chat";
import ChatSessionModel from "../schema/ChatSession.model";
import ChatMessageModel from "../schema/ChatMessage.model";
import AiService from "./Ai.service";

/** Frontend bu kodni tanlangan tilga tarjima qiladi */
export const SYSTEM_AI_UNAVAILABLE = "AI_UNAVAILABLE";

class ChatService {
    private readonly sessionModel;
    private readonly messageModel;
    private readonly aiService: AiService;
    /** Bir sessiyaga bir vaqtda ikki marta fallback yozilmasligi uchun */
    private readonly fallbackLocks = new Set<string>();

    constructor() {
        this.sessionModel = ChatSessionModel;
        this.messageModel = ChatMessageModel;
        this.aiService = new AiService();
    }

    /** ===================== Holat (kim javob beradi) ===================== */

    private demoEnabled(): boolean {
        return process.env.SUPPORT_DEMO_MODE === "true";
    }

    /** Demo rejimda majburiy rejim, aks holda — Koreya vaqti bo'yicha */
    public resolveMode(forceMode?: SupportMode): SupportMode {
        if (this.demoEnabled() && forceMode && Object.values(SupportMode).includes(forceMode)) return forceMode;
        return isBusinessHours() ? SupportMode.HUMAN : SupportMode.AI;
    }

    public getStatus(forceMode?: SupportMode): SupportStatus {
        const kst = getKstNow();
        return {
            mode: this.resolveMode(forceMode),
            isBusinessHours: isBusinessHours(),
            kstTime: kst.time,
            kstWeekday: kst.weekday,
            startHour: SUPPORT_START_HOUR,
            endHour: SUPPORT_END_HOUR,
            operatorWaitMinutes: OPERATOR_WAIT_MS / 60000,
            demoEnabled: this.demoEnabled(),
        };
    }

    /** ===================== Mijoz tomoni ===================== */

    public async createSession(lang: Lang): Promise<ChatSession> {
        const nickname = `Guest-${Math.floor(1000 + Math.random() * 9000)}`;
        const session = await this.sessionModel.create({ chatNickname: nickname, chatLang: lang });
        return session.toObject() as unknown as ChatSession;
    }

    public async getThread(sessionId: string): Promise<ChatThread> {
        const session = await this.findSession(sessionId);
        await this.checkOperatorTimeout(session); // lazy: so'rov kelganda tekshiriladi
        return this.buildThread(sessionId);
    }

    public async sendUserMessage(input: ChatMessageInput): Promise<ChatThread> {
        const session = await this.findSession(input.sessionId);
        const mode = this.resolveMode(input.forceMode);

        await this.saveMessage(input.sessionId, ChatSender.USER, input.text);
        await this.sessionModel.updateOne(
            { _id: session._id },
            {
                chatLang: input.lang,
                chatLastMessage: input.text,
                chatLastMessageAt: new Date(),
                $inc: { chatUnreadByOperator: 1 },
            }
        );

        if (mode === SupportMode.AI) {
            // Ish vaqtidan tashqari — AI darhol javob beradi
            await this.replyWithAi(input.sessionId, input.lang, false);
        } else if (!session.chatAwaitingOperator) {
            // Ish vaqti — operatorga navbat; 2 daqiqa kutish hisobi shu yerdan boshlanadi
            await this.sessionModel.updateOne(
                { _id: session._id },
                { chatAwaitingOperator: true, chatAwaitingSince: new Date() }
            );
        }

        return this.buildThread(input.sessionId);
    }

    /**
     * Operator 2 daqiqa ichida javob bermagan bo'lsa — AI yordamga keladi.
     * setTimeout o'rniga "lazy" tekshiruv: server qayta ishga tushsa ham ish yo'qolmaydi.
     */
    private async checkOperatorTimeout(session: ChatSession) {
        if (!session.chatAwaitingOperator || !session.chatAwaitingSince) return;
        const waited = Date.now() - new Date(session.chatAwaitingSince).getTime();
        if (waited < OPERATOR_WAIT_MS) return;

        const key = String(session._id);
        if (this.fallbackLocks.has(key)) return;
        this.fallbackLocks.add(key);
        try {
            await this.sessionModel.updateOne(
                { _id: session._id },
                { chatAwaitingOperator: false, $unset: { chatAwaitingSince: 1 } }
            );
            await this.replyWithAi(key, session.chatLang, true);
        } finally {
            this.fallbackLocks.delete(key);
        }
    }

    private async replyWithAi(sessionId: string, lang: Lang, fallback: boolean) {
        const history = await this.messageModel
            .find({ sessionId })
            .sort({ createdAt: -1 })
            .limit(CHAT_HISTORY_LIMIT)
            .lean()
            .exec();

        let text: string;
        try {
            text = await this.aiService.chatReply(
                history.reverse().map((m) => ({ sender: m.messageSender as ChatSender, text: m.messageText })),
                lang,
                fallback
            );
        } catch {
            // AI ishlamasa — mijozga xato oynasi emas, suhbat ichida tushunarli xabar
            await this.saveMessage(sessionId, ChatSender.SYSTEM, SYSTEM_AI_UNAVAILABLE);
            return;
        }
        await this.saveMessage(sessionId, ChatSender.AI, text, fallback);
        await this.sessionModel.updateOne(
            { _id: sessionId },
            { chatLastMessage: text, chatLastMessageAt: new Date() }
        );
    }

    /** ===================== Operator tomoni ===================== */

    public async getSessions(): Promise<ChatSession[]> {
        // Avval timeout bo'lganlarni tekshiramiz — operator ham AI javobini ko'rsin
        const waiting = await this.sessionModel.find({ chatAwaitingOperator: true }).lean().exec();
        for (const s of waiting) await this.checkOperatorTimeout(s as unknown as ChatSession);

        const result = await this.sessionModel
            .find()
            .sort({ chatLastMessageAt: -1 })
            .limit(50)
            .lean()
            .exec();
        return result as unknown as ChatSession[];
    }

    public async getOperatorThread(sessionId: string): Promise<ChatThread> {
        await this.findSession(sessionId);
        await this.sessionModel.updateOne({ _id: sessionId }, { chatUnreadByOperator: 0 });
        return this.buildThread(sessionId);
    }

    public async sendOperatorMessage(sessionId: string, text: string): Promise<ChatThread> {
        await this.findSession(sessionId);
        await this.saveMessage(sessionId, ChatSender.OPERATOR, text);
        await this.sessionModel.updateOne(
            { _id: sessionId },
            {
                chatAwaitingOperator: false,
                $unset: { chatAwaitingSince: 1 },
                chatUnreadByOperator: 0,
                chatLastMessage: text,
                chatLastMessageAt: new Date(),
            }
        );
        return this.buildThread(sessionId);
    }

    /** ===================== Yordamchilar ===================== */

    private async findSession(sessionId: string): Promise<ChatSession> {
        if (!mongoose.isValidObjectId(sessionId))
            throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
        const session = await this.sessionModel.findById(sessionId).lean().exec();
        if (!session) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
        return session as unknown as ChatSession;
    }

    private async saveMessage(sessionId: string, sender: ChatSender, text: string, fallback = false) {
        await this.messageModel.create({
            sessionId,
            messageSender: sender,
            messageText: text,
            messageIsFallback: fallback,
        });
    }

    private async buildThread(sessionId: string): Promise<ChatThread> {
        const [session, messages] = await Promise.all([
            this.sessionModel.findById(sessionId).lean().exec(),
            this.messageModel.find({ sessionId }).sort({ createdAt: 1 }).lean().exec(),
        ]);
        return {
            session: session as unknown as ChatSession,
            messages: messages as unknown as ChatMessage[],
        };
    }
}

export default ChatService;
