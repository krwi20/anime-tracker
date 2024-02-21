import express from "express";
import multer from "multer";

import { verifyToken } from "../utils/verify.js";
import { addCharacter, characters } from "../controllers/characters.js";

// Create an instance of Express Router
const router = express.Router();

// Mutler setup to receieve image file
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to get all characters
router.get("/characters", characters);
// Route to add character
router.post(
	"/characters/add",
	upload.single("customImageURL"),
	verifyToken("admin"),
	addCharacter
);

export default router;
