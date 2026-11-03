import mongoose, { Schema } from "mongoose";
import { PriceGrade, PriceMarketType } from "../libs/enums/price.enum";

const priceHistorySchema = new Schema(
    {
        priceDate: {
            type: Date,
            required: true,
        },

        priceMarketType: {
            type: String,
            enum: PriceMarketType,
            required: true,
        },

        priceGrade: {
            type: String,
            enum: PriceGrade,
            required: true,
        },

        priceUnitKg: {
            type: Number,
            default: 20,
        },

        priceAmount: {
            type: Number,
            required: true,
        },  // 원
    },
    { timestamps: true }
);

// Bir kun + bir bozor + bir daraja => faqat bitta yozuv
priceHistorySchema.index(
    { priceDate: 1, priceMarketType: 1, priceGrade: 1 },
    { unique: true }
);

export default mongoose.model("PriceHistory", priceHistorySchema);
