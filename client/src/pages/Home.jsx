import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
	getAnimeStart,
	getAnimeSuccess,
	getAnimeFailure,
} from "../redux/anime/animeSlice";

const Home = () => {
	const { fetchedAnime, loading } = useSelector((state) => state.anime);

	const dispatch = useDispatch();

	useEffect(() => {
		const fetchAnime = async () => {
			try {
				dispatch(getAnimeStart());
				const res = await fetch(`http://localhost:3001/api/anime/anime`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				const data = await res.json();
				if (data.success === false) {
					dispatch(getAnimeFailure(data));
					return;
				}

				dispatch(getAnimeSuccess(data));
			} catch (error) {
				dispatch(getAnimeFailure(error));
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
		<div className='bg-[#171717] text-[#ededed] border-t-2 min-h-[calc(100vh-64px)]'>
			{loading && <p className='text-[#ededed]'>Loading...</p>}
			{/* Seasonal Anime */}
			{fetchedAnime && (
				<div className='m-4 bg-[#202020] rounded-lg p-8'>
					<h2 className='ml-4 text-2xl border-b-2 pb-2'>
						{getSeason()} Anime {new Date().getFullYear()}
					</h2>
					<div className='flex gap-4 m-4'>
						{fetchedAnime
							.filter(
								(anime) =>
									anime.season === getSeason().toLowerCase() &&
									anime.year === new Date().getFullYear()
							)
							.map((springAnime) => (
								<div
									className='relative flex flex-col items-center'
									key={springAnime._id}
								>
									<p className='absolute bottom-0 left-0 bg-black opacity-50 text-white px-2 py-1 z-10 w-full truncate'>
										{springAnime.title}
									</p>
									<img
										className='h-80 w-56 rounded-md'
										src={springAnime.customImageURL}
										alt='anime_cover'
									/>
								</div>
							))}
					</div>
				</div>
			)}
		</div>
	);
};

export default Home;
