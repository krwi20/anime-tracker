import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
	getUserStart,
	getUserSuccess,
	getUserFailure,
} from "../redux/user/userSlice";

const Profile = () => {
	const { username } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { currentUser, fetchedUser, loading } = useSelector(
		(state) => state.user
	);
	const [singleTest, setSingleTest] = useState([]);

	useEffect(() => {
		const fetchUserData = async () => {
			dispatch(getUserStart());
			try {
				const res = await fetch(
					`http://localhost:3001/api/auth/test/${username}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
				const data = await res.json();
				const recentAnimeIds = Object.keys(data.trackedAnime || {})
					.sort(
						(a, b) =>
							new Date(data.trackedAnime[b].timeUpdated).getTime() -
							new Date(data.trackedAnime[a].timeUpdated).getTime()
					)
					.slice(0, 3);
				const animeDataPromises = recentAnimeIds.map(fetchSpecificAnime);
				const animeData = await Promise.all(animeDataPromises);
				setSingleTest(animeData);
				dispatch(getUserSuccess(data));
				if (data.success === false) {
					dispatch(getUserFailure("User not found!"));
					navigate("/");
					return;
				}
			} catch (error) {
				dispatch(getUserFailure(error.message || "Something went wrong!"));
			}
		};

		fetchUserData();
	}, [dispatch, username, navigate]);

	const fetchSpecificAnime = async (animeId) => {
		try {
			const res = await fetch(
				`http://localhost:3001/api/anime/anime/${animeId}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			const data = await res.json();
			return data;
		} catch (error) {
			console.error("Error fetching specific anime:", error);
			throw error;
		}
	};

	return (
		<div className='bg-gradient-to-br from-purple-800 to-pink-500 text-white min-h-[calc(100vh-64px)] p-4'>
			{loading && (
				<div className='flex items-center justify-center h-full'>
					<div className='animate-spin rounded-full border-t-2 border-b-2 border-[#8A4FFF] h-12 w-12'></div>
				</div>
			)}
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
								<h1 className='text-3xl font-bold'>{fetchedUser.username}</h1>
								<p className='text-gray-400'>
									Member since{" "}
									{new Date(fetchedUser.createdAt).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric",
									})}
								</p>
							</div>
						</div>
						{currentUser && currentUser.username === fetchedUser.username && (
							<button className='bg-purple-600 rounded-md px-4 py-2 hover:bg-purple-700'>
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
								<div className='bg-gray-800 rounded-lg p-4 mb-6 space-y-6'>
									<hr className='border-t border-gray-600 mb-4' />
									<h1 className='text-2xl font-bold mb-4'>Anime Stats</h1>
									<div className='relative pt-1'>
										<div className='overflow-hidden h-4 mb-2 text-xs flex bg-emerald-200'>
											{["Watching", "Completed", "On Hold", "Dropped"].map(
												(status, index) => (
													<div
														key={index}
														style={{
															width: `${
																(Object.values(
																	fetchedUser.trackedAnime || {}
																).filter((anime) => anime.status === status)
																	.length /
																	Object.values(fetchedUser.trackedAnime || {})
																		.length) *
																100
															}%`,
														}}
														className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
															status === "Watching"
																? "bg-green-500"
																: status === "Completed"
																? "bg-purple-500"
																: status === "On Hold"
																? "bg-yellow-500"
																: status === "Dropped"
																? "bg-red-500"
																: ""
														}`}
													></div>
												)
											)}
										</div>
										<div className='flex justify-center text-xs mb-4 space-x-4'>
											{["Watching", "Completed", "On Hold", "Dropped"].map(
												(status, index) => (
													<div
														key={index}
														className={`flex items-center ${
															status === "Watching"
																? "text-green-500"
																: status === "Completed"
																? "text-purple-500"
																: status === "On Hold"
																? "text-yellow-500"
																: status === "Dropped"
																? "text-red-500"
																: ""
														}`}
													>
														<div
															className={`bg-${
																status === "Watching"
																	? "green-600"
																	: status === "Completed"
																	? "purple-600"
																	: status === "On Hold"
																	? "yellow-600"
																	: status === "Dropped"
																	? "red-600"
																	: ""
															} h-3 w-3 rounded-full mr-2`}
														></div>
														<p>{status}</p>
													</div>
												)
											)}
										</div>
									</div>
									<div className='flex justify-between text-sm'>
										<div className='flex flex-col'>
											<p>
												Total Entries:{" "}
												{Object.values(fetchedUser?.trackedAnime || {}).length}
											</p>
											<p>Rewatched: 0</p>
										</div>
										<p>
											Episodes:{" "}
											{Object.values(fetchedUser?.trackedAnime || {}).reduce(
												(total, anime) => total + (anime.episodesWatched || 0),
												0
											)}
										</p>
									</div>
								</div>
							</div>
							<div className='flex space-x-4 mb-6'>
								<button className='bg-gray-800 rounded-md flex-grow px-4 py-2 hover:bg-purple-600'>
									Anime List
								</button>
								<button className='bg-gray-800 rounded-md flex-grow px-4 py-2 hover:bg-purple-600'>
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
															onClick={() => navigate(`/anime/${anime._id}`)}
														>
															{anime?.title}
														</p>
														<div className='flex gap-4 items-center'>
															{fetchedUser?.trackedAnime[anime?._id]?.status ===
															"Watching" ? (
																<div className='w-full bg-gray-200 h-3 dark:bg-gray-700'>
																	<div
																		className='bg-green-600 h-3 dark:bg-green-500'
																		style={{
																			width: `${
																				((fetchedUser?.trackedAnime[anime?._id]
																					?.episodesWatched || 0) /
																					(anime?.episodes || 1)) *
																				100
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
																				((fetchedUser?.trackedAnime[anime?._id]
																					?.episodesWatched || 0) /
																					(anime?.episodes || 1)) *
																				100
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
																				((fetchedUser?.trackedAnime[anime?._id]
																					?.episodesWatched || 0) /
																					(anime?.episodes || 1)) *
																				100
																			}%`,
																		}}
																	></div>
																</div>
															) : (
																<div className='w-full bg-gray-200 h-3 dark:bg-gray-700'>
																	<div
																		className='bg-purple-600 h-3 dark:bg-purple-500'
																		style={{
																			width: `${
																				((fetchedUser?.trackedAnime[anime?._id]
																					?.episodesWatched || 0) /
																					(anime?.episodes || 1)) *
																				100
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
															{fetchedUser?.trackedAnime[anime?._id]?.status} -{" "}
															<span className='font-bold'>
																{
																	fetchedUser?.trackedAnime[anime?._id]
																		?.episodesWatched
																}
															</span>
															/{anime?.episodes} · Rating{" "}
															{fetchedUser?.trackedAnime[anime?._id]?.rating}
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
													elit. Sed do eiusmod tempor incididunt ut labore et
													dolore magna aliqua.
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
													elit. Sed do eiusmod tempor incididunt ut labore et
													dolore magna aliqua.
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
	);
};

export default Profile;
