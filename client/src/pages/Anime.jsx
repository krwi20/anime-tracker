import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
	getSpecificAnimeStart,
	getSpecificAnimeSuccess,
	getSpecificAnimeFailure,
} from "../redux/anime/animeSlice";

import {
	updateUserStart,
	updateUserSuccess,
	updateUserFailure,
} from "../redux/user/userSlice";

const Anime = () => {
	const { id } = useParams();
	const { fetchedSpecificAnime, loading } = useSelector((state) => state.anime);
	const { currentUser } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const formatDate = (timestamp) => {
		const date = new Date(timestamp);
		// Options for formatting the date, adjust as needed
		const options = { year: "numeric", month: "long", day: "numeric" };
		return date.toLocaleDateString("en-US", options);
	};

	useEffect(() => {
		const fetchSpecificAnime = async () => {
			try {
				dispatch(getSpecificAnimeStart());
				const res = await fetch(`http://localhost:3001/api/anime/anime/${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				const data = await res.json();
				if (data.success === false) {
					dispatch(getSpecificAnimeFailure(data));
					return;
				}
				dispatch(getSpecificAnimeSuccess(data));
			} catch (error) {
				dispatch(getSpecificAnimeFailure(error));
			}
		};

		fetchSpecificAnime();
	}, [dispatch, id]);

	const boop = async (status) => {
		try {
			dispatch(updateUserStart());
			const res = await fetch(`http://localhost:3001/api/auth/add`, {
				method: "POST",
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

			const data = await res.json();
			if (data.success === false) {
				dispatch(updateUserFailure(data));
				return;
			}
			dispatch(updateUserSuccess(data.updatedUser));
		} catch (error) {
			dispatch(updateUserFailure(error));
		}
	};

	const updateAnimeRating = async (rating) => {
		try {
			dispatch(updateUserStart());
			const res = await fetch(`http://localhost:3001/api/auth/update`, {
				method: "PATCH",
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
			const data = await res.json();
			if (data.success === false) {
				dispatch(updateUserFailure(data));
				return;
			}
			dispatch(updateUserSuccess(data.updatedUser));
		} catch (error) {
			dispatch(updateUserFailure(error));
		}
	};

	const removeAnime = async () => {
		try {
			dispatch(updateUserStart());
			const res = await fetch(
				`http://localhost:3001/api/auth/remove/${currentUser._id}/${fetchedSpecificAnime._id}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			const data = await res.json();
			if (data.success === false) {
				dispatch(updateUserFailure(data));
				return;
			}
			dispatch(updateUserSuccess(data));
		} catch (error) {
			dispatch(updateUserFailure(error));
		}
	};

	const updateEpisodesWatched = async (e) => {
		let value = e.target.value;
		if (value > fetchedSpecificAnime.episodes) {
			value = fetchedSpecificAnime.episodes;
		} else if (value < 0) {
			value = 0;
		}
		try {
			await new Promise((resolve) => setTimeout(resolve, 500));

			dispatch(updateUserStart());
			const res = await fetch(`http://localhost:3001/api/auth/updateEpisodes`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: currentUser._id,
					animeId: id,
					episodesWatched: value,
					timeUpdated: new Date(),
				}),
			});
			const data = await res.json();
			console.log(data);
			if (data.success === false) {
				dispatch(updateUserFailure(data));
				return;
			}
			dispatch(updateUserSuccess(data.updatedUser));
		} catch (error) {
			dispatch(updateUserFailure(error));
		}
	};

	const updateEpisodesWatchedByOne = async () => {
		let value = currentUser.trackedAnime?.[id]?.episodesWatched + 1;
		if (value > fetchedSpecificAnime.episodes) {
			value = fetchedSpecificAnime.episodes;
		}
		try {
			dispatch(updateUserStart());
			const res = await fetch(`http://localhost:3001/api/auth/updateEpisodes`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: currentUser._id,
					animeId: id,
					episodesWatched: value,
					timeUpdated: new Date(),
				}),
			});
			const data = await res.json();
			console.log(data);
			if (data.success === false) {
				dispatch(updateUserFailure(data));
				return;
			}
			dispatch(updateUserSuccess(data.updatedUser));
		} catch (error) {
			dispatch(updateUserFailure(error));
		}
	};

	return (
		// Anime Content
		<div className='bg-[#171717] min-h-[calc(100vh-64px)] p-2'>
			{loading && <p className='text-[#ededed]'>Loading...</p>}
			{fetchedSpecificAnime && (
				// Anime Content Container
				<div className='bg-[#202020] text-[#ededed] mx-6 mt-6 px-4 py-3 rounded-lg'>
					{/* Title Container */}
					<div className='mb-2'>
						<h1 className='text-white'>{fetchedSpecificAnime.title}</h1>
						<h1>{fetchedSpecificAnime.title_jp}</h1>
						{currentUser?.role === "admin" && (
							<button onClick={() => navigate(`/edit/anime/${id}`)}>
								Edit Anime
							</button>
						)}
						{/* Border */}
						<div className='bg-gradient-to-br from-purple-500 to-pink-500 h-0.5'></div>
					</div>
					<div className='flex gap-2'>
						{/* Left Side */}
						<div className='flex flex-col w-72 gap-1.5'>
							<img
								src={fetchedSpecificAnime.customImageURL}
								alt='anime_cover'
								className='mb-2'
							/>
							<p className='text-md'>Alternative Titles</p>
							{/* Border */}
							<div className='bg-gradient-to-br from-purple-500 to-pink-500 h-0.5'></div>
							<p className='text-xs font-bold whitespace-nowrap'>
								Japanese:{" "}
								<span className='font-normal'>
									{fetchedSpecificAnime.title_jp}
								</span>
							</p>
							<p className='text-md'>Information</p>
							{/* Border */}
							<div className='bg-gradient-to-br from-purple-500 to-pink-500 h-0.5'></div>
							<p className='text-xs font-bold whitespace-nowrap'>
								Type:{" "}
								<span className='font-normal'>{fetchedSpecificAnime.type}</span>
							</p>
							<p className='text-xs font-bold whitespace-nowrap'>
								Status:{" "}
								<span className='font-normal'>
									{fetchedSpecificAnime.status}
								</span>
							</p>
							<p className='text-xs font-bold whitespace-nowrap'>
								Aired: <br />
								<span className='font-normal'>
									From: {formatDate(fetchedSpecificAnime.airedFrom)}
								</span>
								<br />
								<span className='font-normal'>
									To: {formatDate(fetchedSpecificAnime.airedUntil)}
								</span>
							</p>
							<p className='text-xs font-bold whitespace-nowrap'>
								Premiered:{" "}
								<span className='font-normal'>
									{fetchedSpecificAnime.season} {fetchedSpecificAnime.year}
								</span>
							</p>
							<p className='text-xs font-bold whitespace-nowrap'>
								Broadcast:{" "}
								<span className='font-normal'>
									{fetchedSpecificAnime.broadcast.day}{" "}
									{fetchedSpecificAnime.broadcast.time}{" "}
									{fetchedSpecificAnime.broadcast.timezone}
								</span>
							</p>
							<p className='text-xs font-bold whitespace-nowrap'>
								Duration:{" "}
								<span className='font-normal'>
									{fetchedSpecificAnime.duration}
								</span>
							</p>
							<p className='text-xs font-bold whitespace-nowrap'>
								Rating:{" "}
								<span className='font-normal'>
									{fetchedSpecificAnime.rating}
								</span>
							</p>
						</div>
						{/* Middle */}
						{/* Border */}
						<div className='bg-gradient-to-br from-purple-500 to-pink-500 w-0.5'></div>
						{/* Right Side */}
						<div className='flex flex-col pl-2 w-full'>
							{/* Tracking Container */}
							{currentUser ? (
								<div className='flex flex-col gap-4 bg-[#171717] pt-2 px-2 rounded-md w-fit'>
									<div className='flex justify-between'>
										<button
											onClick={() => boop("Watching")}
											className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'
										>
											<span
												className={`flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0 
									${
										currentUser.trackedAnime?.[id]?.status === "Watching"
											? "bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white"
											: ""
									}`}
											>
												Watching
											</span>
										</button>
										<button
											onClick={() => boop("Completed")}
											className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'
										>
											<span
												className={`flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0 
									${
										currentUser.trackedAnime?.[id]?.status === "Completed"
											? "bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white"
											: ""
									}`}
											>
												{" "}
												Completed
											</span>
										</button>
										<button
											onClick={() => boop("On Hold")}
											className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'
										>
											<span
												className={`flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0 
									${
										currentUser.trackedAnime?.[id]?.status === "On Hold"
											? "bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white"
											: ""
									}`}
											>
												{" "}
												On Hold
											</span>
										</button>
										<button
											onClick={() => boop("Plan to Watch")}
											className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'
										>
											<span
												className={`flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0 
									${
										currentUser.trackedAnime?.[id]?.status === "Plan to Watch"
											? "bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white"
											: ""
									}`}
											>
												{" "}
												Plan to Watch
											</span>
										</button>
										<button
											onClick={removeAnime}
											className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'
										>
											<span
												className={
													"flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0"
												}
											>
												{" "}
												Remove
											</span>
										</button>
									</div>
									<div>
										<button
											className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'
											onClick={() => updateAnimeRating(10)}
										>
											<span
												className={`flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0 
									${
										currentUser.trackedAnime?.[id]?.rating === 10
											? "bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white"
											: ""
									}`}
											>
												{" "}
												10
											</span>
										</button>
										<button
											className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'
											onClick={() => updateAnimeRating(9)}
										>
											<span
												className={`flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0 
									${
										currentUser.trackedAnime?.[id]?.rating === 9
											? "bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white"
											: ""
									}`}
											>
												{" "}
												9
											</span>
										</button>
										<button
											className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'
											onClick={() => updateAnimeRating(8)}
										>
											<span
												className={`flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0 
									${
										currentUser.trackedAnime?.[id]?.rating === 8
											? "bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white"
											: ""
									}`}
											>
												{" "}
												8
											</span>
										</button>
										<button
											className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'
											onClick={() => updateAnimeRating(7)}
										>
											<span
												className={`flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0 
									${
										currentUser.trackedAnime?.[id]?.rating === 7
											? "bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white"
											: ""
									}`}
											>
												{" "}
												7
											</span>
										</button>
										<button
											className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'
											onClick={() => updateAnimeRating(6)}
										>
											<span
												className={`flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0 
									${
										currentUser.trackedAnime?.[id]?.rating === 6
											? "bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white"
											: ""
									}`}
											>
												{" "}
												6
											</span>
										</button>
										<button
											className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'
											onClick={() => updateAnimeRating(5)}
										>
											<span
												className={`flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0 
									${
										currentUser.trackedAnime?.[id]?.rating === 5
											? "bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white"
											: ""
									}`}
											>
												{" "}
												5
											</span>
										</button>
										<button
											className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'
											onClick={() => updateAnimeRating(4)}
										>
											<span
												className={`flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0 
									${
										currentUser.trackedAnime?.[id]?.rating === 4
											? "bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white"
											: ""
									}`}
											>
												{" "}
												4
											</span>
										</button>
										<button
											className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'
											onClick={() => updateAnimeRating(3)}
										>
											<span
												className={`flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0 
									${
										currentUser.trackedAnime?.[id]?.rating === 3
											? "bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white"
											: ""
									}`}
											>
												{" "}
												3
											</span>
										</button>
										<button
											className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'
											onClick={() => updateAnimeRating(2)}
										>
											<span
												className={`flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0 
									${
										currentUser.trackedAnime?.[id]?.rating === 2
											? "bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white"
											: ""
									}`}
											>
												{" "}
												2
											</span>
										</button>
										<button
											className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'
											onClick={() => updateAnimeRating(1)}
										>
											<span
												className={`flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0 
									${
										currentUser.trackedAnime?.[id]?.rating === 1
											? "bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white"
											: ""
									}`}
											>
												{" "}
												1
											</span>
										</button>
									</div>
									<div className='flex justify-center items-center gap-2 mb-2'>
										<h1>Episodes</h1>
										<input
											type='number'
											min='0'
											max={fetchedSpecificAnime.episodes}
											placeholder={
												currentUser.trackedAnime?.[id]?.episodesWatched
											}
											onChange={(e) => updateEpisodesWatched(e)}
											className='bg-[#171717] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-purple-500 text-[#ededed] px-3 w-16'
										/>
										<h1>/ {fetchedSpecificAnime.episodes}</h1>
										<button onClick={updateEpisodesWatchedByOne}>
											<h1>+</h1>
										</button>
									</div>
								</div>
							) : (
								<div className='flex flex-col gap-4 bg-[#171717] pt-2 px-4 rounded-md w-fit h-14 justify-center'>
									<p>
										Want to track anime and create your own list?{" "}
										<button
											className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'
											onClick={() => navigate("/register")}
										>
											<span className='flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0 text-white'>
												Sign up
											</span>
										</button>
										or{" "}
										<button
											className='relative inline-flex items-center justify-center p-0.5  mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'
											onClick={() => navigate("/login")}
										>
											<span className='flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0 text-white'>
												Login
											</span>
										</button>{" "}
										now!
									</p>
								</div>
							)}
							{/* Description Container */}
							<div>
								<h1 className='text-xl'>Description</h1>
								{/* Border */}
								<div className='bg-gradient-to-br from-purple-500 to-pink-500 h-0.5'></div>
								<p>{fetchedSpecificAnime.description}</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Anime;
