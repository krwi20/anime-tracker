import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
	getSpecificAnimeStart,
	getSpecificAnimeSuccess,
	getSpecificAnimeFailure,
} from "../redux/anime/animeSlice";

const Anime = () => {
	const { id } = useParams();
	const { fetchedSpecificAnime, loading } = useSelector((state) => state.anime);
	const dispatch = useDispatch();

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

	return (
		<div className='bg-[#171717] border-t-white border-t-2 min-h-[calc(100vh-64px)] '>
			{loading && <p className='text-[#ededed]'>Loading...</p>}
			{fetchedSpecificAnime && <h1>{fetchedSpecificAnime.title}</h1>}
		</div>
	);
};

export default Anime;
