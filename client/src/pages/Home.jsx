import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
	getAllAnimeStart,
	getAllAnimeSuccess,
	getAllAnimeFailure,
} from "../redux/anime/animeSlice";

import {
	getAllMangaStart,
	getAllMangaSuccess,
	getAllMangaFailure,
} from "../redux/manga/mangaSlice";

const Home = () => {
	// Redux state - gets anime information
	const { fetchedAllAnime, loading } = useSelector((state) => state.anime);
	// Redux state - gets manga information
	const { fetchedAllManga } = useSelector((state) => state.manga);
	// Redux dispatch hook
	const dispatch = useDispatch();

	// TODO : IMRPOVE & CLEAN UP CODE

	// Fetch all anime data
	useEffect(() => {
		const fetchAnime = async () => {
			try {
				// Redux store - dispatch action to start getting all anime
				dispatch(getAllAnimeStart());
				// Backend fetch to get all the anime from database
				const response = await fetch(`http://localhost:3001/api/anime/anime`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				// Parse the data from the response
				const data = await response.json();
				// If the request is unsuccessful dispatch the failure with the data
				if (data.success === false) {
					dispatch(getAllAnimeFailure(data));
					return;
				}
				// If the request is successful dispatch the success with the data
				dispatch(getAllAnimeSuccess(data));
			} catch (error) {
				// If the request has en error dispatch the failure with the error
				dispatch(getAllAnimeFailure(error));
			}
		};
		// Call function to fetch anime
		fetchAnime();
	}, [dispatch]);

	// Fetch all manga data
	useEffect(() => {
		const fetchManga = async () => {
			try {
				// Redux store - dispatch action to start getting all manga
				dispatch(getAllMangaStart());
				// Backend fetch to get all the manga from database
				const response = await fetch(`http://localhost:3001/api/manga/manga`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				// Parse the data from the response
				const data = await response.json();
				// If the request is unsuccessful dispatch the failure with the data
				if (data.success === false) {
					dispatch(getAllMangaFailure(data));
					return;
				}
				// If the request is successful dispatch the success with the data
				dispatch(getAllMangaSuccess(data));
			} catch (error) {
				// If the request has en error dispatch the failure with the error
				dispatch(getAllMangaFailure(error));
			}
		};
		// Call function to fetch manga
		fetchManga();
	}, [dispatch]);

	// Function to get the current season
	const getSeason = () => {
		// Get the current month
		const currentDate = new Date();
		const currentMonth = currentDate.getMonth() + 1;

		// Determining which months are which season
		if (currentMonth >= 3 && currentMonth <= 5) {
			return "Spring";
		} else if (currentMonth >= 6 && currentMonth <= 8) {
			return "Summer";
		} else if (currentMonth >= 9 && currentMonth <= 11) {
			return "Fall";
		} else {
			return "Winter";
		}
	};

	return (
		<div className='bg-gradient-to-br from-gray-800 to-gray-700 text-white min-h-[calc(100vh-64px)] p-4'>
			{/* Loading spinner while being fetched */}
			{loading && (
				<div className='flex items-center justify-center h-full'>
					<div className='animate-spin rounded-full border-t-2 border-b-2 border-[#8A4FFF] h-12 w-12'></div>
				</div>
			)}
			{fetchedAllAnime && (
				// Display all the fetched anime if there is any
				<div className='bg-gray-900 text-white mx-4 mt-6 rounded-lg p-6'>
					<h2 className='text-3xl font-bold mb-6'>
						{getSeason()} Anime {new Date().getFullYear()}
					</h2>
					{/* Display the animes which are in the current season and year */}
					<div className='flex flex-wrap gap-8'>
						{fetchedAllAnime
							.filter(
								(anime) =>
									anime.season === getSeason() &&
									anime.year === new Date().getFullYear()
							)
							.map((anime) => (
								<Link to={`/anime/${anime._id}`} key={anime._id}>
									<div className='bg-gray-800 p-4 rounded-lg flex items-start space-x-4 w-[500px] hover:bg-gray-700'>
										{/* Anime Image */}
										<img
											src={anime.customImageURL}
											alt={anime.title}
											className='w-36 h-52 object-cover rounded-lg'
										/>
										{/* Anime Information */}
										<div className='flex flex-col flex-grow'>
											<h3 className='text-xl font-bold break-words'>
												{anime.title}
											</h3>
											<div className='border-b-2 border-gray-700 mb-2'></div>
											<p className='text-gray-400 break-words'>
												{/* Limiting the description length and adding ellipsis */}
												{anime.description.length > 150
													? `${anime.description.slice(0, 150)}...`
													: anime.description}
											</p>
										</div>
									</div>
								</Link>
							))}
					</div>
				</div>
			)}

			{fetchedAllManga && (
				// Display all the fetched manga if there is any
				<div className='bg-gray-900 text-white mx-4 mt-6 rounded-lg p-6'>
					<h2 className='text-3xl font-bold mb-6'>Manga</h2>
					<div className='flex flex-wrap gap-8'>
						{fetchedAllManga.map((manga) => (
							<Link to={`/manga/${manga._id}`} key={manga._id}>
								<div className='bg-gray-800 p-4 rounded-lg flex items-start space-x-4 w-[500px] hover:bg-gray-700'>
									<img
										src={manga.customImageURL}
										alt={manga.title}
										className='w-36 h-52 object-cover rounded-lg'
									/>
									<div className='flex flex-col flex-grow'>
										<h3 className='text-xl font-bold break-words'>
											{manga.title}
										</h3>
										<div className='border-b-2 border-gray-700 mb-2'></div>
										<p className='text-gray-400 break-words'>
											{/* Limiting the description length and adding ellipsis */}
											{manga.description.length > 150
												? `${manga.description.slice(0, 150)}...`
												: manga.description}
										</p>
									</div>
								</div>
							</Link>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default Home;
