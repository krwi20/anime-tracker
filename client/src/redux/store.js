import {
	combineReducers,
	configureStore,
	getDefaultMiddleware,
} from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Import the user and anime reducers
import userReducer from "./user/userSlice";
import animeReducer from "./anime/animeSlice";
import mangaReducer from "./manga/mangaSlice";

// Combine the user, anime & manga reducers into a root reducer
const rootReducer = combineReducers({
	user: userReducer,
	anime: animeReducer,
	manga: mangaReducer,
});

// Configuration for Redux Persist
const persistConfig = {
	key: "root",
	version: 1,
	storage,
};

// Create a persisted reducer using Redux Persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the redux store
export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

// Create and export the persistor for persisting the Redux store
export const persistor = persistStore(store);
