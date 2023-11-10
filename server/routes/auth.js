import express from "express";

import { register, login, test, addTrackedAnime } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/test/:username", test);
router.post("/add", addTrackedAnime);

export default router;
