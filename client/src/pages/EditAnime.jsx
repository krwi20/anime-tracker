import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { persistor } from "../redux/store";
import {
	updateSpecificAnimeStart,
	updateSpecificAnimeSuccess,
	updateSpecificAnimeFailure,
} from "../redux/anime/animeSlice";
import { signOut } from "../redux/user/userSlice";

const EditAnime = () => {
	// Extract the id from the url params
	const { id } = useParams();
	// Redux state - gets anime information
	const { fetchedSpecificAnime, loading } = useSelector((state) => state.anime);
	// Redux dispatch hook
	const dispatch = useDispatch();
	// React router hook for navigation
	const navigate = useNavigate();
	// State to manage the anime edit updates
	const [updatedAnimeData, setUpdatedAnimeData] = useState({
		title: fetchedSpecificAnime.title || "",
		title_jp: fetchedSpecificAnime.title_jp || "",
		description: fetchedSpecificAnime.description || "",
		image: fetchedSpecificAnime.customImageURL || "",
		type: fetchedSpecificAnime.type || "",
		source: fetchedSpecificAnime.source || "",
		episodes: fetchedSpecificAnime.episodes || 0,
		status: fetchedSpecificAnime.status || "",
		airing: fetchedSpecificAnime.airing || false,
		airedFrom: fetchedSpecificAnime.airedFrom || "",
		airedUntil: fetchedSpecificAnime.airedUntil || "",
		duration: fetchedSpecificAnime.duration || "",
		rating: fetchedSpecificAnime.rating || "",
		background: fetchedSpecificAnime.background || "",
		season: fetchedSpecificAnime.season || "",
		year: fetchedSpecificAnime.year || "",
		producers: fetchedSpecificAnime.producers || [],
		broadcast: fetchedSpecificAnime.broadcast || {
			day: "",
			time: "",
			timezone: "",
		},
		licensors: fetchedSpecificAnime.licensors || [],
		studios: fetchedSpecificAnime.studios || [],
		genres: fetchedSpecificAnime.genres || [],
	});

	// Function to format the timestamp into more readable data
	function formatDate(dateString) {
		return dateString ? new Date(dateString).toISOString().split("T")[0] : "";
	}

	// Function to edit the specific anime
	const editSpecificAnime = async () => {
		try {
			// Redux store - dispatch action to start updating specific anime data
			dispatch(updateSpecificAnimeStart());
			// Backend fetch to update the anime with new details
			const response = await fetch(
				`http://localhost:3001/api/anime/anime/edit/${id}`,
				{
					method: "PATCH",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(updatedAnimeData),
				}
			);
			// Parse the data from the response
			const data = await response.json();
			// If the request is unsuccessful dispatch the failure with the data
			if (data.success === false) {
				dispatch(updateSpecificAnimeFailure(data));
				// If the request is unsuccessful, sign the user out, clear the user redux state, redirect to login page
				dispatch(signOut());
				persistor.purge(["user"]);
				navigate("/login");
			}
			// // If the request is successful dispatch the success witht the data
			dispatch(updateSpecificAnimeSuccess(data));
			// Redirect to the specific anime page
			navigate(`/anime/${id}`);
		} catch (error) {
			// If the request has an error dispatch the failure with the data
			dispatch(updateSpecificAnimeFailure(error));
		}
	};

	// Function to delete the anime from database
	const handleDelete = async () => {
		try {
			// Backend fetch to delete the anime from database
			const response = await fetch(
				`http://localhost:3001/api/anime/anime/delete/${id}`,
				{
					method: "DELETE",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			// Parse the data from the response
			const data = response.json();
			// If the request is unsuccessful, sign the user out, clear the user redux state, redirect to login page
			if (data.success === false) {
				dispatch(signOut());
				persistor.purge(["user"]);
				navigate("/login");
			}
			navigate("/");
		} catch (error) {
			// Console log the error
			console.log(error);
		}
	};

	return (
		<div className='bg-gradient-to-br from-gray-800 to-gray-700 text-white min-h-[calc(100vh-64px)] p-4'>
			<div className='bg-gray-900 mx-auto rounded-lg p-6'>
				{/* Form for editing anime details */}
				<form className='grid grid-cols-2 gap-6'>
					{/* Left column with input fields for anime details */}
					<div className='col-span-1 space-y-4'>
						<label className='flex flex-col'>
							Title:
							<input
								type='text'
								id='title'
								className='rounded-md bg-gray-800 p-2'
								value={updatedAnimeData.title}
								onChange={(e) =>
									setUpdatedAnimeData({
										...updatedAnimeData,
										title: e.target.value,
									})
								}
							/>
						</label>
						<label className='flex flex-col'>
							Japanese Title:
							<input
								type='text'
								id='title_jp'
								className='rounded-md bg-gray-800 p-2'
								value={updatedAnimeData.title_jp}
								onChange={(e) =>
									setUpdatedAnimeData({
										...updatedAnimeData,
										title_jp: e.target.value,
									})
								}
							/>
						</label>
						<label className='flex flex-col'>
							Description:
							<textarea
								id='description'
								className='rounded-md bg-gray-800 p-2'
								value={updatedAnimeData.description}
								onChange={(e) =>
									setUpdatedAnimeData({
										...updatedAnimeData,
										description: e.target.value,
									})
								}
							/>
						</label>
						<label className='flex flex-col'>
							Image:
							<input
								type='text'
								id='customImageURL'
								className='rounded-md bg-gray-800 p-2'
								value={updatedAnimeData.image}
								onChange={(e) =>
									setUpdatedAnimeData({
										...updatedAnimeData,
										image: e.target.value,
									})
								}
							/>
						</label>
						<label className='flex flex-col'>
							Type:
							<input
								type='text'
								id='type'
								value={updatedAnimeData.type}
								className='rounded-md bg-gray-800 p-2'
								onChange={(e) =>
									setUpdatedAnimeData({
										...updatedAnimeData,
										type: e.target.value,
									})
								}
							/>
						</label>
						<label className='flex flex-col'>
							Source:
							<input
								type='text'
								id='source'
								value={updatedAnimeData.source}
								className='rounded-md bg-gray-800 p-2'
								onChange={(e) =>
									setUpdatedAnimeData({
										...updatedAnimeData,
										source: e.target.value,
									})
								}
							/>
						</label>
						<label className='flex flex-col'>
							Episodes:
							<input
								type='number'
								id='episodes'
								value={updatedAnimeData.episodes}
								className='rounded-md bg-gray-800 p-2'
								onChange={(e) =>
									setUpdatedAnimeData({
										...updatedAnimeData,
										episodes: e.target.value,
									})
								}
							/>
						</label>
						<label className='flex flex-col'>
							Status:
							<input
								type='text'
								id='status'
								value={updatedAnimeData.status}
								className='rounded-md bg-gray-800 p-2'
								onChange={(e) =>
									setUpdatedAnimeData({
										...updatedAnimeData,
										status: e.target.value,
									})
								}
							/>
						</label>
						<label className='flex flex-col'>
							Airing:
							<input
								type='checkbox'
								id='airing'
								checked={updatedAnimeData.airing}
								className='rounded-md bg-gray-800 p-2'
								onChange={(e) =>
									setUpdatedAnimeData({
										...updatedAnimeData,
										airing: e.target.checked,
									})
								}
							/>
						</label>
						<label className='flex flex-col'>
							Aired From (Start Date):
							<input
								type='date'
								id='airedFrom'
								value={formatDate(updatedAnimeData.airedFrom)}
								className='rounded-md bg-gray-800 p-2'
								onChange={(e) =>
									setUpdatedAnimeData({
										...updatedAnimeData,
										airedFrom: e.target.value,
									})
								}
							/>
						</label>
						<label className='flex flex-col'>
							Aired TO (End Date):
							<input
								type='date'
								id='airedUntil'
								value={formatDate(updatedAnimeData.airedUntil)}
								className='rounded-md bg-gray-800 p-2'
								onChange={(e) =>
									setUpdatedAnimeData({
										...updatedAnimeData,
										airedUntil: e.target.value,
									})
								}
							/>
						</label>
					</div>
					{/* Right column with input fields for anime details */}
					<div className='col-span-1 space-y-4'>
						<label className='flex flex-col'>
							Duration:
							<input
								type='text'
								id='duration'
								value={updatedAnimeData.duration}
								className='rounded-md bg-gray-800 p-2'
								onChange={(e) =>
									setUpdatedAnimeData({
										...updatedAnimeData,
										duration: e.target.value,
									})
								}
							/>
						</label>
						<label className='flex flex-col'>
							Rating:
							<input
								type='text'
								id='rating'
								value={updatedAnimeData.rating}
								className='rounded-md bg-gray-800 p-2'
								onChange={(e) =>
									setUpdatedAnimeData({
										...updatedAnimeData,
										rating: e.target.value,
									})
								}
							/>
						</label>
						<label className='flex flex-col'>
							Background:
							<input
								type='text'
								id='background'
								value={updatedAnimeData.background}
								className='rounded-md bg-gray-800 p-2'
								onChange={(e) =>
									setUpdatedAnimeData({
										...updatedAnimeData,
										background: e.target.value,
									})
								}
							/>
						</label>
						<label className='flex flex-col'>
							Season:
							<input
								type='text'
								id='season'
								value={updatedAnimeData.season}
								className='rounded-md bg-gray-800 p-2'
								onChange={(e) =>
									setUpdatedAnimeData({
										...updatedAnimeData,
										season: e.target.value,
									})
								}
							/>
						</label>
						<label className='flex flex-col'>
							Year:
							<input
								type='text'
								id='year'
								value={updatedAnimeData.year}
								className='rounded-md bg-gray-800 p-2'
								onChange={(e) =>
									setUpdatedAnimeData({
										...updatedAnimeData,
										year: e.target.value,
									})
								}
							/>
						</label>
						<label className='flex flex-col'>
							Producers (Comma Separated):
							<input
								className='rounded-md bg-gray-800 p-2'
								type='text'
								id='producers'
								value={updatedAnimeData.producers.join(", ")}
								onChange={(e) =>
									setUpdatedAnimeData((prevData) => ({
										...prevData,
										producers: e.target.value
											.split(",")
											.map((producer) => producer.trim()),
									}))
								}
							/>
						</label>
						<label className='flex flex-col'>
							Broadcast:
							<input
								className='rounded-md bg-gray-800 p-2'
								type='text'
								id='broadcast'
								value={`${updatedAnimeData.broadcast.day}, ${updatedAnimeData.broadcast.time}, ${updatedAnimeData.broadcast.timezone}`}
								onChange={(e) => {
									const [day, time, timezone] = e.target.value
										.split(",")
										.map((part) => part.trim());
									setUpdatedAnimeData((prevData) => ({
										...prevData,
										broadcast: {
											day: day || "",
											time: time || "",
											timezone: timezone || "",
										},
									}));
								}}
							/>
						</label>
						<label className='flex flex-col'>
							Licensors (Comma Separated):
							<input
								className='rounded-md bg-gray-800 p-2'
								type='text'
								id='licensors'
								value={updatedAnimeData.licensors.join(", ")}
								onChange={(e) =>
									setUpdatedAnimeData((prevData) => ({
										...prevData,
										licensors: e.target.value
											.split(",")
											.map((licensor) => licensor.trim()),
									}))
								}
							/>
						</label>
						<label className='flex flex-col'>
							Studios (Comma Separated):
							<input
								className='rounded-md bg-gray-800 p-2'
								type='text'
								id='studios'
								value={updatedAnimeData.studios.join(", ")}
								onChange={(e) =>
									setUpdatedAnimeData((prevData) => ({
										...prevData,
										studios: e.target.value
											.split(",")
											.map((studio) => studio.trim()),
									}))
								}
							/>
						</label>
						<label className='flex flex-col'>
							Genres (Comma Separated):
							<input
								className='rounded-md bg-gray-800 p-2'
								type='text'
								id='genres'
								value={updatedAnimeData.genres.join(", ")}
								onChange={(e) =>
									setUpdatedAnimeData((prevData) => ({
										...prevData,
										genres: e.target.value
											.split(",")
											.map((genre) => genre.trim()),
									}))
								}
							/>
						</label>
					</div>
					{/* Button to apply edits */}
					<button
						type='button'
						className='bg-gray-800 rounded-md px-4 py-2 hover:bg-purple-600 col-span-2'
						onClick={() => editSpecificAnime()}
					>
						Apply
					</button>
				</form>
				{/* Section for removing anime */}
				<div className='flex mt-2 space-x-4'>
					<button
						className='px-5 flex-grow py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-red-500 col-span-2'
						onClick={handleDelete}
					>
						Remove Anime
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditAnime;
