/** Xabarni kim yozgan */
export enum ChatSender {
    USER = "USER",
    OPERATOR = "OPERATOR",
    AI = "AI",
    SYSTEM = "SYSTEM",
}

/** Hozir kim javob beradi */
export enum SupportMode {
    HUMAN = "HUMAN", // ish vaqti — operator
    AI = "AI",       // ish vaqtidan tashqari — AI bot
}

export enum ChatStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
}
