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

export const updateSpecificAnime = async (req, res, next) => {
	try {
		const updateSpecificAnime = await Anime.findById(req.params.id);

		updateSpecificAnime.title = req.body.title;
		updateSpecificAnime.title_jp = req.body.title_jp;
		updateSpecificAnime.description = req.body.description;
		updateSpecificAnime.customImageURL = req.body.image;

		const updatedAnime = await updateSpecificAnime.save();

		res.status(201).json(updatedAnime);
	} catch (error) {
		next(error);
	}
};

export const addAnime = async (req, res, next) => {
	try {
		const {
			title,
			title_jp,
			description,
			customImageURL,
			type,
			episodes,
			status,
			airing,
			airedFrom,
			airedUntil,
			duration,
			rating,
			background,
			season,
			year,
			producers,
			broadcast,
			licensors,
			studios,
			genres,
		} = req.body;

		const newAnime = new Anime({
			title,
			title_jp,
			description,
			customImageURL,
			type,
			episodes,
			status,
			airing,
			airedFrom,
			airedUntil,
			duration,
			rating,
			background,
			season,
			year,
			producers,
			broadcast,
			licensors,
			studios,
			genres,
		});

		const savedAnime = await newAnime.save();
		res.status(201).json(savedAnime);
	} catch (error) {
		next(error);
	}
};
