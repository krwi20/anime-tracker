import { createSlice } from "@reduxjs/toolkit";

// Initial state for the characters slice
const initialState = {
	fetchedAllCharacters: null, // Holds the data for all characters
	fetchedSpecificCharacter: null, // Holds the data for specific character
	charLoading: false, // Indicates if data is loading
	error: false, // Holds any errors from fetching
};

// Create character slice
const characterSlice = createSlice({
	name: "characters", // Name of the slice
	initialState, // Initial state as defined above
	reducers: {
		// Actions for fetching all the characters
		getAllCharactersStart: (state) => {
			state.charLoading = true;
		},
		getAllCharactersSuccess: (state, action) => {
			state.fetchedAllCharacters = action.payload;
			state.charLoading = false;
			state.error = null;
		},
		getAllCharactersFailure: (state, action) => {
			state.charLoading = false;
			state.error = action.payload;
		},
		// Actions for fetching a specific character
		getSpecificCharacterStart: (state) => {
			state.charLoading = true;
		},
		getSpecificCharacterSuccess: (state, action) => {
			state.fetchedSpecificCharacter = action.payload;
			state.charLoading = false;
			state.error = null;
		},
		getSpecificCharacterFailure: (state, action) => {
			state.charLoading = false;
			state.error = action.payload;
		},
		// Actions for updating a specific character
		updateSpecificCharacterStart: (state) => {
			state.charLoading = true;
		},
		updateSpecificCharacterSuccess: (state, action) => {
			state.fetchedSpecificCharacter = action.payload;
			state.charLoading = false;
			state.error = null;
		},
		updateSpecificCharacterFailure: (state, action) => {
			state.charLoading = false;
			state.error = action.payload;
		},
	},
});

// Export action creators and the reducer from the characters slice
export const {
	getAllCharactersStart,
	getAllCharactersSuccess,
	getAllCharactersFailure,
	getSpecificCharacterStart,
	getSpecificCharacterSuccess,
	getSpecificCharacterFailure,
	updateSpecificCharacterStart,
	updateSpecificCharacterSuccess,
	updateSpecificCharacterFailure,
} = characterSlice.actions;

export default characterSlice.reducer;
