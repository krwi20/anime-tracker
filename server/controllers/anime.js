import Anime from "../models/anime.js";

// Get all the anime
export const anime = async (req, res, next) => {
	try {
		const allAnime = await Anime.find();
		res.status(201).json(allAnime);
	} catch (error) {
		next(error);
	}
};

// Get specific anime by ID
export const specificAnime = async (req, res, next) => {
	try {
		const specificAnime = await Anime.findById(req.params.id);
		res.status(201).json(specificAnime);
	} catch (error) {
		next(error);
	}
};

// Update specific anime by ID
export const updateSpecificAnime = async (req, res, next) => {
	try {
		const updateSpecificAnime = await Anime.findById(req.params.id);

		// Update anime properties with request body data

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

// Add a new anime
export const addAnime = async (req, res, next) => {
	try {
		// Extract anime properties from request body
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

		// Create a new Anime instance
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

		// Save the new anime to the database
		const savedAnime = await newAnime.save();
		res.status(201).json(savedAnime);
	} catch (error) {
		next(error);
	}
};

// Delete specific anime by ID
export const deleteAnime = async (req, res, next) => {
	try {
		const deleteAnime = await Anime.findByIdAndDelete(req.params.id);
		res.status(201).json(deleteAnime);
	} catch (error) {
		next(error);
	}
};

// Search for anime by title
export const searchAnime = async (req, res, next) => {
	try {
		const query = req.query.query;
		// Create a case-insensitive regular expression for matching the query
		const regex = new RegExp(`^${query}`, "i");
		// Find anime with titles matching the regex
		const matchingAnime = await Anime.find({ title: regex });

		res.status(200).json(matchingAnime);
	} catch (error) {
		console.error(error);
		next(error);
	}
};
