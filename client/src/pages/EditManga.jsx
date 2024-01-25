import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { persistor } from "../redux/store";
import {
	updateSpecificMangaStart,
	updateSpecificMangaSuccess,
	updateSpecificMangaFailure,
} from "../redux/manga/mangaSlice";
import { signOut } from "../redux/user/userSlice";

const EditManga = () => {
	// Extract the id from the url params
	const { id } = useParams();
	// Redux state - gets manga information
	const { fetchedSpecificManga } = useSelector((state) => state.manga);
	// Redux dispatch hook
	const dispatch = useDispatch();
	// React router hook for navigation
	const navigate = useNavigate();
	// State to manage the manga edit updates
	const [updatedMangaData, setUpdatedMangaData] = useState({
		title: fetchedSpecificManga.title || "",
		title_jp: fetchedSpecificManga.title_jp || "",
		description: fetchedSpecificManga.description || "",
		image: fetchedSpecificManga.customImageURL || "",
		type: fetchedSpecificManga.type || "",
		chapters: fetchedSpecificManga.chapters || 0,
		volumes: fetchedSpecificManga.volumes || 0,
		status: fetchedSpecificManga.status || "",
		publishing: fetchedSpecificManga.publishing || false,
		publishedFrom: fetchedSpecificManga.publishedFrom || "",
		publishedUntil: fetchedSpecificManga.publishedUntil || "",
		background: fetchedSpecificManga.background || "",
		authors: fetchedSpecificManga.authors || [],
		demographic: fetchedSpecificManga.demographic || [],
		serialization: fetchedSpecificManga.serialization || [],
		genres: fetchedSpecificManga.genres || [],
	});
	// State to store the image file
	const [imageFile, setImageFile] = useState(null);
	// State to store the uploaded image temporarily to show the user the new image
	const [temporaryImageURL, setTemporaryImageURL] = useState(null);

	// Function to format the timestamp into more readable data
	function formatDate(dateString) {
		return dateString ? new Date(dateString).toISOString().split("T")[0] : "";
	}

	// Function to edit the specific manga
	const editSpecificManga = async () => {
		try {
			// Redux store - dispatch action to start updating specific manga data
			dispatch(updateSpecificMangaStart());
			// Create a new FormData object to send data as a multipart/form-data for the image file
			const formDataWithImage = new FormData();
			// Iterate over the properties of updatedMangaData
			Object.entries(updatedMangaData).forEach(([key, value]) => {
				if (Array.isArray(value)) {
					// If the value is an array, append each element individually
					value.forEach((item) => {
						formDataWithImage.append(`${key}[]`, item);
					});
				} else {
					formDataWithImage.append(key, value);
				}
			});
			// Change the customImageURL property to the FormData - using the selected image file
			formDataWithImage.append("customImageURL", imageFile);
			// Backend fetch to update the manga with new details
			const response = await fetch(
				`http://localhost:3001/api/manga/manga/edit/${id}`,
				{
					method: "PATCH",
					credentials: "include",
					body: formDataWithImage,
				}
			);
			// Parse the data from the response
			const data = await response.json();
			// If the request is unsuccessful dispatch the failure with the data
			if (data.success === false) {
				dispatch(updateSpecificMangaFailure(data));
				// If the request is unsuccessful, sign the user out, clear the user redux state, redirect to login page
				dispatch(signOut());
				persistor.purge(["user"]);
				navigate("/login");
			}
			// // If the request is successful dispatch the success witht the data
			dispatch(updateSpecificMangaSuccess(data));
			// Clear the temporary image display
			setTemporaryImageURL(null);
			// Redirect to the specific manga page - currently issues with image reloading on edit
			navigate(`/manga/${id}`);
		} catch (error) {
			// If the request has an error dispatch the failure with the data
			dispatch(updateSpecificMangaFailure(error));
			// Clear the temporary image display
			setTemporaryImageURL(null);
		}
	};

	// Function to delete the manga from database
	const handleDelete = async () => {
		try {
			// Backend fetch to delete the manga from database
			const response = await fetch(
				`http://localhost:3001/api/manga/manga/delete/${id}`,
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
				{/* Form for editing manga details */}
				<form className='grid grid-cols-2 gap-6'>
					{/* Left column with input fields for manga details */}
					<div className='col-span-1 space-y-4'>
						<label className='flex flex-col'>
							Title:
							<input
								type='text'
								id='title'
								className='rounded-md bg-gray-800 p-2'
								value={updatedMangaData.title}
								onChange={(e) =>
									setUpdatedMangaData({
										...updatedMangaData,
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
								value={updatedMangaData.title_jp}
								onChange={(e) =>
									setUpdatedMangaData({
										...updatedMangaData,
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
								value={updatedMangaData.description}
								onChange={(e) =>
									setUpdatedMangaData({
										...updatedMangaData,
										description: e.target.value,
									})
								}
							/>
						</label>
						<label className='flex flex-col'>
							Image:
							<img
								src={temporaryImageURL || updatedMangaData.image}
								className='w-[255px] h-[318px] object-cover'
								alt=''
							/>
							<input
								type='file'
								id='customImageURL'
								accept='image/jpeg, image/png'
								className='rounded-md bg-gray-800 p-2 mt-4'
								onChange={(e) => {
									setImageFile(e.target.files[0]);
									setTemporaryImageURL(URL.createObjectURL(e.target.files[0]));
								}}
							/>
						</label>
						<label className='flex flex-col'>
							Type:
							<input
								type='text'
								id='type'
								value={updatedMangaData.type}
								className='rounded-md bg-gray-800 p-2'
								onChange={(e) =>
									setUpdatedMangaData({
										...updatedMangaData,
										type: e.target.value,
									})
								}
							/>
						</label>
						<label className='flex flex-col'>
							Chapters:
							<input
								type='number'
								id='chapters'
								value={updatedMangaData.chapters}
								className='rounded-md bg-gray-800 p-2'
								onChange={(e) =>
									setUpdatedMangaData({
										...updatedMangaData,
										chapters: e.target.value,
									})
								}
							/>
						</label>
						<label className='flex flex-col'>
							Volumes:
							<input
								type='number'
								id='volumes'
								value={updatedMangaData.volumes}
								className='rounded-md bg-gray-800 p-2'
								onChange={(e) =>
									setUpdatedMangaData({
										...updatedMangaData,
										volumes: e.target.value,
									})
								}
							/>
						</label>
						<label className='flex flex-col'>
							Status:
							<input
								type='text'
								id='status'
								value={updatedMangaData.status}
								className='rounded-md bg-gray-800 p-2'
								onChange={(e) =>
									setUpdatedMangaData({
										...updatedMangaData,
										status: e.target.value,
									})
								}
							/>
						</label>
					</div>
					{/* Right column with input fields for manga details */}
					<div className='col-span-1 space-y-4'>
						<label className='flex flex-col'>
							Publishing:
							<input
								type='checkbox'
								id='publishing'
								checked={updatedMangaData.publishing}
								className='rounded-md bg-gray-800 p-2'
								onChange={(e) =>
									setUpdatedMangaData({
										...updatedMangaData,
										publishing: e.target.checked,
									})
								}
							/>
						</label>
						<label className='flex flex-col'>
							Published From (Start Date):
							<input
								type='date'
								id='publishedFrom'
								value={formatDate(updatedMangaData.publishedFrom)}
								className='rounded-md bg-gray-800 p-2'
								onChange={(e) =>
									setUpdatedMangaData({
										...updatedMangaData,
										publishedFrom: e.target.value,
									})
								}
							/>
						</label>
						<label className='flex flex-col'>
							Published To (End Date):
							<input
								type='date'
								id='publishedUntil'
								value={formatDate(updatedMangaData.publishedUntil)}
								className='rounded-md bg-gray-800 p-2'
								onChange={(e) =>
									setUpdatedMangaData({
										...updatedMangaData,
										publishedUntil: e.target.value,
									})
								}
							/>
						</label>
						<label className='flex flex-col'>
							Background:
							<input
								type='text'
								id='background'
								value={updatedMangaData.background}
								className='rounded-md bg-gray-800 p-2'
								onChange={(e) =>
									setUpdatedMangaData({
										...updatedMangaData,
										background: e.target.value,
									})
								}
							/>
						</label>
						<label className='flex flex-col'>
							Authors (Comma Separated):
							<input
								className='rounded-md bg-gray-800 p-2'
								type='text'
								id='authors'
								value={updatedMangaData.authors.join(", ")}
								onChange={(e) =>
									setUpdatedMangaData((prevData) => ({
										...prevData,
										producers: e.target.value
											.split(",")
											.map((producer) => producer.trim()),
									}))
								}
							/>
						</label>
						<label className='flex flex-col'>
							Demographic (Comma Separated):
							<input
								className='rounded-md bg-gray-800 p-2'
								type='text'
								id='demographic'
								value={updatedMangaData.demographic.join(", ")}
								onChange={(e) =>
									setUpdatedMangaData((prevData) => ({
										...prevData,
										demographic: e.target.value
											.split(",")
											.map((demographic) => demographic.trim()),
									}))
								}
							/>
						</label>
						<label className='flex flex-col'>
							Serialization (Comma Separated):
							<input
								className='rounded-md bg-gray-800 p-2'
								type='text'
								id='serialization'
								value={updatedMangaData.serialization.join(", ")}
								onChange={(e) =>
									setUpdatedMangaData((prevData) => ({
										...prevData,
										serialization: e.target.value
											.split(",")
											.map((serialization) => serialization.trim()),
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
								value={updatedMangaData.genres.join(", ")}
								onChange={(e) =>
									setUpdatedMangaData((prevData) => ({
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
						onClick={() => editSpecificManga()}
					>
						Apply
					</button>
				</form>
				{/* Section for removing manga */}
				<div className='flex mt-2 space-x-4'>
					<button
						className='px-5 flex-grow py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-red-500 col-span-2'
						onClick={handleDelete}
					>
						Remove Manga
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditManga;
