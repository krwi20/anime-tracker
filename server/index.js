import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";

dotenv.config();

mongoose
	.connect(process.env.MONGO)
	.then(() => {
		console.log("Connected to MongoDB!");
	})
	.catch((err) => {
		console.log(err);
	});

const app = express();
app.use(express.json());

app.use(
	cors({
		origin: "http://localhost:3000",
	})
);

app.listen(3001, () => {
	console.log("Server listening on port 3001");
});

app.use("/api/auth", authRoutes);
