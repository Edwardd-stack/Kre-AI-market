import { NextFunction, Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import { Lang } from "../libs/enums/ai.enum";
import { SupportMode } from "../libs/enums/chat.enum";
import { CHAT_MESSAGE_MAX_LENGTH } from "../libs/config";
import ChatService from "../models/Chat.service";

const chatService = new ChatService();

const chatController: T = {};

const toLang = (value: unknown): Lang =>
    Object.values(Lang).includes(value as Lang) ? (value as Lang) : Lang.KO;

const toMode = (value: unknown): SupportMode | undefined =>
    Object.values(SupportMode).includes(value as SupportMode) ? (value as SupportMode) : undefined;

const readText = (value: unknown): string => {
    const text = String(value ?? "").trim();
    if (!text || text.length > CHAT_MESSAGE_MAX_LENGTH)
        throw new Errors(HttpCode.BAD_REQUEST, Message.INVALID_MESSAGE);
    return text;
};

const sendError = (res: Response, err: unknown) => {
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
};

/** ===================== Mijoz ===================== */

chatController.getStatus = (req: Request, res: Response) => {
    res.status(HttpCode.OK).json(chatService.getStatus(toMode(req.query.mode)));
};

chatController.createSession = async (req: Request, res: Response) => {
    try {
        console.log("createChatSession");
        const result = await chatService.createSession(toLang(req.body?.lang));
        res.status(HttpCode.CREATED).json(result);
    } catch (err) {
        console.log("Error, createChatSession:", err);
        sendError(res, err);
    }
};

chatController.getThread = async (req: Request, res: Response) => {
    try {
        const result = await chatService.getThread(String(req.params.id));
        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log("Error, getThread:", err);
        sendError(res, err);
    }
};

chatController.sendMessage = async (req: Request, res: Response) => {
    try {
        console.log("sendChatMessage");
        const result = await chatService.sendUserMessage({
            sessionId: String(req.params.id),
            text: readText(req.body?.text),
            lang: toLang(req.body?.lang),
            forceMode: toMode(req.body?.mode),
        });
        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log("Error, sendChatMessage:", err);
        sendError(res, err);
    }
};

/** ===================== Operator ===================== */

/** Middleware: "x-operator-key" header .env'dagi OPERATOR_PASSWORD bilan bir xil bo'lishi kerak */
chatController.verifyOperator = (req: Request, res: Response, next: NextFunction) => {
    const password = process.env.OPERATOR_PASSWORD;
    if (!password || req.header("x-operator-key") !== password) {
        const err = new Errors(HttpCode.UNAUTHORIZED, Message.NOT_OPERATOR);
        res.status(err.code).json(err);
        return;
    }
    next();
};

chatController.getSessions = async (req: Request, res: Response) => {
    try {
        const result = await chatService.getSessions();
        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log("Error, getSessions:", err);
        sendError(res, err);
    }
};

chatController.getOperatorThread = async (req: Request, res: Response) => {
    try {
        const result = await chatService.getOperatorThread(String(req.params.id));
        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log("Error, getOperatorThread:", err);
        sendError(res, err);
    }
};

chatController.sendOperatorMessage = async (req: Request, res: Response) => {
    try {
        console.log("sendOperatorMessage");
        const result = await chatService.sendOperatorMessage(String(req.params.id), readText(req.body?.text));
        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log("Error, sendOperatorMessage:", err);
        sendError(res, err);
    }
};

export default chatController;
