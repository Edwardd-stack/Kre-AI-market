import { GenerateContentConfig, GoogleGenAI } from "@google/genai";
import Errors, { HttpCode, Message } from "../libs/Errors";
import {
    AI_CACHE_TTL,
    GEMINI_MODELS,
    GEMINI_RETRIES,
    GEMINI_RETRY_DELAY,
    GEMINI_TIMEOUT,
} from "../libs/config";
import { T } from "../libs/types/common";
import { ProductInquiry } from "../libs/types/product";
import { PriceHistory } from "../libs/types/price";
import {
    AiReportInput,
    AiReportResult,
    AiSearchInput,
    AiSearchResult,
    PriceStat,
} from "../libs/types/ai";
import { Lang } from "../libs/enums/ai.enum";
import { ProductCategory, ProductCertification } from "../libs/enums/product.enum";
import AiQueryLogModel from "../schema/AiQueryLog.model";
import ProductService from "./Product.service";
import PriceService from "./Price.service";

const ORDERS = ["createdAt", "productPrice", "productPricePerKg"];
const LANG_NAMES: Record<Lang, string> = {
    [Lang.KO]: "Korean",
    [Lang.EN]: "English",
    [Lang.RU]: "Russian",
};

class AiService {
    private readonly ai: GoogleGenAI;
    private readonly aiQueryLogModel;
    private readonly productService: ProductService;
    private readonly priceService: PriceService;
    /** Oddiy xotira-kesh: bir xil savolga Gemini'ni qayta chaqirmaymiz */
    private readonly cache = new Map<string, { value: unknown; expires: number }>();

    constructor() {
        this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        this.aiQueryLogModel = AiQueryLogModel;
        this.productService = new ProductService();
        this.priceService = new PriceService();
    }

    /** ===================== 1. AI QIDIRUV ===================== */

    public async search(input: AiSearchInput): Promise<AiSearchResult> {
        // 1) Bazadagi haqiqiy qiymatlar — AI faqat shulardan tanlaydi
        const options = await this.productService.getFilterOptions();

        // 2) Gemini: oddiy gap => JSON filtr (kesh bilan)
        const cacheKey = `search:${input.query.toLowerCase().replace(/\s+/g, " ")}`;
        let raw = this.getCache<T>(cacheKey);
        if (raw) console.log("AI cache hit:", cacheKey);
        else {
            raw = await this.askJson(
                this.searchPrompt(options),
                input.query,
                this.searchSchema(options)
            );
            this.setCache(cacheKey, raw);
        }

        console.log("AI raw filter:", JSON.stringify(raw));

        // 3) AI javobiga ko'r-ko'rona ishonmaymiz — tekshirib tozalaymiz
        const filter = this.sanitizeFilter(raw, options);

        // 3b) Xavfsizlik to'ri: AI narx chegarasini tashlab ketgan bo'lsa, kod o'zi topadi
        if (!filter.maxPrice && !filter.maxPricePerKg) {
            const limit = this.extractPriceLimit(input.query);
            if (limit?.perKg) filter.maxPricePerKg = limit.amount;
            else if (limit) filter.maxPrice = limit.amount;
            if (limit) console.log("Price limit added by rule:", limit);
        }

        // 4) Mavjud qidiruv logikasini qayta ishlatamiz
        const products = await this.productService.getProducts(filter);

        // 5) Log — AI qanchalik to'g'ri ishlayotganini kuzatish uchun
        await this.aiQueryLogModel.create({
            logQuery: input.query,
            logLang: input.lang,
            logParsedFilter: filter,
            logResultCount: products.length,
        });

        return { query: input.query, filter, products };
    }

    private searchPrompt(options: { provinces: string[]; varieties: string[] }): string {
        return [
            "You convert a rice shopper's request into a JSON search filter for a Korean rice marketplace.",
            "The request may be in Korean, English or Russian.",
            "Only include fields the user actually asked for. Omit everything else.",
            `productProvince must be one of: ${options.provinces.join(", ")} (map e.g. 경기도/Gyeonggi/Кёнгидо => 경기).`,
            `productVariety must be one of: ${options.varieties.join(", ")}.`,
            "productCategory: WHITE_RICE (백미/white), BROWN_RICE (현미/brown), GLUTINOUS (찹쌀/sticky).",
            "Prices are in KRW: 4만원 = 40000, 3万 = 30000, '40 тысяч вон' = 40000.",
            "Use maxPrice for total price limits and maxPricePerKg only for per-kg limits.",
            "productMilledToday = true for 당일도정 / freshly milled / свежий помол.",
            "order: productPrice or productPricePerKg when the user wants cheap items, otherwise createdAt.",
            "Never drop a price limit: words like 이하 / under / below / до / дешевле always mean maxPrice (or maxPricePerKg if 'per kg').",
            "",
            "Examples:",
            '"경기 당일도정 쌀 4만원 이하" => {"productProvince":"경기","productMilledToday":true,"maxPrice":40000}',
            '"cheapest organic brown rice per kg" => {"productCategory":"BROWN_RICE","productCertifications":["ORGANIC"],"order":"productPricePerKg"}',
            '"белый рис 10 кг до 35 тысяч вон" => {"productCategory":"WHITE_RICE","productWeightKg":10,"maxPrice":35000}',
            '"전북 신동진 kg당 3500원 이하" => {"productProvince":"전북","productVariety":"신동진","maxPricePerKg":3500}',
        ].join("\n");
    }

