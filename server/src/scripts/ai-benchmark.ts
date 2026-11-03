/**
 * Gemini tezligini o'lchash: npm run ai:bench
 * 1) Har bir model — kichik so'rov
 * 2) Haqiqiy AI qidiruv so'rovi — JSON schema BILAN va schema'SIZ
 */
import dotenv from "dotenv";
dotenv.config();
import { GenerateContentConfig, GoogleGenAI } from "@google/genai";
import { GEMINI_MODELS } from "../libs/config";
import AiService from "../models/Ai.service";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const service = new AiService() as any; // private prompt/schema metodlarini olish uchun
const options = {
    provinces: ["강원", "경기", "경북", "전남", "전북", "충남"],
    varieties: ["고시히카리", "삼광", "새청무", "신동진", "영호진미", "오대", "일품", "참드림", "추청", "해들"],
};

async function measure(label: string, model: string, contents: string, config: GenerateContentConfig) {
    const started = Date.now();
    try {
        const res = await ai.models.generateContent({
            model,
            contents,
            config: { ...config, abortSignal: AbortSignal.timeout(30000) },
        });
        console.log(`${label.padEnd(44)} ${String(Date.now() - started).padStart(6)}ms  ${(res.text ?? "").slice(0, 80)}`);
    } catch (err) {
        const e = err as { status?: number; name?: string };
        console.log(`${label.padEnd(44)}  ERROR ${e.status ?? e.name}`);
    }
}

async function bench() {
    console.log("--- 1) Kichik so'rov ---");
    for (const model of GEMINI_MODELS) {
        await measure(model, model, 'Return {"ok":true}', { responseMimeType: "application/json" });
    }

    console.log("\n--- 2) AI qidiruv: '경기 당일도정 쌀 4만원 이하' ---");
    const model = GEMINI_MODELS[0];
    const query = "경기 당일도정 쌀 4만원 이하";
    const systemInstruction = service.searchPrompt(options);
    for (let i = 1; i <= 2; i++) {
        await measure(`schema BILAN #${i}`, model, query, {
            systemInstruction,
            responseMimeType: "application/json",
            responseJsonSchema: service.searchSchema(options),
            temperature: 0,
        });
        await measure(`schema'SIZ #${i}`, model, query, {
            systemInstruction,
            responseMimeType: "application/json",
            temperature: 0,
        });
    }
}

bench();
