import { ObjectId } from "mongoose";
import { Lang } from "../enums/ai.enum";
import { ChatSender, ChatStatus, SupportMode } from "../enums/chat.enum";

export interface ChatSession {
    _id: ObjectId;
    chatNickname: string;
    chatLang: Lang;
    chatStatus: ChatStatus;
    chatAwaitingOperator: boolean;
    chatAwaitingSince?: Date;
    chatUnreadByOperator: number;
    chatLastMessage: string;
    chatLastMessageAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatMessage {
    _id: ObjectId;
    sessionId: ObjectId;
    messageSender: ChatSender;
    messageText: string;
    messageIsFallback: boolean;
    createdAt: Date;
}

export interface SupportStatus {
    mode: SupportMode;
    isBusinessHours: boolean;
    kstTime: string;          // "14:05"
    kstWeekday: string;       // "Tue"
    startHour: number;
    endHour: number;
    operatorWaitMinutes: number;
    demoEnabled: boolean;     // demo rejim (faqat .env orqali)
}

export interface ChatThread {
    session: ChatSession;
    messages: ChatMessage[];
}

export interface ChatMessageInput {
    sessionId: string;
    text: string;
    lang: Lang;
    forceMode?: SupportMode;  // faqat demo rejimda hisobga olinadi
}
