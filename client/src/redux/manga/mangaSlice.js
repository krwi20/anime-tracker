import { createSlice } from "@reduxjs/toolkit";

// Initial state for the manga slice
const initialState = {
	fetchedAllManga: null, // Holds the data for all manga
	fetchedSpecificManga: null, // Holds the data for specific manga
	loading: false, // Indicates if data is loading
	error: false, // Holds any errors from fetching
};

// Create manga slice
const mangaSlice = createSlice({
	name: "manga", // Name of the slice
	initialState, // Initial state as defined above
	reducers: {
		// Actions for fetching all the manga
		getAllMangaStart: (state) => {
			state.loading = true;
		},
		getAllMangaSuccess: (state, action) => {
			state.fetchedAllManga = action.payload;
			state.loading = false;
			state.error = null;
		},
		getAllMangaFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		// Actions for fetching a specific manga
		getSpecificMangaStart: (state) => {
			state.loading = true;
		},
		getSpecificMangaSuccess: (state, action) => {
			state.fetchedSpecificManga = action.payload;
			state.loading = false;
			state.error = null;
		},
		getSpecificMangaFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		// Actions for updating a specific manga
		updateSpecificMangaStart: (state) => {
			state.loading = true;
		},
		updateSpecificMangaSuccess: (state, action) => {
			state.fetchedSpecificManga = action.payload;
			state.loading = false;
			state.error = null;
		},
		updateSpecificMangaFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
	},
});

// Export action creators and the reducer from the manga slice
export const {
	getAllMangaStart,
	getAllMangaSuccess,
	getAllMangaFailure,
	getSpecificMangaStart,
	getSpecificMangaSuccess,
	getSpecificMangaFailure,
	updateSpecificMangaStart,
	updateSpecificMangaSuccess,
	updateSpecificMangaFailure,
} = mangaSlice.actions;

export default mangaSlice.reducer;
