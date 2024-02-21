import { PutObjectCommand } from "@aws-sdk/client-s3";
import Characters from "../models/character.js";
import Anime from "../models/anime.js";
import { s3 } from "../index.js";
import User from "../models/user.js";

// Get all the characters
export const characters = async (req, res, next) => {
	try {
		const allCharacters = await Characters.find();
		res.status(201).json(allCharacters);
	} catch (error) {
		next(error);
	}
};

// Add a new anime
export const addCharacter = async (req, res, next) => {
	try {
		// Extract anime properties from request body
		const {
			name,
			alternativeName,
			description,
			animeAppearences,
			mangaAppearences,
		} = req.body;

		// Define customImageURL
		let customImageURL;
		// Check if there is a file attached
		if (req.file) {
			const params = {
				Bucket: process.env.BUCKET_NAME,
				// Anime title as filename
				Key: name,
				Body: req.file.buffer,
				ContentType: req.file.mimetype,
			};
			const command = new PutObjectCommand(params);
			// Upload to S3 Bucket
			await s3.send(command);

			// If there is a file set the customImageURL to the image link
			customImageURL = `https://wrki20-anime-track.s3.eu-central-1.amazonaws.com/${name}`;
		} else {
			// If there is no file set the customImageURL to the default image
			customImageURL =
				"https://wrki20-anime-track.s3.eu-central-1.amazonaws.com/NoImage.png";
		}
		// Create a new Anime instance
		const newCharacter = new Characters({
			name,
			alternativeName,
			customImageURL,
			description,
			animeAppearences,
			mangaAppearences,
		});

		// Save the new anime to the database
		const savedCharacter = await newCharacter.save();
		res.status(201).json(savedCharacter);
	} catch (error) {
		next(error);
	}
};
