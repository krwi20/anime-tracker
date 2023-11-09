import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	fetchedAllAnime: null,
	fetchedSpecificAnime: null,
	loading: false,
	error: false,
};

const animeSlice = createSlice({
	name: "anime",
	initialState,
	reducers: {
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
	},
});

export const {
	getAllAnimeStart,
	getAllAnimeSuccess,
	getAllAnimeFailure,
	getSpecificAnimeStart,
	getSpecificAnimeSuccess,
	getSpecificAnimeFailure,
} = animeSlice.actions;
export default animeSlice.reducer;
