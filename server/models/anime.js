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
			"https://wrki20-anime-track.s3.eu-central-1.amazonaws.com/NoImage.png",
	},
	type: {
		type: String,
	},
	source: {
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
	rating: {
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
