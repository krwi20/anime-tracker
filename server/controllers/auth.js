import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import { errorHandler } from "../utils/error.js";
import User from "../models/user.js";

// User registration
export const register = async (req, res, next) => {
	const { username, email, password, role } = req.body;
	// Hash the user's password using bcrypt
	const hashedPassword = bcryptjs.hashSync(password, 10);
	// Create a new user with hashed password
	const newUser = new User({ username, email, password: hashedPassword, role });
	try {
		// Save the new user to the database
		await newUser.save();
		res.status(201).json({ message: "User created successfully" });
	} catch (error) {
		next(error);
	}
};

// User login
export const login = async (req, res, next) => {
	const { email, password } = req.body;
	try {
		// Check if the user with the provided email exists
		const validUser = await User.findOne({ email });
		if (!validUser) return next(errorHandler(404, "User Not Found!"));
		// Check if the provided password matches the hashed password in the database
		const validPassword = bcryptjs.compareSync(password, validUser.password);
		if (!validPassword) return next(errorHandler(401, "Wrong Credentials!"));
		// Create a JWT for authentication

		const token = jwt.sign(
			{ id: validUser._id, role: validUser.role },
			process.env.JWT_SECRET
		);

		// Exclude password from the response data
		const { password: hashedPassword, ...rest } = validUser._doc;
		// Set an expiry date for the JWT cookie
		const expiryDate = new Date(Date.now() + 3600000);
		// Send the JWT as a cookie and user data as a response
		res
			.cookie("access_token", token, expiryDate, {
				sameSite: "none",
				httpOnly: true,
			})
			// Respond with the user data
			.status(200)
			.json(rest);
	} catch (error) {
		next(error);
	}
};

// Test endpoint to retrieve user data by username
export const test = async (req, res, next) => {
	try {
		// Retrieve user data based on the provided username
		const { username } = req.params;
		const user = await User.findOne({ username });
		// Exclude password from the response data
		const { password, ...userData } = user._doc;
		// Send user data as a response
		res.status(200).json(userData);
	} catch (error) {
		next(error);
	}
};

// Add tracked anime to user's profile
export const addTrackedAnime = async (req, res, next) => {
	try {
		const { userId, animeId, status, timeUpdated } = req.body;

		// Define update object for MongoDB
		const updateObj = {
			$set: {
				[`trackedAnime.${animeId}.animeId`]: animeId,
				[`trackedAnime.${animeId}.status`]: status,
				[`trackedAnime.${animeId}.timeUpdated`]: timeUpdated,
			},
		};

		// Update user's profile with the tracked anime information
		await User.findByIdAndUpdate(userId, updateObj, { new: true });

		// Retrieve and send updated user data as a response
		const updatedUser = await User.findById(userId);
		res
			.status(200)
			.json({ message: "Anime added to trackedAnime", updatedUser });
	} catch (error) {
		next(error);
	}
};

// Remove tracked anime from user's profile
export const removeTrackedAnime = async (req, res, next) => {
	//get the user and anime ids from the url
	const userId = req.params.userId;
	const animeId = req.params.animeId;

	// Check if the user is trying to remove tracked anime from their own profile
	if (req.user.id !== userId) {
		return res.status(403).json({
			success: false,
			message:
				"Forbidden - You can only remove tracked anime from your own profile",
		});
	}

	// Update the user's profile to remove the tracked anime
	try {
		await User.findByIdAndUpdate(
			userId,
			{ $unset: { [`trackedAnime.${animeId}`]: 1 } },
			{ new: true }
		);
		// Retrieve and update the user data
		const updatedUser = await User.findById(userId);
		res.status(200).json(updatedUser);
	} catch (error) {
		next(error);
	}
};

// Update tracked anime information
export const updateTrackedAnime = async (req, res, next) => {
	try {
		const { userId, animeId, rating, timeUpdated } = req.body;

		// Convert rating to a number
		const ratingNumber = parseFloat(rating);

		// Define update object for MongoDB
		const updateObj = {
			$set: {
				[`trackedAnime.${animeId}.rating`]: ratingNumber,
				[`trackedAnime.${animeId}.timeUpdated`]: timeUpdated,
			},
		};

		// Update user's profile with the new rating for the tracked anime
		const updatedUser = await User.findByIdAndUpdate(userId, updateObj, {
			new: true,
		});

		// If the user is not found, throw an error
		if (!updatedUser) {
			const error = new Error("User not found");
			error.statusCode = 404;
			throw error;
		}

		// Send a response with a success message and updated user data
		res.status(200).json({ message: "Anime rating updated", updatedUser });
	} catch (error) {
		next(error);
	}
};

// Update tracked anime's rating in user's profile
export const updateEpisodesWatched = async (req, res, next) => {
	try {
		const { userId, animeId, episodesWatched, timeUpdated } = req.body;
		// Convert episodes watched to a number
		const episodesNumber = parseFloat(episodesWatched);

		// Define update object for MongoDB
		const updateObj = {
			$set: {
				[`trackedAnime.${animeId}.episodesWatched`]: episodesNumber,
				[`trackedAnime.${animeId}.timeUpdated`]: timeUpdated,
			},
		};

		// Update user's profile with the new episodes watched for the tracked anime
		await User.findByIdAndUpdate(userId, updateObj, { new: true });
		// Retrieve and send updated user data as a response
		const updatedUser = await User.findById(userId);

		// Send a response with a success message and updated user data
		res.status(200).json({ message: "Anime rating updated", updatedUser });
	} catch (error) {
		next(error);
	}
};
