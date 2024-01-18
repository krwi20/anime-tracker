import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import authRoutes from "./routes/auth.js";
import animeRoutes from "./routes/anime.js";

// Load environment variables from the .env file
dotenv.config();

// S3 Bucket connection setup
export const s3 = new S3Client({
	region: process.env.BUCKET_REGION,
	credentials: {
		accessKeyId: process.env.ACCESS_KEY,
		secretAccessKey: process.env.SECRET_ACCESS_KEY,
	},
});

// Connect to MongoDB database
mongoose
	.connect(process.env.MONGO)
	.then(() => {
		console.log("Connected to MongoDB!");
	})
	.catch((err) => {
		console.log(err);
	});

// Create an instance of the Express application
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());
// Middleware to parse cookies in the request
app.use(cookieParser());
// Middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(
	cors({
		origin: "http://localhost:3000", // Allow requests from this origin
		credentials: true, // Enable credentials (cookies, HTTP authentication)
	})
);

// Start the server on port 3001
app.listen(3001, () => {
	console.log("Server listening on port 3001");
});

// Define routes for authentication and anime-related actions
app.use("/api/auth", authRoutes);
app.use("/api/anime", animeRoutes);

// Error handling middleware for handling errors in the application (general catch-all for unhandled cases)
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";
	// Return a JSON response with error details
	return res.status(statusCode).json({
		success: false,
		message,
		statusCode,
	});
});
