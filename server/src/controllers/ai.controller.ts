import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import { AiReportInput, AiSearchInput } from "../libs/types/ai";
import { Lang } from "../libs/enums/ai.enum";
import { AI_QUERY_MAX_LENGTH } from "../libs/config";
import AiService from "../models/Ai.service";

const aiService = new AiService();

const aiController: T = {};

/** Noma'lum til kelsa koreyscha */
const toLang = (value: unknown): Lang =>
    Object.values(Lang).includes(value as Lang) ? (value as Lang) : Lang.KO;

aiController.search = async (req: Request, res: Response) => {
    try {
        console.log("aiSearch");
        const query = String(req.body?.query ?? "").trim();
        if (!query || query.length > AI_QUERY_MAX_LENGTH)
            throw new Errors(HttpCode.BAD_REQUEST, Message.INVALID_QUERY);

        const input: AiSearchInput = { query, lang: toLang(req.body?.lang) };
        const result = await aiService.search(input);

        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log("Error, aiSearch:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

aiController.report = async (req: Request, res: Response) => {
    try {
        console.log("aiReport");
        const days = Number(req.body?.days ?? 30);
        const input: AiReportInput = {
            lang: toLang(req.body?.lang),
            days: days > 0 && days <= 90 ? days : 30,
        };
        const result = await aiService.priceReport(input);

        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log("Error, aiReport:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

export default aiController;
