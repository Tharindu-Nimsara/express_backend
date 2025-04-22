import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
  reviewId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  productId: {
    type: String,
    required: true,
    trim: true,
  },
  email:{
    type: String,
    required: true,
    
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

const Review = mongoose.model("reviews", reviewSchema);

export default Review;
