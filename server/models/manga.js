import mongoose from "mongoose";

const mangaSchema = new mongoose.Schema({
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
	chapters: {
		type: Number,
	},
	volumes: {
		type: Number,
	},
	status: {
		type: String,
	},
	publishing: {
		type: Boolean,
	},
	publishedFrom: {
		type: Date,
	},
	publishedUntil: {
		type: Date,
	},
	background: {
		type: String,
	},
	authors: {
		type: [String],
	},
	demographic: {
		type: [String],
	},
	serialization: {
		type: [String],
	},
	genres: {
		type: [String],
	},
});

const Manga = mongoose.model("Manga", mangaSchema);

export default Manga;
