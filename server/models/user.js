import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		profilePicture: {
			type: String,
			default:
				"https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		trackedAnime: {
			type: Map,
			of: {
				status: {
					type: String,
					enum: [
						"Watching",
						"Completed",
						"Dropped",
						"On Hold",
						"Plan to watch",
					],
					required: true,
				},
				episodesWatched: {
					type: Number,
					default: 0,
					required: true,
				},
				timeUpdated: {
					type: Date,
					required: true,
				},
				rating: {
					type: Number,
					required: false,
					default: 0,
				},
			},
			default: {},
		},
		trackedManga: {
			type: Map,
			of: {
				status: {
					type: String,
					enum: ["Reading", "Completed", "Dropped", "On Hold", "Plan to read"],
					required: true,
				},
				chaptersRead: {
					type: Number,
					default: 0,
					required: true,
				},
				volumesRead: {
					type: Number,
					default: 0,
					required: true,
				},
				timeUpdated: {
					type: Date,
					required: true,
				},
				rating: {
					type: Number,
					required: false,
					default: 0,
				},
			},
			default: {},
		},
	},

	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
