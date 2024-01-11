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

	const getSeason = () => {
		const currentDate = new Date();
		const currentMonth = currentDate.getMonth() + 1;

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
		<div className='bg-gradient-to-br from-purple-800 to-pink-500 text-white min-h-[calc(100vh-64px)] p-4'>
			{loading && (
				<div className='flex items-center justify-center h-full'>
					<div className='animate-spin rounded-full border-t-2 border-b-2 border-[#8A4FFF] h-12 w-12'></div>
				</div>
			)}
			{fetchedAllAnime && (
				<div className='bg-gray-900 text-white mx-4 mt-6 rounded-lg p-6'>
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
						<div className='col-span-2'>
							<h2 className='text-3xl font-bold mb-6'>
								{getSeason()} Anime {new Date().getFullYear()}
							</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
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
