import express from "express";

import {
	anime,
	specificAnime,
	updateSpecificAnime,
} from "../controllers/anime.js";

const router = express.Router();

router.get("/anime", anime);
router.get("/anime/:id", specificAnime);
router.patch("/anime/edit/:id", updateSpecificAnime);

export default router;
