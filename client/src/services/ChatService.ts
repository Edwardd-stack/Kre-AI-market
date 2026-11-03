import axios from "axios";
import { serverApi } from "../libs/config";
import type { Lang } from "../libs/enums/ai.enum";
import type { SupportMode } from "../libs/enums/chat.enum";
import type { ChatSession, ChatThread, SupportStatus } from "../libs/types/chat";

/** Mijoz tomoni: status, sessiya, xabarlar */
class ChatService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getStatus(mode?: SupportMode): Promise<SupportStatus> {
    const result = await axios.get(`${this.path}/chat/status`, { params: { mode } });
    return result.data;
  }

  public async createSession(lang: Lang): Promise<ChatSession> {
    const result = await axios.post(`${this.path}/chat/session`, { lang });
    return result.data;
  }

  public async getThread(sessionId: string): Promise<ChatThread> {
    const result = await axios.get(`${this.path}/chat/${sessionId}/messages`);
    return result.data;
  }

  public async sendMessage(sessionId: string, text: string, lang: Lang, mode?: SupportMode): Promise<ChatThread> {
    const result = await axios.post(`${this.path}/chat/${sessionId}/message`, { text, lang, mode });
    return result.data;
  }
}

export default ChatService;
