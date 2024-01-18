import express from "express";
import multer from "multer";

import {
	anime,
	specificAnime,
	updateSpecificAnime,
	addAnime,
	deleteAnime,
	searchAnime,
} from "../controllers/anime.js";
import { verifyToken } from "../utils/verify.js";

// Create an instance of Express Router
const router = express.Router();

// Mutler setup to receieve image file
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to get all anime
router.get("/anime", anime);
// Route to search for anime
router.get("/anime/search", searchAnime);
// Route to get specific anime by ID
router.get("/anime/:id", specificAnime);
// Route to update specific anime by ID
router.patch(
	"/anime/edit/:id",
	upload.single("customImageURL"),
	verifyToken("admin"),
	updateSpecificAnime
);
// Route to add a new anime
router.post(
	"/anime/add",
	upload.single("customImageURL"),
	verifyToken("admin"),
	addAnime
);
// Route to delete specific anime by ID
router.delete("/anime/delete/:id", verifyToken("admin"), deleteAnime);

export default router;
