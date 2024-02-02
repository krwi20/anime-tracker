import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { persistor } from "../redux/store";
import {
	getSpecificAnimeStart,
	getSpecificAnimeSuccess,
	getSpecificAnimeFailure,
} from "../redux/anime/animeSlice";
import {
	updateUserStart,
	updateUserSuccess,
	updateUserFailure,
	signOut,
} from "../redux/user/userSlice";

const Anime = () => {
	// Extract the id from the url params
	const { id } = useParams();
	// Redux state - gets anime and user information
	const { fetchedSpecificAnime, loading } = useSelector((state) => state.anime);
	const { currentUser } = useSelector((state) => state.user);
	// Redux dispatch hook
	const dispatch = useDispatch();
	// React router hook for navigation
	const navigate = useNavigate();
	// State to manage the number of episodes the user's watched
	const [episodesWatched, setEpisodesWatched] = useState(
		currentUser?.trackedAnime?.[id]?.episodesWatched || 0
	);

	// Function to format the timestamp into more readable data
	const formatDate = (timestamp) => {
		const date = new Date(timestamp);
		const options = { year: "numeric", month: "long", day: "numeric" };
		return date.toLocaleDateString("en-US", options);
	};

	// Fetch the specific anime data
	useEffect(() => {
		const fetchSpecificAnime = async () => {
			try {
				// Redux store - dispatch action to start fetching specific anime data
				dispatch(getSpecificAnimeStart());
				const response = await fetch(
					`http://localhost:3001/api/anime/anime/${id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
				// Parse the data from the response
				const data = await response.json();
				// If the request is unsuccessful dispatch the failure with the data
				if (data.success === false) {
					dispatch(getSpecificAnimeFailure(data));
					return;
				}
				// If the request is successfull dispatch the success with the data
				dispatch(getSpecificAnimeSuccess(data));
			} catch (error) {
				// If there is an error dispatch the failure with the error
				dispatch(getSpecificAnimeFailure(error));
			}
		};
		// Call the fetch specific anime function
		fetchSpecificAnime();
	}, [dispatch, id]);

	// Function to add anime to the user's tracked anime
	const trackAnime = async (status) => {
		try {
			// Dispatch - start update the user
			dispatch(updateUserStart());
			// Backend fetch to add anime to the user's tracked anime
			const response = await fetch(`http://localhost:3001/api/auth/add`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: currentUser._id,
					animeId: id,
					status: status,
					timeUpdated: new Date(),
				}),
			});
			// Parse the data from the response
			const data = await response.json();
			// If the request is unsuccessful, sign the user out, clear the user redux state, redirect to login page
			if (data.success === false) {
				dispatch(updateUserFailure(data));
				dispatch(signOut());
				persistor.purge(["user"]);
				navigate("/login");
				return;
			}
			// If the request is successful dispatch the success of updating the user with the data
			dispatch(updateUserSuccess(data.updatedUser));
		} catch (error) {
			// If there is an error dispatch the failure with the error
			dispatch(updateUserFailure(error));
		}
	};

	// Function to update the user's rating for the anime
	const updateAnimeRating = async (rating) => {
		try {
			// Dispatch - start update the user
			dispatch(updateUserStart());
			// Backend fetch to update the user's rating
			const response = await fetch(`http://localhost:3001/api/auth/update`, {
				method: "PATCH",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: currentUser._id,
					animeId: id,
					rating: rating,
					timeUpdated: new Date(),
				}),
			});
			// Parse the data from the response
			const data = await response.json();
			// If the request is unsuccessful, sign the user out, clear the user redux state, redirect to login page
			if (data.success === false) {
				dispatch(updateUserFailure(data));
				dispatch(signOut());
				persistor.purge(["user"]);
				navigate("/login");
			}
			// If the request is successful dispatch the success of updating the user with the data
			dispatch(updateUserSuccess(data.updatedUser));
		} catch (error) {
			// If there is an error dispatch the failure with the error
			dispatch(updateUserFailure(error));
		}
	};

	// Function to remove anime from the user's list
	const removeAnime = async () => {
		try {
			// Dispatch - start update the user
			dispatch(updateUserStart());
			// Backend fetch to remove the anime from the user's list
			const response = await fetch(
				`http://localhost:3001/api/auth/remove/${currentUser._id}/${fetchedSpecificAnime._id}`,
				{
					method: "DELETE",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			// Parse the data from the response
			const data = await response.json();
			// If the request is unsuccessful, sign the user out, clear the user redux state, redirect to login page
			if (data.success === false) {
				dispatch(updateUserFailure(data));
				dispatch(signOut());
				persistor.purge(["user"]);
				navigate("/login");
			}
			// If the request is successful dispatch the success of updating the user with the data
			dispatch(updateUserSuccess(data));
		} catch (error) {
			// If there is an error dispatch the failure with the error
			dispatch(updateUserFailure(error));
		}
	};

	// Function to update the user's amount of episodes watched
	const updateEpisodesWatched = async () => {
		let value = episodesWatched;
		// If the total episodes are known, check if the user's input exceeds the total episodes
		if (
			fetchedSpecificAnime.episodes !== null &&
			value > fetchedSpecificAnime.episodes
		) {
			value = fetchedSpecificAnime.episodes;
		}
		// If the user's input is < 0, set the user's input to 0
		value = Math.max(0, value);

		try {
			// Dispatch - start update the user
			dispatch(updateUserStart());
			// Backend fetch to update the user's amount of episodes watched
			const response = await fetch(
				`http://localhost:3001/api/auth/updateEpisodes`,
				{
					method: "PATCH",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userId: currentUser._id,
						animeId: id,
						episodesWatched: value,
						timeUpdated: new Date(),
					}),
				}
			);
			// Parse the data from the response
			const data = await response.json();
			// If the request is unsuccessful, sign the user out, clear the user redux state, redirect to login page
			if (data.success === false) {
				dispatch(updateUserFailure(data));
				dispatch(signOut());
				persistor.purge(["user"]);
				navigate("/login");
			}
			// If the request is successful dispatch the success of updating the user with the data
			dispatch(updateUserSuccess(data.updatedUser));
		} catch (error) {
			// If there is an error dispatch the failure with the error
			dispatch(updateUserFailure(error));
		}
	};

	// Function to update the user's episodes watched by 1
	const updateEpisodesWatchedByOne = async () => {
		// Get the user's episode count for this anime
		let value = currentUser?.trackedAnime?.[id]?.episodesWatched;

		// If it's undefined, set the value to 1; otherwise, increment it
		value = value === undefined ? 1 : value + 1;

		// If it is increased over the total episode count for the anime, set the value as the highest amount of episodes
		if (value > fetchedSpecificAnime.episodes) {
			value = fetchedSpecificAnime.episodes;
		}
		try {
			// Dispatch - start update the user
			dispatch(updateUserStart());
			// Backend fetch to update the user's episodes watched
			const response = await fetch(
				`http://localhost:3001/api/auth/updateEpisodes`,
				{
					method: "PATCH",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userId: currentUser._id,
						animeId: id,
						episodesWatched: value,
						timeUpdated: new Date(),
					}),
				}
			);
			// Parse the data from the response
			const data = await response.json();
			// If the request is unsuccessful, sign the user out, clear the user redux state, redirect to login page
			if (data.success === false) {
				dispatch(updateUserFailure(data));
				dispatch(signOut());
				persistor.purge(["user"]);
				navigate("/login");
			}
			// If the request is successful dispatch the success of updating the user with the data
			dispatch(updateUserSuccess(data.updatedUser));
		} catch (error) {
			// If there is an error dispatch the failure with the error
			dispatch(updateUserFailure(error));
		}
	};

	return (
		<div className='bg-gradient-to-br from-gray-800 to-gray-700 text-white min-h-[calc(100vh-64px)] p-4'>
			{/* Loading spinner while being fetched */}
			{loading ? (
				<div className='flex items-center justify-center h-full'>
					<div className='animate-spin rounded-full border-t-2 border-b-2 border-[#8A4FFF] h-12 w-12'></div>
				</div>
			) : (
				<div>
					{/* Display the specific anime's information if there is any */}
					{fetchedSpecificAnime && (
						<div className='bg-gray-900 rounded-lg p-4 m-4'>
							<div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
								{/* Left column - anime details */}
								<div className='lg:col-span-2'>
									<div className='flex flex-col'>
										<h1 className='text-4xl font-bold mb-2'>
											{fetchedSpecificAnime.title}
										</h1>
										<p className='text-lg mb-4'>
											{fetchedSpecificAnime.title_jp}
										</p>
										<div className='flex mb-4'>
											<img
												src={fetchedSpecificAnime.customImageURL}
												alt={fetchedSpecificAnime.title}
												className='object-cover rounded-md w-[225px] h-[318px]'
											/>
											<div className='w-1/2 ml-4'>
												<span className='text-lg font-bold'>Description:</span>
												<div className='border-b-2 border-gray-700'></div>
												<p className='w-full'>
													{fetchedSpecificAnime.description}
												</p>
											</div>
										</div>
									</div>
								</div>
								{/* Center column - anime details */}
								<div className='lg:col-span-1 space-y-4'>
									<div className='flex flex-col'>
										<span className='text-lg font-bold'>Details:</span>
										<div className='border-b-2 border-gray-700'></div>
										<div className='flex flex-col mt-2 space-y-2'>
											{/* Anime Details */}
											<span>
												<span className='font-bold'>Type:</span>{" "}
												{fetchedSpecificAnime.type}
											</span>
											<span>
												<span className='font-bold'>Episodes:</span>{" "}
												{fetchedSpecificAnime.episodes
													? fetchedSpecificAnime.episodes
													: "Unknown"}
											</span>
											<span>
												<span className='font-bold'>Status:</span>{" "}
												{fetchedSpecificAnime.status}
											</span>
											<span>
												<span className='font-bold'>Aired:</span>{" "}
												{fetchedSpecificAnime.airedUntil
													? `${formatDate(
															fetchedSpecificAnime.airedFrom
													  )} to ${formatDate(
															fetchedSpecificAnime.airedUntil
													  )}`
													: `Aired from ${formatDate(
															fetchedSpecificAnime.airedFrom
													  )} - ?`}
											</span>
											<span>
												<span className='font-bold'>Premiered:</span>{" "}
												{fetchedSpecificAnime.season +
													" " +
													fetchedSpecificAnime.year}
											</span>
											<span>
												<span className='font-bold'>Producers:</span>{" "}
												{fetchedSpecificAnime.producers &&
												fetchedSpecificAnime.producers.filter(Boolean).length >
													0
													? fetchedSpecificAnime.producers
															.filter(Boolean)
															.join(", ")
													: "None added"}
											</span>
											<span>
												<span className='font-bold'>Licensors:</span>{" "}
												{fetchedSpecificAnime.licensors &&
												fetchedSpecificAnime.licensors.filter(Boolean).length >
													0
													? fetchedSpecificAnime.licensors
															.filter(Boolean)
															.join(", ")
													: "None added"}
											</span>
											<span>
												<span className='font-bold'>Studios:</span>{" "}
												{fetchedSpecificAnime.studios &&
												fetchedSpecificAnime.studios.filter(Boolean).length > 0
													? fetchedSpecificAnime.studios
															.filter(Boolean)
															.join(", ")
													: "None added"}
											</span>
											<span>
												<span className='font-bold'>Source:</span>{" "}
												{fetchedSpecificAnime.source}
											</span>
											<span>
												<span className='font-bold'>Genres:</span>{" "}
												{fetchedSpecificAnime.genres &&
												fetchedSpecificAnime.genres.filter(Boolean).length > 0
													? fetchedSpecificAnime.genres
															.filter(Boolean)
															.join(", ")
													: "None added"}
											</span>
											<span>
												<span className='font-bold'>Duration:</span>{" "}
												{fetchedSpecificAnime.duration}
											</span>
											<span>
												<span className='font-bold'>Rating:</span>{" "}
												{fetchedSpecificAnime.rating}
											</span>
										</div>
									</div>
								</div>
								{/* Right column - user actions */}
								<div className='lg:col-span-3 space-y-4'>
									<div className='border-b-2 border-gray-700'></div>
									{/* User status actions */}
									<div className='flex flex-col'>
										<span className='text-lg font-bold mb-2'>Your Status:</span>
										<div className='flex mt-2 space-x-4'>
											<button onClick={() => trackAnime("Watching")}>
												<span
													className={`px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-purple-600 
							${
								currentUser?.trackedAnime?.[id]?.status === "Watching"
									? "bg-purple-600"
									: ""
							}`}
												>
													Watching
												</span>
											</button>
											<button onClick={() => trackAnime("Completed")}>
												<span
													className={`px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-purple-600 
							${
								currentUser?.trackedAnime?.[id]?.status === "Completed"
									? "bg-purple-600"
									: ""
							}`}
												>
													Completed
												</span>
											</button>
											<button onClick={() => trackAnime("Plan to watch")}>
												<span
													className={`px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-purpl	e-600 
							${
								currentUser?.trackedAnime?.[id]?.status === "Plan to watch"
									? "bg-purple-600"
									: ""
							}`}
												>
													Plan to watch
												</span>
											</button>
											<button onClick={() => trackAnime("On Hold")}>
												<span
													className={`px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-purple-600 
							${
								currentUser?.trackedAnime?.[id]?.status === "On Hold"
									? "bg-purple-600"
									: ""
							}`}
												>
													On Hold
												</span>
											</button>
											<button onClick={() => trackAnime("Dropped")}>
												<span
													className={`px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-purple-600 
							${
								currentUser?.trackedAnime?.[id]?.status === "Dropped"
									? "bg-purple-600"
									: ""
							}`}
												>
													Dropped
												</span>
											</button>
										</div>
									</div>
									{/* User rating section */}
									<div className='flex flex-col'>
										<span className='text-lg font-bold'>Your Rating:</span>
										<div className='flex mt-2 space-x-4'>
											{/* Rating options */}
											{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
												<button
													key={num}
													onClick={() => updateAnimeRating(num)}
													className={`px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-purple-600${
														currentUser?.trackedAnime?.[id]?.rating === num
															? " bg-purple-600 py-2 px-4 rounded-md cursor-pointer"
															: ""
													}`}
												>
													{num}
												</button>
											))}
											<button
												onClick={() => updateAnimeRating("0")}
												className={`px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-purple-600`}
											>
												Remove
											</button>
										</div>
									</div>
									{/* Episodes watched section */}
									<div className='flex flex-col'>
										<span className='text-lg font-bold'>Episodes Watched:</span>
										<div className='flex mt-2 space-x-4'>
											{/* Increase episodes watched by one */}
											<button
												onClick={() => updateEpisodesWatchedByOne()}
												className='px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-purple-600'
											>
												+1
											</button>
											{/* Set episodes watched to input value */}
											<input
												type='number'
												min='0'
												max={fetchedSpecificAnime.episodes}
												placeholder={
													currentUser?.trackedAnime?.[id]?.episodesWatched
												}
												onChange={(e) => setEpisodesWatched(e.target.value)}
												className='w-16 p-2 rounded-md bg-gray-800'
											/>
											<button
												onClick={() => updateEpisodesWatched()}
												className='px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-purple-600'
											>
												Update
											</button>
										</div>
									</div>
									{/* User actions section */}
									<div className='flex flex-col'>
										<span className='text-lg font-bold'>Actions:</span>
										<div className='flex mt-2 space-x-4'>
											{/* Remove anime from tracked list */}
											<button
												onClick={() => removeAnime()}
												className='px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-red-500'
											>
												Remove from List
											</button>
											{/* If the user is an admin render this section */}
											{currentUser?.role === "admin" && (
												// Allows admins to edit the specific anime
												<button
													onClick={() => navigate(`/edit/anime/${id}`)}
													className='px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-green-500'
												>
													Edit Anime
												</button>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default Anime;
