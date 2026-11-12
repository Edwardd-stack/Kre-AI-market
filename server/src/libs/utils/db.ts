import mongoose from "mongoose";

/**
 * Bitta umumiy MongoDB ulanishi.
 * - Render / lokal: server.ts ishga tushganda chaqiradi.
 * - Vercel (serverless): har so'rovda chaqiriladi, lekin ulanish faqat birinchi marta ochiladi —
 *   keyingi so'rovlar o'sha "issiq" ulanishdan foydalanadi.
 */
let connecting: Promise<typeof mongoose> | null = null;

export function connectDb(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose);
  connecting ??= mongoose.connect(process.env.MONGO_URL as string).catch((err) => {
    connecting = null; // keyingi so'rov qayta urinsin
    throw err;
  });
  return connecting;
}
