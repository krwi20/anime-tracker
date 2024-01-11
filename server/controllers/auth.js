import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import { errorHandler } from "../utils/error.js";
import User from "../models/user.js";

export const register = async (req, res, next) => {
	const { username, email, password, role } = req.body;
	const hashedPassword = bcryptjs.hashSync(password, 10);
	const newUser = new User({ username, email, password: hashedPassword, role });
	try {
		await newUser.save();
		res.status(201).json({ message: "User created successfully" });
	} catch (error) {
		next(error);
	}
};

export const login = async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const validUser = await User.findOne({ email });
		if (!validUser) return next(errorHandler(404, "User Not Found!"));
		const validPassword = bcryptjs.compareSync(password, validUser.password);
		if (!validPassword) return next(errorHandler(401, "Wrong Credentials!"));
		const token = jwt.sign(
			{ id: validUser._id, role: validUser.role },
			process.env.JWT_SECRET
		);
		const { password: hashedPassword, ...rest } = validUser._doc;
		const expiryDate = new Date(Date.now() + 3600000);
		res
			.cookie("access_token", token, { httpOnly: true, expires: expiryDate })
			.status(200)
			.json(rest);
	} catch (error) {
		next(error);
	}
};

export const test = async (req, res, next) => {
	try {
		const { username } = req.params;
		const user = await User.findOne({ username });
		const { password, ...userData } = user._doc;
		res.status(200).json(userData);
	} catch (error) {
		next(error);
	}
};

export const addTrackedAnime = async (req, res, next) => {
	try {
		const { userId, animeId, status, timeUpdated } = req.body;

		const updateObj = {
			$set: {
				[`trackedAnime.${animeId}.animeId`]: animeId,
				[`trackedAnime.${animeId}.status`]: status,
				[`trackedAnime.${animeId}.timeUpdated`]: timeUpdated,
			},
		};

		await User.findByIdAndUpdate(userId, updateObj, { new: true });

		const updatedUser = await User.findById(userId);

		res
			.status(200)
			.json({ message: "Anime added to trackedAnime", updatedUser });
	} catch (error) {
		next(error);
	}
};

export const removeTrackedAnime = async (req, res, next) => {
	const userId = req.params.userId;
	const animeId = req.params.animeId;
	try {
		await User.findByIdAndUpdate(
			userId,
			{ $unset: { [`trackedAnime.${animeId}`]: 1 } },
			{ new: true }
		);
		const updatedUser = await User.findById(userId);
		res.status(200).json(updatedUser);
	} catch (error) {
		next(error);
	}
};

export const updateTrackedAnime = async (req, res, next) => {
	try {
		const { userId, animeId, rating, timeUpdated } = req.body;

		const ratingNumber = parseFloat(rating);

		const updateObj = {
			$set: {
				[`trackedAnime.${animeId}.rating`]: ratingNumber,
				[`trackedAnime.${animeId}.timeUpdated`]: timeUpdated,
			},
		};

		console.log(updateObj);

		await User.findByIdAndUpdate(userId, updateObj, { new: true });

		const updatedUser = await User.findById(userId);
		res.status(200).json({ message: "Anime rating updated", updatedUser });
	} catch (error) {
		next(error);
	}
};

export const updateEpisodesWatched = async (req, res, next) => {
	try {
		const { userId, animeId, episodesWatched, timeUpdated } = req.body;

		const episodesNumber = parseFloat(episodesWatched);

		const updateObj = {
			$set: {
				[`trackedAnime.${animeId}.episodesWatched`]: episodesNumber,
				[`trackedAnime.${animeId}.timeUpdated`]: timeUpdated,
			},
		};

		await User.findByIdAndUpdate(userId, updateObj, { new: true });

		const updatedUser = await User.findById(userId);

		res.status(200).json({ message: "Anime rating updated", updatedUser });
	} catch (error) {
		next(error);
	}
};
