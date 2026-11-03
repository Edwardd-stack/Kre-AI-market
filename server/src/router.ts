import express from "express";
const router = express.Router();
import productController from "./controllers/product.controller";
import priceController from "./controllers/price.controller";
import aiController from "./controllers/ai.controller";

/** Product **/
router.get("/product/all", productController.getProducts);
router.get("/product/:id", productController.getProduct);

/** Price **/
router.get("/price/history", priceController.getPriceHistory);

/** AI **/
router.post("/ai/search", aiController.search);
router.post("/ai/report", aiController.report);

export default router;