    private searchSchema(options: { provinces: string[]; varieties: string[] }): object {
        return {
            type: "object",
            properties: {
                productCategory: { type: "string", enum: Object.values(ProductCategory) },
                productProvince: { type: "string", enum: options.provinces },
                productVariety: { type: "string", enum: options.varieties },
                productWeightKg: { type: "number" },
                maxPrice: { type: "number" },
                maxPricePerKg: { type: "number" },
                productMilledToday: { type: "boolean" },
                productCertifications: {
                    type: "array",
                    items: { type: "string", enum: Object.values(ProductCertification) },
                },
                order: { type: "string", enum: ORDERS },
            },
        };
    }

    /** AI qaytargan obyektdan faqat ruxsat etilgan, to'g'ri turdagi qiymatlarni olamiz */
    private sanitizeFilter(
        raw: T,
        options: { provinces: string[]; varieties: string[] }
    ): ProductInquiry {
        const filter: ProductInquiry = {
            order: ORDERS.includes(raw.order) ? raw.order : "createdAt",
            page: 1,
            limit: 20,
        };
        // AI ba'zan sonni "40000" ko'rinishida (matn) qaytaradi => songa aylantiramiz
        const toNumber = (v: unknown) => (typeof v === "string" ? Number(v.replace(/,/g, "")) : v);
        raw.productWeightKg = toNumber(raw.productWeightKg);
        raw.maxPrice = toNumber(raw.maxPrice);
        raw.maxPricePerKg = toNumber(raw.maxPricePerKg);
        const isPositive = (n: unknown) => typeof n === "number" && Number.isFinite(n) && n > 0;

        if (Object.values(ProductCategory).includes(raw.productCategory))
            filter.productCategory = raw.productCategory;
        if (options.provinces.includes(raw.productProvince))
            filter.productProvince = raw.productProvince;
        if (options.varieties.includes(raw.productVariety))
            filter.productVariety = raw.productVariety;
        if (isPositive(raw.productWeightKg)) filter.productWeightKg = raw.productWeightKg;
        if (isPositive(raw.maxPrice)) filter.maxPrice = raw.maxPrice;
        if (isPositive(raw.maxPricePerKg)) filter.maxPricePerKg = raw.maxPricePerKg;
        if (typeof raw.productMilledToday === "boolean")
            filter.productMilledToday = raw.productMilledToday;
        if (Array.isArray(raw.productCertifications)) {
            const certs = raw.productCertifications.filter((c: string) =>
                Object.values(ProductCertification).includes(c as ProductCertification)
            );
            if (certs.length) filter.productCertifications = certs;
        }
        return filter;
    }

    /**
     * Gapdan narx chegarasini qoida (regex) bilan topish.
     * "4만원 이하", "under 40000 won", "до 35 тысяч вон", "kg당 3500원 이하"
     */
    private extractPriceLimit(query: string): { amount: number; perKg: boolean } | null {
        const text = query.toLowerCase().replace(/,/g, "");
        const hasLimitWord = /(이하|미만|까지|under|below|less than|max|cheaper than|до|дешевле|не дороже)/.test(text);
        if (!hasLimitWord) return null;

        const patterns: [RegExp, number][] = [
            [/(\d+(?:\.\d+)?)\s*만\s*원?/, 10000],               // 4만원, 3.5만
            [/(\d+(?:\.\d+)?)\s*천\s*원?/, 1000],                // 3천원
            [/(\d+(?:\.\d+)?)\s*(?:тыс|тысяч)/, 1000],            // 35 тысяч
            [/(\d+(?:\.\d+)?)\s*k\b/, 1000],                      // 40k
            [/(\d{3,})\s*(?:원|won|krw|вон|₩)?/, 1],                 // 40000원
        ];
        for (const [regex, multiplier] of patterns) {
            const match = text.match(regex);
            if (match) {
                const perKg = /(kg당|키로당|per kg|\/kg|за кг|за килограмм)/.test(text);
                return { amount: Math.round(Number(match[1]) * multiplier), perKg };
            }
        }
        return null;
    }

    /** ===================== 2. AI NARX HISOBOTI ===================== */

