import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app";

mongoose
  .connect(process.env.MONGO_URL as string, {})
  // TCP - 1
  .then((data) => {
    console.log("MongoDB connection succeed");
    const PORT = process.env.PORT ?? 3005;
    app.listen(PORT, function () {
      console.info(`The server is running successfully on port: ${PORT} \n`);
    });
  })
  .catch((err) => console.log("Erron on comnnection MongoDB", err));
