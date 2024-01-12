import express from "express";

import {
	register,
	login,
	test,
	addTrackedAnime,
	removeTrackedAnime,
	updateTrackedAnime,
	updateEpisodesWatched,
} from "../controllers/auth.js";
import { verifyToken } from "../utils/verify.js";

// Create an instance of Express Router
const router = express.Router();

// Route to handle user registration
router.post("/register", register);
// Route to handle user login
router.post("/login", login);
// Route for testing, retrieves user data by username
router.get("/test/:username", test);
// Route to add tracked anime for a user
router.post("/add", verifyToken(), addTrackedAnime);
// Route to remove tracked anime from a user's profile
router.delete("/remove/:userId/:animeId", verifyToken(), removeTrackedAnime);
// Route to update tracked anime's rating in a user's profile (requires token verification)
router.patch("/update", verifyToken(), updateTrackedAnime);
// Route to update episodes watched for tracked anime in a user's profile
router.patch("/updateEpisodes", verifyToken(), updateEpisodesWatched);

export default router;
