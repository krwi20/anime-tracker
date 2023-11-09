import express from "express";

import { anime } from "../controllers/anime.js";

const router = express.Router();

router.get("/anime", anime);

export default router;
