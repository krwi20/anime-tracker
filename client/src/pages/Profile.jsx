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
		<div className='bg-[#171717] p-2 min-h-[calc(100vh-64px)] '>
			{loading && <p className='text-[#ededed]'>Loading...</p>}
			{fetchedUser && (
				<div className='bg-[#202020] text-[#ededed] mx-6 mt-6 rounded-lg'>
					<div className='flex items-center justify-between py-4 border-2 px-2 border-opacity-80 border-purple-500'>
						<h1>{fetchedUser.username}'s Profile</h1>

						{currentUser && currentUser.username === fetchedUser.username && (
							<button>Edit Profile</button>
						)}
					</div>
					<div className='flex'>
						{/* Left Side */}
						<div className='flex flex-col py-2 px-2'>
							{/* Image */}
							<img
								className='h-80 w-56'
								src={fetchedUser.profilePicture}
								alt='user_profile_image'
							/>
							{/* Small Subsection */}
							<div className='flex flex-col w-full'>
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
							</div>
							{/* Button Section */}
							<div className='flex justify-evenly gap-2 mt-4'>
								<button className='border-2 flex-grow'>Anime List</button>
								<button className='border-2 flex-grow'>Manga List</button>
							</div>
						</div>
						{/* Right Side */}
						<div className='flex flex-1 border-l-2 my-2 border-purple-500 px-2  flex-col'>
							{/* Description Background */}
							<div className='flex-grow p-2'>
								<p>No biography yet.</p>
							</div>
							{/* Border */}
							<div className='bg-gradient-to-br from-purple-500 to-pink-500 h-0.5'></div>
							{/* Anime Stats and Recent Anime Updates */}
							<div className='flex'>
								{/* Anime Stats */}
								<div className='flex-col p-2 w-1/2'>
									<h1>Anime Stats</h1>
									{/* Border */}
									<div className='bg-gradient-to-br from-purple-500 to-pink-500 h-0.5 mb-4'></div>
									{/* Progress Bar */}
									<div className='relative pt-1'>
										<div className='overflow-hidden h-4 mb-4 text-xs flex  bg-emerald-200'>
											<div
												style={{
													width: `${
														(Object.values(
															fetchedUser.trackedAnime || {}
														).filter((anime) => anime.status === "Completed")
															.length /
															Object.values(fetchedUser.trackedAnime || {})
																.length) *
														100
													}%`,
												}}
												className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500'
											></div>
											<div
												style={{
													width: `${
														(Object.values(
															fetchedUser.trackedAnime || {}
														).filter((anime) => anime.status === "Watching")
															.length /
															Object.values(fetchedUser.trackedAnime || {})
																.length) *
														100
													}%`,
												}}
												className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500'
											></div>
											<div
												style={{
													width: `${
														(Object.values(
															fetchedUser.trackedAnime || {}
														).filter((anime) => anime.status === "Dropped")
															.length /
															Object.values(fetchedUser.trackedAnime || {})
																.length) *
														100
													}%`,
												}}
												className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500'
											></div>
											<div
												style={{
													width: `${
														(Object.values(
															fetchedUser.trackedAnime || {}
														).filter((anime) => anime.status === "On Hold")
															.length /
															Object.values(fetchedUser.trackedAnime || {})
																.length) *
														100
													}%`,
												}}
												className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500'
											></div>
										</div>
									</div>
									{/*  */}
									<div className='flex justify-between'>
										<div className='flex flex-col'>
											{/* P Container */}
											<div className='flex items-center mb-2 text-xs'>
												{/* Circle Indicator */}
												<div className='bg-green-600 h-4 w-4 rounded-full mr-2'></div>
												<p>
													Watching{" "}
													{fetchedUser.trackedAnime
														? Object.values(fetchedUser.trackedAnime).filter(
																(anime) => anime.status === "Watching"
														  ).length
														: 0}
												</p>
											</div>
											{/* P Container */}
											<div className='flex items-center mb-2 text-xs'>
												{/* Circle Indicator */}
												<div className='bg-purple-600 h-4 w-4 rounded-full mr-2'></div>
												<p>
													Completed{" "}
													{fetchedUser.trackedAnime
														? Object.values(fetchedUser.trackedAnime).filter(
																(anime) => anime.status === "Completed"
														  ).length
														: 0}
												</p>
											</div>
											{/* P Container */}
											<div className='flex items-center mb-2 text-xs'>
												{/* Circle Indicator */}
												<div className='bg-yellow-600 h-4 w-4 rounded-full mr-2'></div>
												<p>
													On Hold{" "}
													{fetchedUser.trackedAnime
														? Object.values(fetchedUser.trackedAnime).filter(
																(anime) => anime.status === "On Hold"
														  ).length
														: 0}
												</p>
											</div>
											{/* P Container */}
											<div className='flex items-center mb-2 text-xs'>
												{/* Circle Indicator */}
												<div className='bg-red-600 h-4 w-4 rounded-full mr-2'></div>
												<p>
													Dropped{" "}
													{fetchedUser.trackedAnime
														? Object.values(fetchedUser.trackedAnime).filter(
																(anime) => anime.status === "Dropped"
														  ).length
														: 0}
												</p>
											</div>
										</div>
										<div className='text-xs'>
											<p>
												Total Entries{" "}
												{Object.values(fetchedUser?.trackedAnime || {}).length}
											</p>
											<p>Rewatched 0</p>
											<p>
												Episodes{" "}
												{Object.values(fetchedUser?.trackedAnime || {}).reduce(
													(total, anime) =>
														total + (anime.episodesWatched || 0),
													0
												)}
											</p>
										</div>
									</div>
								</div>

								{/* Recent Anime Updates */}
								<div className='flex-col p-2 w-1/2'>
									<h1>Recent Anime</h1>
									{/* Border */}
									<div className='bg-gradient-to-br from-purple-500 to-pink-500 h-0.5 mb-4'></div>
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
														{/* Progress Bar */}
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
														{/* Watching + Rating */}
														<p>
															{fetchedUser?.trackedAnime[anime?._id]?.status}
															{" - "}
															<span className='font-bold'>
																{
																	fetchedUser?.trackedAnime[anime?._id]
																		?.episodesWatched
																}
															</span>
															{"/"}
															{anime?.episodes}
															{"  ·  "}
															Rating{" "}
															{fetchedUser?.trackedAnime[anime?._id]?.rating}
														</p>
													</div>
												</div>
											</div>
										</ul>
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
