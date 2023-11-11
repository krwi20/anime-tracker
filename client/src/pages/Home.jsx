import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
	getAllAnimeStart,
	getAllAnimeSuccess,
	getAllAnimeFailure,
} from "../redux/anime/animeSlice";

const Home = () => {
	const { fetchedAllAnime, loading } = useSelector((state) => state.anime);

	const dispatch = useDispatch();

	useEffect(() => {
		const fetchAnime = async () => {
			try {
				dispatch(getAllAnimeStart());
				const res = await fetch(`http://localhost:3001/api/anime/anime`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				const data = await res.json();
				if (data.success === false) {
					dispatch(getAllAnimeFailure(data));
					return;
				}

				dispatch(getAllAnimeSuccess(data));
			} catch (error) {
				dispatch(getAllAnimeFailure(error));
			}
		};

		fetchAnime();
	}, [dispatch]);

	// Move to helper file likely
	const getSeason = () => {
		const currentDate = new Date();
		const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed

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
		// Home Content
		<div className='bg-[#171717] text-[#ededed] min-h-[calc(100vh-64px)] p-2'>
			{loading && <p className='text-[#ededed]'>Loading...</p>}

			{fetchedAllAnime && (
				// Seasonal Anime Container
				<div className=' bg-[#202020] rounded-lg p-1 m-4'>
					<h2 className='ml-4 text-3xl p-2'>
						{getSeason()} Anime {new Date().getFullYear()}
					</h2>
					{/* Border */}
					<div className='bg-gradient-to-br from-purple-500 to-pink-500 h-0.5 mx-4'></div>
					{/* Anime Cards */}

					<div className='flex gap-4 m-4'>
						{fetchedAllAnime
							.filter(
								(anime) =>
									anime.season === getSeason() &&
									anime.year === new Date().getFullYear()
							)
							.map((anime) => (
								<Link to={`/anime/${anime._id}`} key={anime._id}>
									<div
										className='relative flex flex-col items-center'
										key={anime._id}
									>
										<p className='absolute bottom-0 left-0 bg-black opacity-50 text-white px-2 py-1 z-10 w-full truncate'>
											{anime.title}
										</p>
										<img
											className='h-80 w-56 rounded-md'
											src={anime.customImageURL}
											alt='anime_cover'
										/>
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
