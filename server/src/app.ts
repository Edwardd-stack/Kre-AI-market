import cors from "cors";
import express from "express";
import morgan from "morgan";
import router from "./router";
import { MORGAN_FORMAT } from "./libs/config";
import { connectDb } from "./libs/utils/db";

/** ENTRANCE **/
const app = express();
app.use(express.json());
app.use(cors({ origin: true }));
// Polling har 3 soniyada so'rov yuboradi — o'zgarmagan (304) javoblar terminalni to'ldirmasin
app.use(morgan(MORGAN_FORMAT, { skip: (req, res) => res.statusCode === 304 }));

/** DATABASE — /health bazasiz javob beradi; qolgan so'rovlar ulanishni kutadi (Vercel serverless) **/
app.use(async (req, res, next) => {
  if (req.path === "/health") return next();
  try {
    await connectDb();
    next();
  } catch (err) {
    console.error("MongoDB connection failed", err);
    res.status(503).json({ message: "Database is not available" });
  }
});

/** ROUTERS **/
app.use("/", router); // SPA: REACT .. (CSR)

export default app;
