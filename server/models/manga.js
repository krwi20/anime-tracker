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
			"https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
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
