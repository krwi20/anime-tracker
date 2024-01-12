import { createSlice } from "@reduxjs/toolkit";

// Initial state for the user slice
const initialState = {
	currentUser: null, // Holds data for current usewr
	fetchedUser: null, // Holds data for fetched user
	loading: false, // Indicates if data is loading
	error: false, // Holds any errors from fetching
};

// Create the user slice
const userSlice = createSlice({
	name: "user", // Name of slice
	initialState, // Initial state as defined above
	reducers: {
		// Actions for user sign in
		signInStart: (state) => {
			state.loading = true;
		},
		signInSuccess: (state, action) => {
			state.currentUser = action.payload;
			state.loading = false;
			state.error = false;
		},
		signInFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		// Actions for fetching user data
		getUserStart: (state) => {
			state.loading = true;
		},
		getUserSuccess: (state, action) => {
			state.fetchedUser = action.payload;
			state.loading = false;
			state.error = null;
		},
		getUserFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		// Actions for updating user data

		updateUserStart: (state) => {
			state.loading = true;
		},
		updateUserSuccess: (state, action) => {
			state.currentUser = action.payload;
			state.loading = false;
			state.error = false;
		},
		updateUserFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		// Actions for sign out
		signOut: (state) => {
			state.currentUser = null;
			state.loading = false;
			state.error = false;
		},
	},
});

// Export action creators and the reducer from the user slice
export const {
	signInStart,
	signInSuccess,
	signInFailure,
	getUserStart,
	getUserSuccess,
	getUserFailure,
	updateUserStart,
	updateUserSuccess,
	updateUserFailure,
	signOut,
} = userSlice.actions;
export default userSlice.reducer;
