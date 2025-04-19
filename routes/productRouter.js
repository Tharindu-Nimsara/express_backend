import express from "express";
import {
  getProducts,
  saveProducts,
  deleteProduct,
  updateProduct,
  getProductById,
} from "../controllers/productControllers.js";

const productRouter = express.Router();

productRouter.get("/", getProducts); //localhost:5000/products
productRouter.post("/", saveProducts);
productRouter.delete("/:productId", deleteProduct); //localhost:5000/products/productID
productRouter.put("/:productId", updateProduct);
productRouter.get("/:productId", getProductById);

export default productRouter;
