import Anime from "../models/anime.js";

export const anime = async (req, res, next) => {
	try {
		const allAnime = await Anime.find();
		res.status(201).json(allAnime);
	} catch (error) {
		next(error);
	}
};

export const specificAnime = async (req, res, next) => {
	try {
		const specificAnime = await Anime.findById(req.params.id);
		res.status(201).json(specificAnime);
	} catch (error) {
		next(error);
	}
};