    public async priceReport(input: AiReportInput): Promise<AiReportResult> {
        const prices = await this.priceService.getPriceHistory({ days: input.days });
        if (!prices.length) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        // Raqamlarni KOD hisoblaydi — AI raqam "o'ylab topmasligi" uchun
        const stats = this.calculateStats(prices);

        const cacheKey = `report:${input.lang}:${input.days}:${stats.map((x) => x.lastDate + x.lastPrice).join()}`;
        const cached = this.getCache<string>(cacheKey);
        if (cached) return { lang: input.lang, days: input.days, stats, report: cached };

        const report = await this.askText(
            [
                `You are a rice market analyst for a Korean rice trading platform.`,
                `Write a short market report (4-5 sentences) in ${LANG_NAMES[input.lang]}.`,
                `Prices are KRW per 20kg bag. WHOLESALE = 도매, RETAIL = 소매, HIGH = 상품 grade, MEDIUM = 중품 grade.`,
                `Use ONLY the numbers given. Do not invent numbers. Mention the overall trend, `,
                `the wholesale-retail gap and one practical tip for buyers. Plain text, no markdown.`,
            ].join("\n"),
            JSON.stringify(stats)
        );

        this.setCache(cacheKey, report);
        return { lang: input.lang, days: input.days, stats, report };
    }

    private calculateStats(prices: PriceHistory[]): PriceStat[] {
        const groups = new Map<string, PriceHistory[]>();
        for (const p of prices) {
            const key = `${p.priceMarketType}_${p.priceGrade}`;
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key)!.push(p);
        }

        return [...groups.values()].map((list) => {
            const amounts = list.map((p) => p.priceAmount);
            const first = list[0];
            const last = list[list.length - 1];
            return {
                priceMarketType: first.priceMarketType,
                priceGrade: first.priceGrade,
                firstDate: new Date(first.priceDate).toISOString().slice(0, 10),
                lastDate: new Date(last.priceDate).toISOString().slice(0, 10),
                firstPrice: first.priceAmount,
                lastPrice: last.priceAmount,
                minPrice: Math.min(...amounts),
                maxPrice: Math.max(...amounts),
                avgPrice: Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length),
                changePercent:
                    Math.round(((last.priceAmount - first.priceAmount) / first.priceAmount) * 1000) / 10,
            };
        });
    }

    /** ===================== Gemini yordamchilari ===================== */

    private async askJson(systemInstruction: string, userText: string, schema: object): Promise<T> {
        const text = await this.generate(userText, {
            systemInstruction,
            responseMimeType: "application/json",
            responseJsonSchema: schema,
            temperature: 0, // har safar bir xil, aniq javob
        });
        try {
            return JSON.parse(text);
        } catch (err) {
            console.log("Error, Gemini JSON parse:", text);
            throw new Errors(HttpCode.SERVICE_UNAVAILABLE, Message.AI_FAILED);
        }
    }

    private async askText(systemInstruction: string, userText: string): Promise<string> {
        const text = await this.generate(userText, { systemInstruction, temperature: 0.4 });
        return text.trim();
    }

    /**
     * Gemini'ga so'rov: retry + fallback.
     * 503 (band) / 429 (limit) bo'lsa — biroz kutib qayta uriniladi,
     * baribir bo'lmasa — keyingi modelga o'tiladi.
     */
    private async generate(contents: string, config: GenerateContentConfig): Promise<string> {
        for (const model of GEMINI_MODELS) {
            for (let attempt = 1; attempt <= GEMINI_RETRIES; attempt++) {
                try {
                    const started = Date.now();
                    const response = await this.ai.models.generateContent({
                        model,
                        contents,
                        config: { ...config, abortSignal: AbortSignal.timeout(GEMINI_TIMEOUT) },
                    });
                    console.log(`Gemini [${model}] ${Date.now() - started}ms`);
                    return response.text ?? "";
                } catch (err) {
                    const status = (err as { status?: number }).status;
                    const name = (err as Error).name;
                    console.log(`Gemini error [${model}, attempt ${attempt}]: ${status ?? name}`);

                    // Timeout => bu model hozir sekin, kutib o'tirmasdan keyingisiga
                    if (name === "TimeoutError" || name === "AbortError") break;


                    const temporary = status === 503 || status === 429 || status === 500;
                    if (status === 404 || status === 403) break; // model yo'q / ruxsat yo'q => keyingi model
                    if (!temporary) throw new Errors(HttpCode.SERVICE_UNAVAILABLE, Message.AI_FAILED);
                    if (attempt < GEMINI_RETRIES) await this.sleep(GEMINI_RETRY_DELAY * attempt);
                }
            }
        }
        throw new Errors(HttpCode.SERVICE_UNAVAILABLE, Message.AI_FAILED);
    }

    private getCache<V>(key: string): V | null {
        const hit = this.cache.get(key);
        if (!hit || hit.expires < Date.now()) return null;
        return hit.value as V;
    }

    private setCache(key: string, value: unknown) {
        this.cache.set(key, { value, expires: Date.now() + AI_CACHE_TTL });
    }

    private sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

export default AiService;
