import Errors, { HttpCode, Message } from "../libs/Errors";
import { PriceHistory, PriceInquiry } from "../libs/types/price";
import { T } from "../libs/types/common";
import PriceHistoryModel from "../schema/PriceHistory.model";

class PriceService {
    private readonly priceHistoryModel;

    constructor() {
        this.priceHistoryModel = PriceHistoryModel;
    }

    /** Oxirgi N kunlik narxlar (eng oxirgi sanadan orqaga hisoblanadi) */
    public async getPriceHistory(inquiry: PriceInquiry): Promise<PriceHistory[]> {
        const latest = await this.priceHistoryModel
            .findOne()
            .sort({ priceDate: -1 })
            .exec();
        if (!latest) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        const from = new Date(latest.priceDate);
        from.setDate(from.getDate() - inquiry.days);

        const match: T = { priceDate: { $gte: from } };
        if (inquiry.priceMarketType) match.priceMarketType = inquiry.priceMarketType;
        if (inquiry.priceGrade) match.priceGrade = inquiry.priceGrade;

        const result = await this.priceHistoryModel
            .find(match)
            .sort({ priceDate: 1 })   // grafik uchun eskidan yangiga
            .lean()
            .exec();

        return result as unknown as PriceHistory[];
    }
}

export default PriceService;
