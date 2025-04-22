import express from "express";
import {
  createReview,
  getProductReviews,
  deleteReview,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

// Create a review (POST /revaiews)
reviewRouter.post("/", createReview);

// Get reviews for a product (GET /reviews/:productId)
reviewRouter.get("/:productId", getProductReviews);

// Delete a review (DELETE /reviews/:reviewId)
reviewRouter.delete("/:reviewId", deleteReview);

export default reviewRouter;
