import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	currentUser: null,
	fetchedUser: null,
	loading: false,
	error: false,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
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
	},
});

export const {
	signInStart,
	signInSuccess,
	signInFailure,
	getUserStart,
	getUserSuccess,
	getUserFailure,
} = userSlice.actions;
export default userSlice.reducer;
