export const serverApi: string = import.meta.env.VITE_API_URL ?? "http://localhost:3005";

const LOCALES: Record<string, string> = { ko: "ko-KR", en: "en-US", ru: "ru-RU", uz: "uz-Latn-UZ" };

/** Narxni tanlangan tilda formatlash: 40000 => "₩40,000" / "40 000 ₩" */
export const formatWon = (amount: number, lang: string): string =>
  new Intl.NumberFormat(LOCALES[lang] ?? "en-US", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount);

/** Backend xato javobidan foydalanuvchiga ko'rsatiladigan matn */
export const getErrorMessage = (err: unknown): string => {
  const data = (err as { response?: { data?: { message?: string } } }).response?.data;
  return data?.message ?? (err as Error).message ?? "Something went wrong!";
};
