import mongoose, { Schema } from "mongoose";
import { ChatSender } from "../libs/enums/chat.enum";

const chatMessageSchema = new Schema(
    {
        sessionId: {
            type: Schema.Types.ObjectId,
            ref: "ChatSession",
            required: true,
        },

        messageSender: {
            type: String,
            enum: ChatSender,
            required: true,
        },

        messageText: {
            type: String,
            required: true,
        },

        messageIsFallback: {
            type: Boolean,
            default: false,
        },  // operator band bo'lgani uchun AI javob berdi
    },
    { timestamps: true }
);

chatMessageSchema.index({ sessionId: 1, createdAt: 1 });

export default mongoose.model("ChatMessage", chatMessageSchema);
