import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	fetchedAnime: null,
	loading: false,
	error: false,
};

const animeSlice = createSlice({
	name: "anime",
	initialState,
	reducers: {
		getAnimeStart: (state) => {
			state.loading = true;
		},
		getAnimeSuccess: (state, action) => {
			state.fetchedAnime = action.payload;
			state.loading = false;
			state.error = null;
		},
		getAnimeFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
	},
});

export const { getAnimeStart, getAnimeSuccess, getAnimeFailure } =
	animeSlice.actions;
export default animeSlice.reducer;
