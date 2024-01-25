import express from "express";

import {
	register,
	login,
	test,
	addTrackedAnime,
	addTrackedManga,
	removeTrackedAnime,
	removeTrackedManga,
	updateTrackedAnime,
	updateTrackedManga,
	updateEpisodesWatched,
	updateChaptersRead,
	updateVolumesRead,
} from "../controllers/auth.js";
import { verifyToken } from "../utils/verify.js";

// Create an instance of Express Router
const router = express.Router();

// TODO: NEEDS CLEANING BUT WAS TIRED WHEN DOING MANGA STUFF

// Route to handle user registration
router.post("/register", register);
// Route to handle user login
router.post("/login", login);
// Route for testing, retrieves user data by username
router.get("/test/:username", test);
// Route to add tracked anime for a user
router.post("/add", verifyToken(), addTrackedAnime);
// Route to add tracked manga for a user
router.post("/add/manga", verifyToken(), addTrackedManga);
// Route to remove tracked anime from a user's profile
router.delete("/remove/:userId/:animeId", verifyToken(), removeTrackedAnime);
// Route to remove tracked manga from a user's profile
router.delete(
	"/manga/remove/:userId/:mangaId",
	verifyToken(),
	removeTrackedManga
);
// Route to update tracked anime's rating in a user's profile (requires token verification)
router.patch("/update", verifyToken(), updateTrackedAnime);
// Route to update episodes watched for tracked anime in a user's profile
router.patch("/updateEpisodes", verifyToken(), updateEpisodesWatched);
// Route to update chapters read for tracked manga in a user's profile
router.patch("/updateChapters", verifyToken(), updateChaptersRead);
// Route to update volumes read for tracked manga in a user's profile
router.patch("/updateVolumes", verifyToken(), updateVolumesRead);
// Route to update tracked manga's rating in a user's profile (requires token verification)
router.patch("/updateManga", verifyToken(), updateTrackedManga);

export default router;
