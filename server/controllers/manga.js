import { PutObjectCommand } from "@aws-sdk/client-s3";
import Manga from "../models/manga.js";
import { s3 } from "../index.js";
import User from "../models/user.js";

// Get all the manga
export const manga = async (req, res, next) => {
	try {
		const allManga = await Manga.find();
		res.status(201).json(allManga);
	} catch (error) {
		next(error);
	}
};

// Get specific manga by ID
export const specificManga = async (req, res, next) => {
	try {
		const specificManga = await Manga.findById(req.params.id);
		res.status(201).json(specificManga);
	} catch (error) {
		next(error);
	}
};

// Update specific manga by ID
export const updateSpecificManga = async (req, res, next) => {
	try {
		const updateSpecificManga = await Manga.findById(req.params.id);

		if (req.file) {
			const params = {
				Bucket: process.env.BUCKET_NAME,
				// Manga title as filename
				Key: req.body.title,
				Body: req.file.buffer,
				ContentType: req.file.mimetype,
			};
			const command = new PutObjectCommand(params);
			// Upload to S3 Bucket
			await s3.send(command);

			// If there is a file update the customImageURL - otherwise leave it as is
			updateSpecificManga.customImageURL = `https://wrki20-anime-track.s3.eu-central-1.amazonaws.com/${req.body.title}`;
		}

		// Update manga properties with request body data
		updateSpecificManga.title = req.body.title;
		updateSpecificManga.title_jp = req.body.title_jp;
		updateSpecificManga.description = req.body.description;
		updateSpecificManga.type = req.body.type;
		updateSpecificManga.chapters = req.body.chapters;
		updateSpecificManga.volumes = req.body.volumes;
		updateSpecificManga.status = req.body.status;
		updateSpecificManga.publishing = req.body.publishing;
		updateSpecificManga.publishedFrom = req.body.publishedFrom;
		updateSpecificManga.publishedUntil = req.body.publishedUntil;
		updateSpecificManga.background = req.body.background;
		updateSpecificManga.authors = req.body.authors;
		updateSpecificManga.demographic = req.body.demographic;
		updateSpecificManga.serialization = req.body.serialization;
		updateSpecificManga.genres = req.body.genres;

		const updatedManga = await updateSpecificManga.save();

		res.status(201).json(updatedManga);
	} catch (error) {
		next(error);
	}
};

// Add a new manga
export const addManga = async (req, res, next) => {
	try {
		// Extract manga properties from request body
		const {
			title,
			title_jp,
			description,
			type,
			chapters,
			volumes,
			status,
			publishing,
			publishedFrom,
			publishedUntil,
			background,
			authors,
			demographic,
			serialization,
			genres,
		} = req.body;

		// Define customImageURL
		let customImageURL;
		// Check if there is a file attached
		if (req.file) {
			const params = {
				Bucket: process.env.BUCKET_NAME,
				// Manga title as filename
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
		// Create a new manga instance
		const newManga = new Manga({
			title,
			title_jp,
			description,
			customImageURL,
			type,
			chapters,
			volumes,
			status,
			publishing,
			publishedFrom,
			publishedUntil,
			background,
			authors,
			demographic,
			serialization,
			genres,
		});

		// Save the new manga to the database
		const savedManga = await newManga.save();
		res.status(201).json(savedManga);
	} catch (error) {
		next(error);
	}
};

// Delete specific manga by ID
export const deleteManga = async (req, res, next) => {
	try {
		const deleteManga = await Manga.findByIdAndDelete(req.params.id);

		// Update all users to remove the deleted manga from their trackedManga
		await User.updateMany(
			{ [`trackedManga.${req.params.id}`]: { $exists: true } },
			{ $unset: { [`trackedManga.${req.params.id}`]: "" } }
		);

		res.status(201).json(deleteManga);
	} catch (error) {
		next(error);
	}
};

// Search for manga by title
export const searchManga = async (req, res, next) => {
	try {
		const query = req.query.query;
		// Create a case-insensitive regular expression for matching the query
		const regex = new RegExp(`^${query}`, "i");
		// Find manga with titles matching the regex
		const matchingManga = await Manga.find({ title: regex });

		res.status(200).json(matchingManga);
	} catch (error) {
		console.error(error);
		next(error);
	}
};
