import express from "express";
import { createOrder, deleteOrder } from "../controllers/orderControllers.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.delete("/:orderId", deleteOrder);
export default orderRouter;
