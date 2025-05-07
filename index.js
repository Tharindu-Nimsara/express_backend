import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import productRouter from "./routes/productRouter.js";
import userRouter from "./routes/userRouter.js";
import jwt from "jsonwebtoken";
import orderRouter from "./routes/orderRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file


const app = express();

app.use(cors()); // Enable CORS for all routes

//bodyParser Middlewhere 1
app.use(bodyParser.json()); //bodyParser get the http request at first, arrage it and send to relavant place

//Middlewhere 2 JWT Authetication
app.use((req, res, next) => {
  const tokenString = req.header("Authorization");
  if (tokenString != null) {
    const token = tokenString.replace("Bearer ", "");

    jwt.verify(token, "cbc-batch-five@2025", (err, decoded) => {
      if (decoded != null) {
        req.user = decoded;
        next();
      } else {
        console.log("Invalid Token");
        res.status(403).json({
          message: "Invalid Token",
        });
      }
    });
  } else {
    next();
  }
});

//connecting the code with the database
mongoose
  .connect(
    process.env.MONGODB_URL
  )
  .then(() => {
    console.log("CONNECTED TO THE DATABASE");
  })
  .catch(() => {
    console.log("DATABASE CONNECTION FAILED!");
  });

//mongo db Connection String
//mongodb+srv://admin:<db_password>@cluster0.5zxpq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0    <Password not added>

//mongodb+srv://admin:123@cluster0.5zxpq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

app.use("/api/product", productRouter);
app.use("/api/user", userRouter);
app.use("/api/order", orderRouter)
app.use("/api/review", reviewRouter)

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
