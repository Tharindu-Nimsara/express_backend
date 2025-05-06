import express from "express";
import {
  createReview,
  getProductReviews,
  deleteReview,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

// localhost:5000/api/review
reviewRouter.post("/", createReview);

reviewRouter.get("/:productId", getProductReviews);

reviewRouter.delete("/:reviewId", deleteReview);

export default reviewRouter;
