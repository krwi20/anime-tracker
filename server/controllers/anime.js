import { PutObjectCommand } from "@aws-sdk/client-s3";
import Anime from "../models/anime.js";
import { s3 } from "../index.js";
import User from "../models/user.js";

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

		if (req.file) {
			const params = {
				Bucket: process.env.BUCKET_NAME,
				// Anime title as filename
				Key: req.body.title,
				Body: req.file.buffer,
				ContentType: req.file.mimetype,
			};
			const command = new PutObjectCommand(params);
			// Upload to S3 Bucket
			await s3.send(command);

			// If there is a file update the customImageURL - otherwise leave it as is
			updateSpecificAnime.customImageURL = `https://wrki20-anime-track.s3.eu-central-1.amazonaws.com/${req.body.title}`;
		}

		// Update anime properties with request body data
		updateSpecificAnime.title = req.body.title;
		updateSpecificAnime.title_jp = req.body.title_jp;
		updateSpecificAnime.description = req.body.description;
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
			source,
		} = req.body;

		// Define customImageURL
		let customImageURL;
		// Check if there is a file attached
		if (req.file) {
			const params = {
				Bucket: process.env.BUCKET_NAME,
				// Anime title as filename
				Key: title,
				Body: req.file.buffer,
				ContentType: req.file.mimetype,
			};
			const command = new PutObjectCommand(params);
			// Upload to S3 Bucket
			await s3.send(command);

			// If there is a file set the customImageURL to the image link
			customImageURL = `https://wrki20-anime-track.s3.eu-central-1.amazonaws.com/${title}`;
		} else {
			// If there is no file set the customImageURL to the default image
			customImageURL =
				"https://wrki20-anime-track.s3.eu-central-1.amazonaws.com/NoImage.png";
		}
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
			source,
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

		// Update all users to remove the deleted anime from their trackedAnime
		await User.updateMany(
			{ [`trackedAnime.${req.params.id}`]: { $exists: true } },
			{ $unset: { [`trackedAnime.${req.params.id}`]: "" } }
		);

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
