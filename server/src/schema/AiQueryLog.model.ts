import mongoose, { Schema } from "mongoose";
import { Lang } from "../libs/enums/ai.enum";

const aiQueryLogSchema = new Schema(
    {
        logQuery: {
            type: String,
            required: true,
        },  // foydalanuvchi yozgan gap

        logLang: {
            type: String,
            enum: Lang,
            default: Lang.KO,
        },

        logParsedFilter: {
            type: Schema.Types.Mixed,
        },  // Gemini qaytargan JSON filtr

        logResultCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model("AiQueryLog", aiQueryLogSchema);
