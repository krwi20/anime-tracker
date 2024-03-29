import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
	getUserStart,
	getUserSuccess,
	getUserFailure,
} from "../redux/user/userSlice";

const Profile = () => {
	// Extract the username from the url params
	const { username } = useParams();
	// Redux dispatch hook
	const dispatch = useDispatch();
	// React router hook for navigation
	const navigate = useNavigate();
	// Redux state - gets current and fetched user information
	const { currentUser, fetchedUser, loading } = useSelector(
		(state) => state.user
	);
	// State to manage the anime edit updates
	const [singleTest, setSingleTest] = useState([]);
	// State to manage the Manga edit updates
	const [singleTest2, setSingleTest2] = useState([]);

	// Fetch user data
	useEffect(() => {
		const fetchUserData = async () => {
			// Redux store - dispatch action to start fetching the user
			dispatch(getUserStart());
			try {
				// Backend fetch to get user information
				const response = await fetch(
					`http://localhost:3001/api/auth/test/${username}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
				// Parse the data from the response
				const data = await response.json();
				// Obtain the anime IDs of the 3 most recent tracked animes
				const recentAnimeIds = Object.keys(data.trackedAnime || {})
					.sort(
						(a, b) =>
							new Date(data.trackedAnime[b].timeUpdated).getTime() -
							new Date(data.trackedAnime[a].timeUpdated).getTime()
					)
					.slice(0, 3);
				// Fetch specific data from the most recent IDs
				const animeDataPromises = recentAnimeIds.map(fetchSpecificAnime);
				const animeData = await Promise.all(animeDataPromises);
				// Set the state with the fetched data
				setSingleTest(animeData);
				// Obtain the manga IDs of the 3 most recent tracked manga
				const recentMangaIds = Object.keys(data.trackedManga || {})
					.sort(
						(a, b) =>
							new Date(data.trackedManga[b].timeUpdated).getTime() -
							new Date(data.trackedManga[a].timeUpdated).getTime()
					)
					.slice(0, 3);
				// Fetch specific data from the most recent IDs
				const mangaDataPromises = recentMangaIds.map(fetchSpecificManga);
				const mangaData = await Promise.all(mangaDataPromises);
				// Set the state with the fetched data
				setSingleTest2(mangaData);
				//  If the request is unsuccessful dispatch the failure "User not found!" redirect to homepage
				if (data.success === false) {
					dispatch(getUserFailure("User not found!"));
					navigate("/");
				}
				// If the request is successful dispatch the success with the data
				dispatch(getUserSuccess(data));
			} catch (error) {
				// If the request has an error dispatch the failure witht the error message or default "something went wrong"
				dispatch(getUserFailure(error.message || "Something went wrong!"));
			}
		};
		// Call the fetch user data function
		fetchUserData();
	}, [dispatch, username, navigate]);

	// Function to fetch the specific anime
	const fetchSpecificAnime = async (animeId) => {
		try {
			// Backend fetch to get the specific anime
			const response = await fetch(
				`http://localhost:3001/api/anime/anime/${animeId}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			// Parse the data from the response
			const data = await response.json();
			// Return the data
			return data;
		} catch (error) {
			// Console log the error
			console.error("Error fetching specific anime:", error);
		}
	};

	// Function to fetch the specific manga
	const fetchSpecificManga = async (mangaId) => {
		try {
			// Backend fetch to get the specific manga
			const response = await fetch(
				`http://localhost:3001/api/manga/manga/${mangaId}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			// Parse the data from the response
			const data = await response.json();
			// Return the data
			return data;
		} catch (error) {
			// Console log the error
			console.error("Error fetching specific manga:", error);
		}
	};

	return (
		<div className='bg-gradient-to-br from-gray-800 to-gray-700 text-white min-h-[calc(100vh-64px)] p-4'>
			{/* Show loading spinner when data is being fetched */}
			{loading ? (
				<div className='flex items-center justify-center h-full'>
					<div className='animate-spin rounded-full border-t-2 border-b-2 border-[#8A4FFF] h-12 w-12'></div>
				</div>
			) : (
				<div>
					{/* Display user information if it exists */}
					{fetchedUser && (
						<div className='bg-gray-900 text-white mx-4 mt-6 rounded-lg p-6'>
							<div className='flex items-center justify-between mb-6'>
								<div className='flex items-center'>
									<img
										className='h-20 w-20 rounded-full mr-4 object-cover'
										src={fetchedUser.profilePicture}
										alt='user_profile_image'
									/>
									<div>
										<h1 className='text-3xl font-bold'>
											{fetchedUser.username}
										</h1>
										<p className='text-gray-400'>
											Member since{" "}
											{new Date(fetchedUser.createdAt).toLocaleDateString(
												"en-US",
												{
													month: "short",
													day: "numeric",
													year: "numeric",
												}
											)}
										</p>
									</div>
								</div>
								{currentUser &&
									currentUser.username === fetchedUser.username && (
										<button className='bg-blue-600 rounded-md px-4 py-2 hover:bg-blue-700'>
											Edit Profile
										</button>
									)}
							</div>
							<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
								<div>
									<div className='bg-gray-800 rounded-lg p-4 mb-6'>
										<div className='flex justify-between'>
											<div className='flex items-center w-full'>
												<p>Last Online</p>
												<p className='ml-auto'>Now</p>
											</div>
										</div>
										<div className='flex justify-between'>
											<div className='flex items-center w-full'>
												<p>Location</p>
												<p className='ml-auto'>UK</p>
											</div>
										</div>
										<div className='flex justify-between'>
											<div className='flex items-center w-full'>
												<p>Joined</p>
												<p className='ml-auto'>
													{new Date(fetchedUser.createdAt).toLocaleDateString(
														"en-US",
														{
															month: "short",
															day: "numeric",
															year: "numeric",
														}
													)}
												</p>
											</div>
										</div>
										{/* Anime Stats */}
										<div className='bg-gray-800 rounded-lg p-4 mb-6 space-y-6'>
											<hr className='border-t border-gray-600 mb-4' />
											<h1 className='text-2xl font-bold mb-4'>Anime Stats</h1>
											<div className='relative pt-1'>
												<div className='overflow-hidden h-4 mb-2 text-xs flex bg-emerald-200'>
													{[
														"Watching",
														"Completed",
														"On Hold",
														"Dropped",
														"Plan to watch",
													].map((status, index) => (
														<div
															key={index}
															style={{
																width: `${
																	(Object.values(
																		fetchedUser.trackedAnime || {}
																	).filter((anime) => anime.status === status)
																		.length /
																		Object.values(
																			fetchedUser.trackedAnime || {}
																		).length) *
																	100
																}%`,
															}}
															className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
																status === "Watching"
																	? "bg-green-500"
																	: status === "Completed"
																	? "bg-blue-500"
																	: status === "On Hold"
																	? "bg-yellow-500"
																	: status === "Dropped"
																	? "bg-red-500"
																	: status === "Plan to watch"
																	? "bg-gray-200"
																	: ""
															}`}
														></div>
													))}
												</div>
												<div className='flex justify-center text-xs mb-4 space-x-4'>
													{[
														"Watching",
														"Completed",
														"On Hold",
														"Dropped",
														"Plan to watch",
													].map((status, index) => (
														<div
															key={index}
															className={`flex items-center ${
																status === "Watching"
																	? "text-green-500"
																	: status === "Completed"
																	? "text-blue-500"
																	: status === "On Hold"
																	? "text-yellow-500"
																	: status === "Dropped"
																	? "text-red-500"
																	: status === "Plan to watch"
																	? "text-gray-200"
																	: ""
															}`}
														>
															<div
																className={`bg-${
																	status === "Watching"
																		? "green-600"
																		: status === "Completed"
																		? "blue-500"
																		: status === "On Hold"
																		? "yellow-500"
																		: status === "Dropped"
																		? "red-600"
																		: status === "Plan to watch"
																		? "gray-200"
																		: ""
																} h-3 w-3 rounded-full mr-2`}
															></div>
															<p>{status}</p>
														</div>
													))}
												</div>
											</div>
											<div className='flex justify-between text-sm'>
												<div className='flex flex-col'>
													<p>
														Total Entries:{" "}
														{
															Object.values(fetchedUser?.trackedAnime || {})
																.length
														}
													</p>
													<p>Rewatched: 0</p>
												</div>
												<p>
													Episodes:{" "}
													{Object.values(
														fetchedUser?.trackedAnime || {}
													).reduce(
														(total, anime) =>
															total + (anime.episodesWatched || 0),
														0
													)}
												</p>
											</div>
										</div>
										{/* Manga Stats */}
										<div className='bg-gray-800 rounded-lg p-4 mb-6 space-y-6'>
											<hr className='border-t border-gray-600 mb-4' />
											<h1 className='text-2xl font-bold mb-4'>Manga Stats</h1>
											<div className='relative pt-1'>
												<div className='overflow-hidden h-4 mb-2 text-xs flex bg-emerald-200'>
													{[
														"Reading",
														"Completed",
														"On Hold",
														"Dropped",
														"Plan to read",
													].map((status, index) => (
														<div
															key={index}
															style={{
																width: `${
																	(Object.values(
																		fetchedUser.trackedManga || {}
																	).filter((manga) => manga.status === status)
																		.length /
																		Object.values(
																			fetchedUser.trackedManga || {}
																		).length) *
																	100
																}%`,
															}}
															className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
																status === "Reading"
																	? "bg-green-500"
																	: status === "Completed"
																	? "bg-blue-500"
																	: status === "On Hold"
																	? "bg-yellow-500"
																	: status === "Dropped"
																	? "bg-red-500"
																	: status === "Plan to read"
																	? "bg-gray-200"
																	: ""
															}`}
														></div>
													))}
												</div>
												<div className='flex justify-center text-xs mb-4 space-x-4'>
													{[
														"Reading",
														"Completed",
														"On Hold",
														"Dropped",
														"Plan to read",
													].map((status, index) => (
														<div
															key={index}
															className={`flex items-center ${
																status === "Reading"
																	? "text-green-500"
																	: status === "Completed"
																	? "text-blue-500"
																	: status === "On Hold"
																	? "text-yellow-500"
																	: status === "Dropped"
																	? "text-red-500"
																	: status === "Plan to read"
																	? "text-gray-200"
																	: ""
															}`}
														>
															<div
																className={`bg-${
																	status === "Reading"
																		? "green-600"
																		: status === "Completed"
																		? "blue-500"
																		: status === "On Hold"
																		? "yellow-500"
																		: status === "Dropped"
																		? "red-600"
																		: status === "Plan to read"
																		? "gray-200"
																		: ""
																} h-3 w-3 rounded-full mr-2`}
															></div>
															<p>{status}</p>
														</div>
													))}
												</div>
											</div>
											<div className='flex justify-between text-sm'>
												<div className='flex flex-col'>
													<p>
														Total Entries:{" "}
														{
															Object.values(fetchedUser?.trackedManga || {})
																.length
														}
													</p>
													<p>Rewatched: 0</p>
												</div>
												<div className='flex flex-col'>
													<p>
														Chapters Read:{" "}
														{Object.values(
															fetchedUser?.trackedManga || {}
														).reduce(
															(total, manga) =>
																total + (manga.chaptersRead || 0),
															0
														)}
													</p>
													<p>
														Volumes Read:{" "}
														{Object.values(
															fetchedUser?.trackedManga || {}
														).reduce(
															(total, manga) =>
																total + (manga.volumesRead || 0),
															0
														)}
													</p>
												</div>
											</div>
										</div>
									</div>
									<div className='flex space-x-4 mb-6'>
										<button
											className='bg-gray-800 rounded-md flex-grow px-4 py-2 hover:bg-blue-600'
											onClick={() =>
												navigate(`/${fetchedUser.username}/anime-list`)
											}
										>
											Anime List
										</button>
										<button
											className='bg-gray-800 rounded-md flex-grow px-4 py-2 hover:bg-blue-600'
											onClick={() =>
												navigate(`/${fetchedUser.username}/manga-list`)
											}
										>
											Manga List
										</button>
									</div>
								</div>
								<div className='col-span-2'>
									<div className='bg-gray-800 rounded-lg p-4 mb-6'>
										<p className='text-sm'>
											{fetchedUser.biography || "No biography yet."}
										</p>
									</div>
									{/* Anime */}
									<div>
										<h2 className='text-2xl font-bold mb-4'>
											Recent Anime Updates
										</h2>
										<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
											{singleTest.map((anime, index) => (
												<ul key={index} className='mb-4'>
													<div className='flex items-stretch'>
														<div className='flex flex-grow'>
															<img
																src={anime?.customImageURL}
																alt=''
																className='h-16 w-12 cursor-pointer'
																onClick={() => navigate(`/anime/${anime._id}`)}
															/>
															<div className='flex flex-col px-2 text-xs flex-grow justify-between'>
																<p
																	className='cursor-pointer'
																	onClick={() =>
																		navigate(`/anime/${anime._id}`)
																	}
																>
																	{anime?.title}
																</p>
																<div className='flex gap-4 items-center'>
																	{fetchedUser?.trackedAnime[anime?._id]
																		?.status === "Watching" ? (
																		<div className='w-full bg-gray-200 h-3 dark:bg-gray-700'>
																			<div
																				className='bg-green-600 h-3 dark:bg-green-500'
																				style={{
																					width: `${
																						fetchedUser?.trackedAnime[
																							anime?._id
																						]?.episodesWatched !== null &&
																						anime?.episodes !== null
																							? ((fetchedUser?.trackedAnime[
																									anime?._id
																							  ]?.episodesWatched || 0) /
																									anime?.episodes) *
																							  100
																							: 50
																					}%`,
																				}}
																			></div>
																		</div>
																	) : fetchedUser?.trackedAnime[anime?._id]
																			?.status === "On Hold" ? (
																		<div className='w-full bg-gray-200 h-3 dark:bg-gray-700'>
																			<div
																				className='bg-yellow-400 h-3'
																				style={{
																					width: `${
																						fetchedUser?.trackedAnime[
																							anime?._id
																						]?.episodesWatched !== null &&
																						anime?.episodes !== null
																							? ((fetchedUser?.trackedAnime[
																									anime?._id
																							  ]?.episodesWatched || 0) /
																									anime?.episodes) *
																							  100
																							: 50
																					}%`,
																				}}
																			></div>
																		</div>
																	) : fetchedUser?.trackedAnime[anime?._id]
																			?.status === "Dropped" ? (
																		<div className='w-full bg-gray-200 h-3 dark:bg-gray-700'>
																			<div
																				className='bg-red-600 h-3 dark:bg-red-500'
																				style={{
																					width: `${
																						fetchedUser?.trackedAnime[
																							anime?._id
																						]?.episodesWatched !== null &&
																						anime?.episodes !== null
																							? ((fetchedUser?.trackedAnime[
																									anime?._id
																							  ]?.episodesWatched || 0) /
																									anime?.episodes) *
																							  100
																							: 50
																					}%`,
																				}}
																			></div>
																		</div>
																	) : fetchedUser?.trackedAnime[anime?._id]
																			?.status === "Plan to watch" ? (
																		<div className='w-full bg-gray-200 h-3 dark:bg-gray-700'>
																			<div
																				className='bg-gray-600 h-3 dark:bg-gray-500'
																				style={{
																					width: `${
																						fetchedUser?.trackedAnime[
																							anime?._id
																						]?.episodesWatched !== null &&
																						anime?.episodes !== null
																							? ((fetchedUser?.trackedAnime[
																									anime?._id
																							  ]?.episodesWatched || 0) /
																									anime?.episodes) *
																							  100
																							: 50
																					}%`,
																				}}
																			></div>
																		</div>
																	) : (
																		<div className='w-full bg-gray-200 h-3 dark:bg-gray-700'>
																			<div
																				className='bg-blue-600 h-3 dark:bg-blue-500'
																				style={{
																					width: `${
																						fetchedUser?.trackedAnime[
																							anime?._id
																						]?.episodesWatched !== null &&
																						anime?.episodes !== null
																							? ((fetchedUser?.trackedAnime[
																									anime?._id
																							  ]?.episodesWatched || 0) /
																									anime?.episodes) *
																							  100
																							: 100
																					}%`,
																				}}
																			></div>
																		</div>
																	)}
																	<p>
																		{new Date(
																			fetchedUser?.trackedAnime[
																				anime?._id
																			]?.timeUpdated
																		).toLocaleTimeString()}
																	</p>
																</div>
																<p>
																	{
																		fetchedUser?.trackedAnime[anime?._id]
																			?.status
																	}{" "}
																	-{" "}
																	<span className='font-bold'>
																		{
																			fetchedUser?.trackedAnime[anime?._id]
																				?.episodesWatched
																		}
																	</span>
																	/{anime?.episodes} · Rating{" "}
																	{
																		fetchedUser?.trackedAnime[anime?._id]
																			?.rating
																	}
																</p>
															</div>
														</div>
													</div>
												</ul>
											))}
										</div>
									</div>
									{/* Manga */}
									<div>
										<h2 className='text-2xl font-bold mb-4'>
											Recent Manga Updates
										</h2>
										<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
											{singleTest2.map((manga, index) => (
												<ul key={index} className='mb-4'>
													<div className='flex items-stretch'>
														<div className='flex flex-grow'>
															<img
																src={manga?.customImageURL}
																alt=''
																className='h-16 w-12 cursor-pointer'
																onClick={() => navigate(`/manga/${manga._id}`)}
															/>
															<div className='flex flex-col px-2 text-xs flex-grow justify-between'>
																<p
																	className='cursor-pointer'
																	onClick={() =>
																		navigate(`/manga/${manga._id}`)
																	}
																>
																	{manga?.title}
																</p>
																<div className='flex gap-4 items-center'>
																	{fetchedUser?.trackedManga[manga?._id]
																		?.status === "Reading" ? (
																		<div className='w-full bg-gray-200 h-3 dark:bg-gray-700'>
																			<div
																				className='bg-green-600 h-3 dark:bg-green-500'
																				style={{
																					width: `${
																						fetchedUser?.trackedManga[
																							manga?._id
																						]?.chaptersRead !== null &&
																						manga?.chapters !== null
																							? ((fetchedUser?.trackedManga[
																									manga?._id
																							  ]?.chaptersRead || 0) /
																									manga?.chapters) *
																							  100
																							: 50
																					}%`,
																				}}
																			></div>
																		</div>
																	) : fetchedUser?.trackedManga[manga?._id]
																			?.status === "On Hold" ? (
																		<div className='w-full bg-gray-200 h-3 dark:bg-gray-700'>
																			<div
																				className='bg-yellow-400 h-3'
																				style={{
																					width: `${
																						fetchedUser?.trackedManga[
																							manga?._id
																						]?.chaptersRead !== null &&
																						manga?.chapters !== null
																							? ((fetchedUser?.trackedManga[
																									manga?._id
																							  ]?.chaptersRead || 0) /
																									manga?.chapters) *
																							  100
																							: 50
																					}%`,
																				}}
																			></div>
																		</div>
																	) : fetchedUser?.trackedManga[manga?._id]
																			?.status === "Dropped" ? (
																		<div className='w-full bg-gray-200 h-3 dark:bg-gray-700'>
																			<div
																				className='bg-red-600 h-3 dark:bg-red-500'
																				style={{
																					width: `${
																						fetchedUser?.trackedManga[
																							manga?._id
																						]?.chaptersRead !== null &&
																						manga?.chapters !== null
																							? ((fetchedUser?.trackedManga[
																									manga?._id
																							  ]?.chaptersRead || 0) /
																									manga?.chapters) *
																							  100
																							: 50
																					}%`,
																				}}
																			></div>
																		</div>
																	) : fetchedUser?.trackedManga[manga?._id]
																			?.status === "Plan to read" ? (
																		<div className='w-full bg-gray-200 h-3 dark:bg-gray-700'>
																			<div
																				className='bg-gray-600 h-3 dark:bg-gray-500'
																				style={{
																					width: `${
																						fetchedUser?.trackedManga[
																							manga?._id
																						]?.chaptersRead !== null &&
																						manga?.chapters !== null
																							? ((fetchedUser?.trackedManga[
																									manga?._id
																							  ]?.chaptersRead || 0) /
																									manga?.chapters) *
																							  100
																							: 50
																					}%`,
																				}}
																			></div>
																		</div>
																	) : (
																		<div className='w-full bg-gray-200 h-3 dark:bg-gray-700'>
																			<div
																				className='bg-blue-600 h-3 dark:bg-blue-500'
																				style={{
																					width: `${
																						fetchedUser?.trackedManga[
																							manga?._id
																						]?.chaptersRead !== null &&
																						manga?.chapters !== null
																							? ((fetchedUser?.trackedManga[
																									manga?._id
																							  ]?.chaptersRead || 0) /
																									manga?.chapters) *
																							  100
																							: 100
																					}%`,
																				}}
																			></div>
																		</div>
																	)}
																	<p>
																		{new Date(
																			fetchedUser?.trackedManga[
																				manga?._id
																			]?.timeUpdated
																		).toLocaleTimeString()}
																	</p>
																</div>
																<p>
																	{
																		fetchedUser?.trackedManga[manga?._id]
																			?.status
																	}{" "}
																	-{" "}
																	<span className='font-bold'>
																		{
																			fetchedUser?.trackedManga[manga?._id]
																				?.chaptersRead
																		}
																	</span>
																	/{manga?.chapters} · Rating{" "}
																	{
																		fetchedUser?.trackedManga[manga?._id]
																			?.rating
																	}
																</p>
															</div>
														</div>
													</div>
												</ul>
											))}
										</div>
									</div>
									<div className='mb-4'>
										<h2 className='text-2xl font-bold mb-4'>Favourite Anime</h2>
										<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
											{[...Array(4)].map((_, index) => (
												<div
													key={index}
													className='bg-gray-800 rounded-lg overflow-hidden'
												>
													<div className='h-40 relative'>
														<img
															src='https://cdn.myanimelist.net/images/anime/1337/99013.jpg'
															alt='Favorite Anime Placeholder'
															className='absolute top-0 left-0 w-full h-full object-cover'
														/>
													</div>
													<div className='p-4'>
														<p className='text-lg font-bold mb-2 cursor-pointer'>
															Favorite Anime Title
														</p>
														<p className='text-sm mb-1'>Rating: 8.5</p>
														<p className='text-xs text-gray-400 line-clamp-3'>
															Lorem ipsum dolor sit amet, consectetur adipiscing
															elit. Sed do eiusmod tempor incididunt ut labore
															et dolore magna aliqua.
														</p>
													</div>
												</div>
											))}
										</div>
									</div>
									<div>
										<h2 className='text-2xl font-bold mb-4'>
											Favourite Characters
										</h2>
										<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
											{[...Array(4)].map((_, index) => (
												<div
													key={index}
													className='bg-gray-800 rounded-lg overflow-hidden'
												>
													<div className='h-40 relative'>
														<img
															src='https://cdn.myanimelist.net/images/anime/1337/99013.jpg'
															alt='Favorite Anime Placeholder'
															className='absolute top-0 left-0 w-full h-full object-cover'
														/>
													</div>
													<div className='p-4'>
														<p className='text-lg font-bold mb-2 cursor-pointer'>
															Favorite Character Name
														</p>
														<p className='text-xs text-gray-400 line-clamp-3'>
															Lorem ipsum dolor sit amet, consectetur adipiscing
															elit. Sed do eiusmod tempor incididunt ut labore
															et dolore magna aliqua.
														</p>
													</div>
												</div>
											))}
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

export default Profile;
