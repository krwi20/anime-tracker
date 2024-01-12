import { createSlice } from "@reduxjs/toolkit";

// Initial state for the anime slice
const initialState = {
	fetchedAllAnime: null, // Holds the data for all anime
	fetchedSpecificAnime: null, // Holds the data for specific anime
	loading: false, // Indicates if data is loading
	error: false, // Holds any errors from fetching
};

// Create anime slice
const animeSlice = createSlice({
	name: "anime", // Name of the slice
	initialState, // Initial state as defined above
	reducers: {
		// Actions for fetching all the anime
		getAllAnimeStart: (state) => {
			state.loading = true;
		},
		getAllAnimeSuccess: (state, action) => {
			state.fetchedAllAnime = action.payload;
			state.loading = false;
			state.error = null;
		},
		getAllAnimeFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		// Actions for fetching a specific anime
		getSpecificAnimeStart: (state) => {
			state.loading = true;
		},
		getSpecificAnimeSuccess: (state, action) => {
			state.fetchedSpecificAnime = action.payload;
			state.loading = false;
			state.error = null;
		},
		getSpecificAnimeFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		// Actions for updating a specific anime
		updateSpecificAnimeStart: (state) => {
			state.loading = true;
		},
		updateSpecificAnimeSuccess: (state, action) => {
			state.fetchedSpecificAnime = action.payload;
			state.loading = false;
			state.error = null;
		},
		updateSpecificAnimeFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
	},
});

// Export action creators and the reducer from the anime slice
export const {
	getAllAnimeStart,
	getAllAnimeSuccess,
	getAllAnimeFailure,
	getSpecificAnimeStart,
	getSpecificAnimeSuccess,
	getSpecificAnimeFailure,
	updateSpecificAnimeStart,
	updateSpecificAnimeSuccess,
	updateSpecificAnimeFailure,
} = animeSlice.actions;
export default animeSlice.reducer;
