import mongoose from "mongoose";

const animeSchema = new mongoose.Schema({
	title: {
		type: String,
	},
	title_jp: {
		type: String,
	},
	description: {
		type: String,
	},
	customImageURL: {
		type: String,
		default:
			"https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
	},
	type: {
		type: String,
	},
	episodes: {
		type: Number,
	},
	status: {
		type: String,
	},
	airing: {
		type: Boolean,
	},
	airedFrom: {
		type: Date,
	},
	airedUntil: {
		type: Date,
	},
	duration: {
		type: String,
	},
	ageRating: {
		type: String,
	},
	background: {
		type: String,
	},
	season: {
		type: String,
	},
	year: {
		type: Number,
	},
	producers: {
		type: [String],
	},
	broadcast: {
		type: Object,
	},
	licensors: {
		type: [String],
	},
	studios: {
		type: [String],
	},
	genres: {
		type: [String],
	},
});

const Anime = mongoose.model("Anime", animeSchema);

export default Anime;
