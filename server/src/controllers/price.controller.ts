import { Request, Response } from "express";
import Errors, { HttpCode } from "../libs/Errors";
import { T } from "../libs/types/common";
import { PriceInquiry } from "../libs/types/price";
import { PriceGrade, PriceMarketType } from "../libs/enums/price.enum";
import PriceService from "../models/Price.service";

const priceService = new PriceService();

const priceController: T = {};

priceController.getPriceHistory = async (req: Request, res: Response) => {
    try {
        console.log("getPriceHistory");
        const { days, priceMarketType, priceGrade } = req.query;

        const inquiry: PriceInquiry = { days: days ? Number(days) : 90 };
        if (priceMarketType) inquiry.priceMarketType = priceMarketType as PriceMarketType;
        if (priceGrade) inquiry.priceGrade = priceGrade as PriceGrade;

        const result = await priceService.getPriceHistory(inquiry);

        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log("Error, getPriceHistory:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

export default priceController;
