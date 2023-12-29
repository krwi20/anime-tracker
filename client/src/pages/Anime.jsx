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
	}, [dispatch]);

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
					episodesWatched: 4,
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
					{/* Details Container */}
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
								Aired:{" "}
								<span className='font-normal'>
									{formatDate(fetchedSpecificAnime.airedFrom)}
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
							{currentUser && currentUser.trackedAnime && (
								<div className='flex flex-col gap-4 bg-[#171717] pt-2 px-2 rounded-md w-fit'>
									<div className='flex'>
										<button
											onClick={() => boop("Watching")}
											className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'
										>
											<span
												className={`flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0 
									${
										currentUser.trackedAnime[id]?.status === "Watching"
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
										currentUser.trackedAnime[id]?.status === "Completed"
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
										currentUser.trackedAnime[id]?.status === "On Hold"
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
										currentUser.trackedAnime[id]?.status === "Plan to Watch"
											? "bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white"
											: ""
									}`}
											>
												{" "}
												Plan to Watch
											</span>
										</button>
									</div>
									<div>
										<button className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'>
											<span className='flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0'>
												10
											</span>
										</button>
										<button className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'>
											<span className='flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0'>
												9
											</span>
										</button>
										<button className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'>
											<span className='flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0'>
												8
											</span>
										</button>
										<button className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'>
											<span className='flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0'>
												7
											</span>
										</button>
										<button className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'>
											<span className='flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0'>
												6
											</span>
										</button>
										<button className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'>
											<span className='flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0'>
												5
											</span>
										</button>
										<button className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'>
											<span className='flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0'>
												4
											</span>
										</button>
										<button className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'>
											<span className='flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0'>
												3
											</span>
										</button>
										<button className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'>
											<span className='flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0'>
												2
											</span>
										</button>
										<button className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'>
											<span className='flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0'>
												1
											</span>
										</button>
									</div>
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
