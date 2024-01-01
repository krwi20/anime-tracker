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

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/test/:username", test);
router.post("/add", addTrackedAnime);
router.delete("/remove/:userId/:animeId", removeTrackedAnime);
router.patch("/update", updateTrackedAnime);
router.patch("/updateEpisodes", updateEpisodesWatched);

export default router;
