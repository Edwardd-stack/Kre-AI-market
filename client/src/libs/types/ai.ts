import type { Lang } from "../enums/ai.enum";
import type { PriceGrade, PriceMarketType } from "../enums/price.enum";
import type { Product, ProductInquiry } from "./product";

export interface AiSearchResult {
  query: string;
  filter: ProductInquiry;
  products: Product[];
}

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
