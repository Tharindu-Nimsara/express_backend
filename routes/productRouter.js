import express from "express";
import { getProducts, saveProducts, deleteProduct } from "../controllers/productControllers.js";

const productRouter = express.Router();

productRouter.get("/", getProducts)

productRouter.post("/", saveProducts)

productRouter.delete("/:productId", deleteProduct)


export default productRouter;

