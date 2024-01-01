import express from "express";

import {
	anime,
	specificAnime,
	updateSpecificAnime,
	addAnime,
	deleteAnime,
	searchAnime,
} from "../controllers/anime.js";

const router = express.Router();

router.get("/anime", anime);
router.get("/anime/search", searchAnime);
router.get("/anime/:id", specificAnime);
router.patch("/anime/edit/:id", updateSpecificAnime);
router.post("/anime/add", addAnime);
router.delete("/anime/delete/:id", deleteAnime);

export default router;
