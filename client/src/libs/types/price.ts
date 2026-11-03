import type { PriceGrade, PriceMarketType } from "../enums/price.enum";

export interface PriceHistory {
  _id: string;
  priceDate: string;
  priceMarketType: PriceMarketType;
  priceGrade: PriceGrade;
  priceUnitKg: number;
  priceAmount: number;
}
