import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectDb } from "./libs/utils/db";

/** Render / lokal: avval bazaga ulanib, keyin portni ochamiz. (Vercel bu faylni emas, app.ts'ni ishlatadi) */
connectDb()
  .then(() => {
    console.log("MongoDB connection succeed");
    const PORT = process.env.PORT ?? 3005;
    app.listen(PORT, function () {
      console.info(`The server is running successfully on port: ${PORT} \n`);
    });
  })
  .catch((err) => console.log("Error on connection MongoDB", err));
