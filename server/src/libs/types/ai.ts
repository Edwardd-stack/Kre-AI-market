import { Lang } from "../enums/ai.enum";
import { PriceGrade, PriceMarketType } from "../enums/price.enum";
import { Product, ProductInquiry } from "./product";

export interface AiSearchInput {
    query: string;
    lang: Lang;
}

export interface AiSearchResult {
    query: string;
    filter: ProductInquiry;   // Gemini gapdan chiqargan filtr
    products: Product[];
}

export interface AiReportInput {
    lang: Lang;
    days: number;
}

/** Narx statistikasi — kodda hisoblanadi, AI faqat matn yozadi */
export interface PriceStat {
    priceMarketType: PriceMarketType;
    priceGrade: PriceGrade;
    firstDate: string;
    lastDate: string;
    firstPrice: number;
    lastPrice: number;
    minPrice: number;
    maxPrice: number;
    avgPrice: number;
    changePercent: number;
}

export interface AiReportResult {
    lang: Lang;
    days: number;
    stats: PriceStat[];
    report: string;
}
