import express from "express";
const router = express.Router();
import productController from "./controllers/product.controller";
import priceController from "./controllers/price.controller";

/** Product **/
router.get("/product/all", productController.getProducts);
router.get("/product/:id", productController.getProduct);

/** Price **/
router.get("/price/history", priceController.getPriceHistory);

export default router;
