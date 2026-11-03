import { ObjectId } from "mongoose";
import { PriceGrade, PriceMarketType } from "../enums/price.enum";

export interface PriceHistory {
    _id: ObjectId;
    priceDate: Date;
    priceMarketType: PriceMarketType;
    priceGrade: PriceGrade;
    priceUnitKg: number;
    priceAmount: number;
}

export interface PriceInquiry {
    days: number;                       // oxirgi necha kun
    priceMarketType?: PriceMarketType;
    priceGrade?: PriceGrade;
}
