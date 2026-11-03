import type { Lang } from "../enums/ai.enum";
import type { ChatSender, ChatStatus, SupportMode } from "../enums/chat.enum";

export interface ChatSession {
  _id: string;
  chatNickname: string;
  chatLang: Lang;
  chatStatus: ChatStatus;
  chatAwaitingOperator: boolean;
  chatAwaitingSince?: string;
  chatUnreadByOperator: number;
  chatLastMessage: string;
  chatLastMessageAt: string;
  createdAt: string;
}

export interface ChatMessage {
  _id: string;
  sessionId: string;
  messageSender: ChatSender;
  messageText: string;
  messageIsFallback: boolean;
  createdAt: string;
}

export interface ChatThread {
  session: ChatSession;
  messages: ChatMessage[];
}

export interface SupportStatus {
  mode: SupportMode;
  isBusinessHours: boolean;
  kstTime: string;
  kstWeekday: string;
  startHour: number;
  endHour: number;
  operatorWaitMinutes: number;
  demoEnabled: boolean;
}
