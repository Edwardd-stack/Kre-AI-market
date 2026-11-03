import mongoose, { Schema } from "mongoose";
import {
    ProductCategory,
    ProductCertification,
    ProductStatus,
} from "../libs/enums/product.enum";

const productSchema = new Schema(
    {
        productStatus: {
            type: String,
            enum: ProductStatus,
            default: ProductStatus.PROCESS,
        },

        productCategory: {
            type: String,
            enum: ProductCategory,
            required: true,
        },

        productName: {
            type: String,
            required: true,
        },  // 예: 신동진 백미 10kg

        productVariety: {
            type: String,
            required: true,
        },  // 품종: 신동진, 추청, 오대...

        productProvince: {
            type: String,
            required: true,
        },  // 산지 도: 경북, 전북...

        productRegion: {
            type: String,
        },  // 시/군: 김제, 의성...

        productWeightKg: {
            type: Number,
            required: true,
        },

        productPrice: {
            type: Number,
            required: true,
        },  // 원

        productPricePerKg: {
            type: Number,
        },  // pre-save hook hisoblaydi

        productMilledToday: {
            type: Boolean,
            default: false,
        },  // 당일도정

        productCertifications: {
            type: [String],
            enum: ProductCertification,
            default: [],
        },

        productSellerName: {
            type: String,
        },  // RPC / 정미소

        productLeftCount: {
            type: Number,
            default: 0,
        },

        productImages: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }    // updatedAt, createdAt
);

// AI qidiruv eng ko'p ishlatadigan filtrlar uchun
productSchema.index({ productProvince: 1, productVariety: 1, productPricePerKg: 1 });

// Saqlashdan oldin kg narxini avtomatik hisoblash
productSchema.pre("save", function () {
    if (this.isModified("productPrice") || this.isModified("productWeightKg")) {
        this.productPricePerKg = Math.round(this.productPrice / this.productWeightKg);
    }
});

export default mongoose.model("Product", productSchema);
