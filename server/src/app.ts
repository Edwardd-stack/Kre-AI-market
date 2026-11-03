import cors from "cors";
import express from "express";
import morgan from "morgan";
import router from "./router";
import { MORGAN_FORMAT } from "./libs/config";

/** ENTRANCE **/
const app = express();
app.use(express.json());
app.use(cors({ origin: true }));
app.use(morgan(MORGAN_FORMAT));

/** ROUTERS **/
app.use("/", router); // SPA: REACT .. (CSR)

export default app;
