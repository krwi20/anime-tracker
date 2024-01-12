import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
	getAllAnimeStart,
	getAllAnimeSuccess,
	getAllAnimeFailure,
} from "../redux/anime/animeSlice";

const Home = () => {
	// Redux state - gets anime information
	const { fetchedAllAnime, loading } = useSelector((state) => state.anime);
	// Redux dispatch hook
	const dispatch = useDispatch();

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
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
						<div className='col-span-2'>
							<h2 className='text-3xl font-bold mb-6'>
								{getSeason()} Anime {new Date().getFullYear()}
							</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
								{/* Display the animes which are in the current season and year */}
								{fetchedAllAnime
									.filter(
										(anime) =>
											anime.season === getSeason() &&
											anime.year === new Date().getFullYear()
									)
									.map((anime) => (
										<Link to={`/anime/${anime._id}`} key={anime._id}>
											<div className='bg-gray-800 rounded-lg overflow-hidden'>
												<div className='h-40 relative'>
													<img
														src={anime.customImageURL}
														alt={anime.title}
														className='absolute top-0 left-0 w-full h-full object-cover'
													/>
												</div>
												<div className='p-4'>
													<p className='text-lg font-bold mb-2 cursor-pointer'>
														{anime.title}
													</p>
													<p className='text-xs text-gray-400 line-clamp-3'></p>
												</div>
											</div>
										</Link>
									))}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Home;
