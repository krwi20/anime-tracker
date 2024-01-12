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

		console.log(req.body);

		updateSpecificAnime.title = req.body.title;
		updateSpecificAnime.title_jp = req.body.title_jp;
		updateSpecificAnime.description = req.body.description;
		updateSpecificAnime.customImageURL = req.body.image;
		updateSpecificAnime.type = req.body.type;
		updateSpecificAnime.source = req.body.source;
		updateSpecificAnime.episodes = req.body.episodes;
		updateSpecificAnime.status = req.body.status;
		updateSpecificAnime.airing = req.body.airing;
		updateSpecificAnime.airedFrom = req.body.airedFrom;
		updateSpecificAnime.airedUntil = req.body.airedUntil;
		updateSpecificAnime.duration = req.body.duration;
		updateSpecificAnime.rating = req.body.rating;
		updateSpecificAnime.background = req.body.background;
		updateSpecificAnime.season = req.body.season;
		updateSpecificAnime.year = req.body.year;
		updateSpecificAnime.producers = req.body.producers;
		updateSpecificAnime.broadcast = req.body.broadcast;
		updateSpecificAnime.licensors = req.body.licensors;
		updateSpecificAnime.studios = req.body.studios;
		updateSpecificAnime.genres = req.body.genres;

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

export const deleteAnime = async (req, res, next) => {
	try {
		const deleteAnime = await Anime.findByIdAndDelete(req.params.id);
		res.status(201).json(deleteAnime);
	} catch (error) {
		next(error);
	}
};

export const searchAnime = async (req, res, next) => {
	try {
		const query = req.query.query;

		const regex = new RegExp(`^${query}`, "i");

		const matchingAnime = await Anime.find({ title: regex });

		res.status(200).json(matchingAnime);
	} catch (error) {
		console.error(error);
		next(error);
	}
};
