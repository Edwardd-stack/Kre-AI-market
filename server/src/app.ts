import cors from "cors";
import express from "express";
import morgan from "morgan";
import router from "./router";
import { MORGAN_FORMAT } from "./libs/config";

/** ENTRANCE **/
const app = express();
app.use(express.json());
app.use(cors({ origin: true }));
// Polling har 3 soniyada so'rov yuboradi — o'zgarmagan (304) javoblar terminalni to'ldirmasin
app.use(morgan(MORGAN_FORMAT, { skip: (req, res) => res.statusCode === 304 }));

/** ROUTERS **/
app.use("/", router); // SPA: REACT .. (CSR)

export default app;
