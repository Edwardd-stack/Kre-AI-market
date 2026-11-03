import express from "express";
const router = express.Router();
import productController from "./controllers/product.controller";
import priceController from "./controllers/price.controller";
import aiController from "./controllers/ai.controller";
import chatController from "./controllers/chat.controller";

/** Product **/
router.get("/product/all", productController.getProducts);
router.get("/product/:id", productController.getProduct);

/** Price **/
router.get("/price/history", priceController.getPriceHistory);

/** AI **/
router.post("/ai/search", aiController.search);
router.post("/ai/report", aiController.report);

/** Support chat — mijoz **/
router.get("/chat/status", chatController.getStatus);
router.post("/chat/session", chatController.createSession);
router.get("/chat/:id/messages", chatController.getThread);
router.post("/chat/:id/message", chatController.sendMessage);

/** Support chat — operator (parol bilan) **/
router.get("/support/sessions", chatController.verifyOperator, chatController.getSessions);
router.get("/support/:id/messages", chatController.verifyOperator, chatController.getOperatorThread);
router.post("/support/:id/message", chatController.verifyOperator, chatController.sendOperatorMessage);

export default router;
