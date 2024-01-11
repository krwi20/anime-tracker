import React, { useEffect, useState } from "react";
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
	const [episodesWatched, setEpisodesWatched] = useState(
		currentUser.trackedAnime?.[id]?.episodesWatched || 0
	);

	const formatDate = (timestamp) => {
		const date = new Date(timestamp);
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

	const updateEpisodesWatched = async () => {
		let value = episodesWatched;
		if (value > fetchedSpecificAnime.episodes) {
			value = fetchedSpecificAnime.episodes;
		} else if (value < 0) {
			value = 0;
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
		<div className='bg-gradient-to-br from-purple-800 to-pink-500 text-white min-h-[calc(100vh-64px)] p-2'>
			{loading && (
				<div className='flex items-center justify-center h-full'>
					<div className='animate-spin rounded-full border-t-2 border-b-2 border-[#8A4FFF] h-12 w-12'></div>
				</div>
			)}
			{fetchedSpecificAnime && (
				<div className='bg-gray-900 rounded-lg p-4 m-4'>
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
						<div className='lg:col-span-2'>
							<div className='flex flex-col'>
								<h1 className='text-4xl font-bold mb-2'>
									{fetchedSpecificAnime.title}
								</h1>
								<p className='text-lg mb-4'>{fetchedSpecificAnime.title_jp}</p>
								<div className='mb-4'>
									<img
										src={fetchedSpecificAnime.customImageURL}
										alt={fetchedSpecificAnime.title}
										className='w-full h-full object-cover rounded-md'
										style={{ width: "225px", height: "318px" }}
									/>
								</div>
								<span className='text-lg font-bold'>Description:</span>
								<p>{fetchedSpecificAnime.description}</p>
							</div>
						</div>
						<div className='lg:col-span-1 space-y-4'>
							<div className='flex flex-col'>
								<span className='text-lg font-bold'>Details:</span>
								<div className='flex flex-col mt-2 space-y-2'>
									<span>
										<span className='font-bold'>Type:</span>{" "}
										{fetchedSpecificAnime.type}
									</span>
									<span>
										<span className='font-bold'>Episodes:</span>{" "}
										{fetchedSpecificAnime.episodes}
									</span>
									<span>
										<span className='font-bold'>Status:</span>{" "}
										{fetchedSpecificAnime.status}
									</span>
									<span>
										<span className='font-bold'>Aired:</span>{" "}
										{`${formatDate(
											fetchedSpecificAnime.airedFrom
										)} to ${formatDate(fetchedSpecificAnime.airedTo)}`}
									</span>
									<span>
										<span className='font-bold'>Premiered:</span>{" "}
										{fetchedSpecificAnime.premiered}
									</span>
									<span>
										<span className='font-bold'>Producers:</span>{" "}
										{fetchedSpecificAnime.producers.join(", ")}
									</span>
									<span>
										<span className='font-bold'>Licensors:</span>{" "}
										{fetchedSpecificAnime.licensors.join(", ")}
									</span>
									<span>
										<span className='font-bold'>Studios:</span>{" "}
										{fetchedSpecificAnime.studios.join(", ")}
									</span>
									<span>
										<span className='font-bold'>Source:</span>{" "}
										{fetchedSpecificAnime.source}
									</span>
									<span>
										<span className='font-bold'>Genres:</span>{" "}
										{fetchedSpecificAnime.genres.join(", ")}
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
						<div className='lg:col-span-3 space-y-4'>
							<div className='border-b-2 border-gray-700'></div>
							<div className='flex flex-col'>
								<span className='text-lg font-bold'>Your Status:</span>
								<div className='flex mt-2 space-x-4'>
									<button onClick={() => boop("Watching")}>
										<span
											className={`px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-purple-600 
							${
								currentUser.trackedAnime?.[id]?.status === "Watching"
									? "bg-purple-600"
									: ""
							}`}
										>
											Watching
										</span>
									</button>
									<button onClick={() => boop("Completed")}>
										<span
											className={`px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-purple-600 
							${
								currentUser.trackedAnime?.[id]?.status === "Completed"
									? "bg-purple-600"
									: ""
							}`}
										>
											Completed
										</span>
									</button>
									<button onClick={() => boop("Plan to watch")}>
										<span
											className={`px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-purple-600 
							${
								currentUser.trackedAnime?.[id]?.status === "Plan to watch"
									? "bg-purple-600"
									: ""
							}`}
										>
											Plan to watch
										</span>
									</button>
								</div>
							</div>
							<div className='flex flex-col'>
								<span className='text-lg font-bold'>Your Rating:</span>
								<div className='flex mt-2 space-x-4'>
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
								</div>
							</div>
							<div className='flex flex-col'>
								<span className='text-lg font-bold'>Episodes Watched:</span>
								<div className='flex mt-2 space-x-4'>
									<button
										onClick={() => updateEpisodesWatchedByOne()}
										className='px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-purple-600'
									>
										+1
									</button>
									<input
										type='number'
										min='0'
										max={fetchedSpecificAnime.episodes}
										placeholder={
											currentUser.trackedAnime?.[id]?.episodesWatched
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
							<div className='flex flex-col'>
								<span className='text-lg font-bold'>Actions:</span>
								<div className='flex mt-2 space-x-4'>
									<button
										onClick={() => removeAnime()}
										className='px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-red-500'
									>
										Remove from List
									</button>
									{currentUser?.role === "admin" && (
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
	);
};

export default Anime;
