import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import ProductModel from "../schema/Product.model";
import PriceHistoryModel from "../schema/PriceHistory.model";

/** DRY - Don't Repeat Yourself **/
/** JSON faylni o'qib, massivga aylantiradi */
function readJson(fileName: string): Record<string, unknown>[] {
  const filePath = path.join(__dirname, fileName);
  const text = fs.readFileSync(filePath, "utf-8"); // koreyscha harflar uchun utf-8
  return JSON.parse(text);
}

async function seed() {
  // 1. Ulanish
  await mongoose.connect(process.env.MONGO_URL as string);
  console.log("MongoDB connected");

  // 2. JSON o'qish
  const products = readJson("products.json");
  const prices = readJson("prices.json");

  // 3. Eski ma'lumotni tozalash (seed'ni qayta-qayta ishlatish mumkin bo'lsin)
  await ProductModel.deleteMany({});
  await PriceHistoryModel.deleteMany({});

  // 4. Yangi ma'lumotni yozish
  // create => pre("save") hook ishlaydi => productPricePerKg hisoblanadi
  const createdProducts = await ProductModel.create(products);
  // insertMany => tezroq; narxlarda hook yo'q
  const createdPrices = await PriceHistoryModel.insertMany(prices);

  console.log(`Products: ${createdProducts.length}`);
  console.log(`Prices:   ${createdPrices.length}`);
  console.log(
    "Example:",
    createdProducts[0].productName,
    "=>",
    createdProducts[0].productPricePerKg,
    "원/kg",
  );

  // 5. Uzilish => skript o'zi to'xtaydi
  await mongoose.disconnect();
  console.log("Seed completed ✅");
}

seed().catch((err) => {
  console.log("Seed error:", err);
  process.exit(1);
});
