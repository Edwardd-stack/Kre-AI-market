import type {
  ProductCategory,
  ProductCertification,
  ProductStatus,
} from "../enums/product.enum";

export interface Product {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface ProductInquiry {
  order: string;
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
