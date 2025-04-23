import Review from "../models/review.js";
import Product from "../models/products.js";
import { isAdmin } from "./userControllers.js";

// Create a new review
export async function createReview(req, res) {
  if (!req.user) {
    return res.status(403).json({ message: "Please login to leave a review" });
  }

  const reviewInfo = req.body;

  // Validate product
  try {
    const product = await Product.findOne({ productId: reviewInfo.productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error fetching product", error: err });
  }

  // Check for duplicate review by same user
  try{
      const existingReview = await Review.findOne({
      productId: reviewInfo.productId,
      email: req.user.email,
    });
    if (existingReview) {
        return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

  }catch (err) {
    return res.status(500).json({ message: "Error checking existing review", error: err });
  }
  

  // Optional custom reviewId like REV00001
  try{
    const lastReview = await Review.find().sort({ date: -1 }).limit(1);
    let reviewId_this = "REV00001";
    if (lastReview.length > 0) {
      const lastNum = parseInt(lastReview[0].reviewId.replace("REV", ""));
      reviewId_this = "REV" + String(lastNum + 1).padStart(5, "0");
    }
  } catch (err) {
    return res.status(500).json({ message: "Error generating review ID", error: err }); 
  }


  try {
    const review = new Review({
      reviewId: reviewId_this,
      productId: reviewInfo.productId,
      email: req.user.email,
      userName: req.user.firstName + " " + req.user.lastName,
      rating: reviewInfo.rating,
      comment: reviewInfo.comment || "",
    });

    const savedReview = await review.save();

    res.json({ message: "Review submitted successfully", review: savedReview });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit review", error: err });
  }
}

// Get all reviews for a product
export async function getProductReviews(req, res) {
  //const productId = req.params.productId
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ productId }).sort({ date: -1 });
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews", error: err });
  }
}

// Delete a review (only by user or admin)
export async function deleteReview(req, res) {
  if (!req.user) {
    return res.status(403).json({ message: "Please login" });
  }
  //const reviewId = req.params.reviewId
  const { reviewId } = req.params;

  try {
    const review = await Review.findOne({ reviewId });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.email !== req.user.email && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this review" });
    }

    await Review.deleteOne({ reviewId });

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete review", error: err });
  }
}
