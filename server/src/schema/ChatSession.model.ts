import mongoose, { Schema } from "mongoose";
import { Lang } from "../libs/enums/ai.enum";
import { ChatStatus } from "../libs/enums/chat.enum";

const chatSessionSchema = new Schema(
    {
        chatNickname: {
            type: String,
            required: true,
        },  // "Guest-4821" — login yo'q, mehmon nomi

        chatLang: {
            type: String,
            enum: Lang,
            default: Lang.KO,
        },

        chatStatus: {
            type: String,
            enum: ChatStatus,
            default: ChatStatus.OPEN,
        },

        chatAwaitingOperator: {
            type: Boolean,
            default: false,
        },  // mijoz operator javobini kutyaptimi

        chatAwaitingSince: {
            type: Date,
        },  // qachondan beri kutyapti (2 daqiqalik fallback uchun)

        chatUnreadByOperator: {
            type: Number,
            default: 0,
        },

        chatLastMessage: {
            type: String,
            default: "",
        },

        chatLastMessageAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

chatSessionSchema.index({ chatLastMessageAt: -1 });

export default mongoose.model("ChatSession", chatSessionSchema);
