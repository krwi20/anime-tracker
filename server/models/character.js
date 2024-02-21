import mongoose from "mongoose";

const characterSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	alternativeName: {
		type: String,
	},
	customImageURL: {
		type: String,
		default:
			"https://wrki20-anime-track.s3.eu-central-1.amazonaws.com/NoImage.png",
	},
	description: {
		type: String,
	},
	animeAppearences: {
		type: [String],
	},
	mangaAppearences: {
		type: [String],
	},
});

const Characters = mongoose.model("Characters", characterSchema);

export default Characters;
