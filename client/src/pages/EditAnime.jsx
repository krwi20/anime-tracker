import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import {
	updateSpecificAnimeStart,
	updateSpecificAnimeSuccess,
	updateSpecificAnimeFailure,
} from "../redux/anime/animeSlice";

const EditAnime = () => {
	const { id } = useParams();
	const { fetchedSpecificAnime, loading } = useSelector((state) => state.anime);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [updatedAnimeData, setUpdatedAnimeData] = useState({
		title: fetchedSpecificAnime.title,
		title_jp: fetchedSpecificAnime.title_jp,
		description: fetchedSpecificAnime.description,
		image: fetchedSpecificAnime.customImageURL,
	});

	const test = async () => {
		try {
			dispatch(updateSpecificAnimeStart());
			const res = await fetch(
				`http://localhost:3001/api/anime/anime/edit/${id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(updatedAnimeData),
				}
			);
			const data = await res.json();
			if (data.success === false) {
				dispatch(updateSpecificAnimeFailure(data));
				return;
			}
			dispatch(updateSpecificAnimeSuccess(data));
			navigate(`/anime/${id}`);
		} catch (error) {
			dispatch(updateSpecificAnimeFailure(error));
		}
	};

	return (
		<div className='bg-[#171717] min-h-[calc(100vh-64px)] p-2 text-white'>
			{loading && <p className='text-[#ededed]'>Loading...</p>}
			<form className='flex flex-col gap-2'>
				{/* Title Section */}
				<label>
					Title:
					<input
						className='text-black'
						type='text'
						placeholder={fetchedSpecificAnime.title}
						onChange={(e) =>
							setUpdatedAnimeData({
								...updatedAnimeData,
								title: e.target.value,
							})
						}
					/>
				</label>
				{/* Japanese Title Section */}
				<label>
					Japanese Title:
					<input
						className='text-black'
						type='text'
						placeholder={fetchedSpecificAnime.title_jp}
						onChange={(e) =>
							setUpdatedAnimeData({
								...updatedAnimeData,
								title_jp: e.target.value,
							})
						}
					/>
				</label>
				{/* Description Section */}
				<label>
					Description:
					<textarea
						className='text-black'
						type='text'
						placeholder={fetchedSpecificAnime.description}
						onChange={(e) =>
							setUpdatedAnimeData({
								...updatedAnimeData,
								description: e.target.value,
							})
						}
					/>
				</label>
				{/* Image Section */}
				<label>
					Image:
					<input
						className='text-black'
						type='text'
						placeholder={fetchedSpecificAnime.customImageURL}
						onChange={(e) =>
							setUpdatedAnimeData({
								...updatedAnimeData,
								image: e.target.value,
							})
						}
					/>
				</label>
			</form>
			{/* Apply Changes */}
			<button
				className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'
				type='button'
				onClick={() => test()}
			>
				<span className='flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0 text-white'>
					Apply
				</span>
			</button>
			{/* Cancel Changes */}
			<button
				className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'
				type='button'
				onClick={() => navigate(`/anime/${id}`)}
			>
				<span className='flex items-center gap-2 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0 text-white'>
					Cancel
				</span>
			</button>
		</div>
	);
};

export default EditAnime;
