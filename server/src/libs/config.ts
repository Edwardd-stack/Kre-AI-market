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
export const GEMINI_TIMEOUT = 20000; // bepul tier band paytida asosiy model 15-25s javob berishi mumkin

/** Barcha urinishlar uchun umumiy chegara (ms) — foydalanuvchi bundan ko'p kutmaydi */
export const GEMINI_TOTAL_TIMEOUT = 30000;

/** AI natijalarini keshda saqlash muddati (ms) — 1 soat */
export const AI_CACHE_TTL = 60 * 60 * 1000;

/** AI qidiruvga yuboriladigan gapning maksimal uzunligi */
export const AI_QUERY_MAX_LENGTH = 200;

/** AI qidiruv qaytaradigan maksimal mahsulotlar soni (sahifalash frontend'da) */
export const AI_RESULT_LIMIT = 100;

/** Foydalanuvchi matnini RegExp ichida xavfsiz ishlatish (.*+? kabi belgilarni ekranlash) */
export const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** ===================== Support chat ===================== */

/** Ish vaqti: Dushanba–Juma, 09:00–18:00 (Koreya vaqti) */
export const SUPPORT_TIMEZONE = "Asia/Seoul";
export const SUPPORT_START_HOUR = 9;
export const SUPPORT_END_HOUR = 18;

/** Ish vaqtida operator shuncha vaqt javob bermasa — AI yordamga keladi */
export const OPERATOR_WAIT_MS = 2 * 60 * 1000;

/** AI'ga yuboriladigan oxirgi xabarlar soni (suhbat konteksti) */
export const CHAT_HISTORY_LIMIT = 12;
export const CHAT_MESSAGE_MAX_LENGTH = 1000;
