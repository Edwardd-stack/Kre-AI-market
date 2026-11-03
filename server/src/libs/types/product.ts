import { ObjectId } from "mongoose";
import {
    ProductCategory,
    ProductCertification,
    ProductStatus,
} from "../enums/product.enum";

export interface Product {
    _id: ObjectId;
    productStatus: ProductStatus;
    productCategory: ProductCategory;
    productName: string;
    productVariety: string;
    productProvince: string;
    productRegion?: string;
    productWeightKg: number;
    productPrice: number;
    productPricePerKg?: number;
    productMilledToday: boolean;
    productCertifications: ProductCertification[];
    productSellerName?: string;
    productLeftCount: number;
    productImages: string[];
    createdAt: Date;
    updatedAt: Date;
}

/** Mahsulot qidiruv filtri — oddiy API ham, AI qidiruv ham shu shaklni ishlatadi */
export interface ProductInquiry {
    order: string;           // createdAt | productPrice | productPricePerKg
    page: number;
    limit: number;
    productCategory?: ProductCategory;
    productProvince?: string;
    productVariety?: string;
    productWeightKg?: number;
    maxPrice?: number;
    maxPricePerKg?: number;
    productMilledToday?: boolean;
    productCertifications?: ProductCertification[];
    search?: string;
}
