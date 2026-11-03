export const MORGAN_FORMAT = `:method :url :response-time [:status] \n`;

/** Gemini modellari: birinchisi band bo'lsa, keyingisiga o'tiladi (fallback) */
export const GEMINI_MODELS = [
    process.env.GEMINI_MODEL ?? "gemini-3.5-flash-lite", // tez va arzon — filtr/hisobot uchun yetarli
    "gemini-3.8-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
];

/** Har bir model uchun urinishlar soni va ular orasidagi kutish (ms) */
export const GEMINI_RETRIES = 2;
export const GEMINI_RETRY_DELAY = 1000;

/** Bitta Gemini so'rovi uchun maksimal kutish (ms) — oshsa keyingi modelga o'tiladi */
export const GEMINI_TIMEOUT = 8000;

/** AI natijalarini keshda saqlash muddati (ms) — 1 soat */
export const AI_CACHE_TTL = 60 * 60 * 1000;

/** AI qidiruvga yuboriladigan gapning maksimal uzunligi */
export const AI_QUERY_MAX_LENGTH = 200;

/** Foydalanuvchi matnini RegExp ichida xavfsiz ishlatish (.*+? kabi belgilarni ekranlash) */
export const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
