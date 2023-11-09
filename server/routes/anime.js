import express from "express";

import { anime, specificAnime } from "../controllers/anime.js";

const router = express.Router();

router.get("/anime", anime);
router.get("/anime/:id", specificAnime);

export default router;
