import express from "express";
import multer from "multer";

import {
	manga,
	specificManga,
	updateSpecificManga,
	addManga,
	deleteManga,
	searchManga,
} from "../controllers/manga.js";
import { verifyToken } from "../utils/verify.js";

// Create an instance of Express Router
const router = express.Router();

// Mutler setup to receieve image file
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to get all manga
router.get("/manga", manga);
// Route to search for manga
router.get("/manga/search", searchManga);
// Route to get specific manga by ID
router.get("/manga/:id", specificManga);
// Route to update specific manga by ID
router.patch(
	"/manga/edit/:id",
	upload.single("customImageURL"),
	verifyToken("admin"),
	updateSpecificManga
);
// Route to add a new manga
router.post(
	"/manga/add",
	upload.single("customImageURL"),
	verifyToken("admin"),
	addManga
);
// Route to delete specific manga by ID
router.delete("/manga/delete/:id", verifyToken("admin"), deleteManga);

export default router;
