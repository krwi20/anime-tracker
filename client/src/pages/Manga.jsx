import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { persistor } from "../redux/store";
import {
	getSpecificMangaStart,
	getSpecificMangaSuccess,
	getSpecificMangaFailure,
} from "../redux/manga/mangaSlice";
import {
	updateUserStart,
	updateUserSuccess,
	updateUserFailure,
	signOut,
} from "../redux/user/userSlice";

const Manga = () => {
	// Extract the id from the url params
	const { id } = useParams();
	// Redux state - gets manga and user information
	const { fetchedSpecificManga, loading } = useSelector((state) => state.manga);
	const { currentUser } = useSelector((state) => state.user);
	// Redux dispatch hook
	const dispatch = useDispatch();
	// React router hook for navigation
	const navigate = useNavigate();
	// State to manage the number of chapters the user's read
	const [chaptersRead, setChaptersRead] = useState(
		currentUser?.trackedManga?.[id]?.chaptersRead || 0
	);
	// State to manage the number of volumes the user's read
	const [volumesRead, setVolumesRead] = useState(
		currentUser?.trackedManga?.[id]?.volumesRead || 0
	);

	// Function to format the timestamp into more readable data
	const formatDate = (timestamp) => {
		const date = new Date(timestamp);
		const options = { year: "numeric", month: "long", day: "numeric" };
		return date.toLocaleDateString("en-US", options);
	};

	// Fetch the specific manga data
	useEffect(() => {
		const fetchSpecificManga = async () => {
			try {
				// Redux store - dispatch action to start fetching specific manga data
				dispatch(getSpecificMangaStart());
				const response = await fetch(
					`http://localhost:3001/api/manga/manga/${id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
				// Parse the data from the response
				const data = await response.json();
				// If the request is unsuccessful dispatch the failure with the data
				if (data.success === false) {
					dispatch(getSpecificMangaFailure(data));
					return;
				}
				// If the request is successfull dispatch the success with the data
				dispatch(getSpecificMangaSuccess(data));
			} catch (error) {
				// If there is an error dispatch the failure with the error
				dispatch(getSpecificMangaFailure(error));
			}
		};
		// Call the fetch specific manga function
		fetchSpecificManga();
	}, [dispatch, id]);

	// Function to add manga to the user's tracked manga
	const trackManga = async (status) => {
		try {
			// Dispatch - start update the user
			dispatch(updateUserStart());
			// Backend fetch to add manga to the user's tracked manga
			const response = await fetch(`http://localhost:3001/api/auth/add/manga`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: currentUser._id,
					mangaId: id,
					status: status,
					timeUpdated: new Date(),
				}),
			});
			// Parse the data from the response
			const data = await response.json();
			// If the request is unsuccessful, sign the user out, clear the user redux state, redirect to login page
			if (data.success === false) {
				dispatch(updateUserFailure(data));
				dispatch(signOut());
				persistor.purge(["user"]);
				navigate("/login");
				return;
			}
			// If the request is successful dispatch the success of updating the user with the data
			dispatch(updateUserSuccess(data.updatedUser));
		} catch (error) {
			// If there is an error dispatch the failure with the error
			dispatch(updateUserFailure(error));
		}
	};

	// Function to update the user's amount of chapters read
	const updateChaptersRead = async () => {
		let value = chaptersRead;
		// If the total chapters are known, check if the user's input exceeds the total chapters
		if (
			fetchedSpecificManga.chapters !== null &&
			value > fetchedSpecificManga.chapters
		) {
			value = fetchedSpecificManga.chapters;
		}
		// If the user's input is < 0, set the user's input to 0
		value = Math.max(0, value);

		try {
			// Dispatch - start update the user
			dispatch(updateUserStart());
			// Backend fetch to update the user's amount of chapters read
			const response = await fetch(
				`http://localhost:3001/api/auth/updateChapters`,
				{
					method: "PATCH",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userId: currentUser._id,
						mangaId: id,
						chaptersRead: value,
						timeUpdated: new Date(),
					}),
				}
			);
			// Parse the data from the response
			const data = await response.json();
			// If the request is unsuccessful, sign the user out, clear the user redux state, redirect to login page
			if (data.success === false) {
				dispatch(updateUserFailure(data));
				dispatch(signOut());
				persistor.purge(["user"]);
				navigate("/login");
			}
			// If the request is successful dispatch the success of updating the user with the data
			dispatch(updateUserSuccess(data.updatedUser));
		} catch (error) {
			// If there is an error dispatch the failure with the error
			dispatch(updateUserFailure(error));
		}
	};

	// Function to update the user's amount of volumes read
	const updateVolumesRead = async () => {
		let value = chaptersRead;
		// If the total volumes are known, check if the user's input exceeds the total volumes
		if (
			fetchedSpecificManga.volumes !== null &&
			value > fetchedSpecificManga.volumes
		) {
			value = fetchedSpecificManga.volumes;
		}
		// If the user's input is < 0, set the user's input to 0
		value = Math.max(0, value);

		try {
			// Dispatch - start update the user
			dispatch(updateUserStart());
			// Backend fetch to update the user's amount of volumes read
			const response = await fetch(
				`http://localhost:3001/api/auth/updateVolumes`,
				{
					method: "PATCH",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userId: currentUser._id,
						mangaId: id,
						volumesRead: value,
						timeUpdated: new Date(),
					}),
				}
			);
			// Parse the data from the response
			const data = await response.json();
			// If the request is unsuccessful, sign the user out, clear the user redux state, redirect to login page
			if (data.success === false) {
				dispatch(updateUserFailure(data));
				dispatch(signOut());
				persistor.purge(["user"]);
				navigate("/login");
			}
			// If the request is successful dispatch the success of updating the user with the data
			dispatch(updateUserSuccess(data.updatedUser));
		} catch (error) {
			// If there is an error dispatch the failure with the error
			dispatch(updateUserFailure(error));
		}
	};

	// Function to update the user's chapters read by 1
	const updateChaptersReadByOne = async () => {
		// Get the user's chapter count for this manga
		let value = currentUser?.trackedManga?.[id]?.chaptersRead;

		// If it's undefined, set the value to 1; otherwise, increment it
		value = value === undefined ? 1 : value + 1;

		// If it is increased over the total chapter count for the manga, set the value as the highest amount of chapters
		if (value > fetchedSpecificManga.chapters) {
			value = fetchedSpecificManga.chapters;
		}
		try {
			// Dispatch - start update the user
			dispatch(updateUserStart());
			// Backend fetch to update the user's chapters read
			const response = await fetch(
				`http://localhost:3001/api/auth/updateChapters`,
				{
					method: "PATCH",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userId: currentUser._id,
						mangaId: id,
						chaptersRead: value,
						timeUpdated: new Date(),
					}),
				}
			);
			// Parse the data from the response
			const data = await response.json();
			// If the request is unsuccessful, sign the user out, clear the user redux state, redirect to login page
			if (data.success === false) {
				dispatch(updateUserFailure(data));
				dispatch(signOut());
				persistor.purge(["user"]);
				navigate("/login");
			}
			// If the request is successful dispatch the success of updating the user with the data
			dispatch(updateUserSuccess(data.updatedUser));
		} catch (error) {
			// If there is an error dispatch the failure with the error
			dispatch(updateUserFailure(error));
		}
	};
	// Function to update the user's volumes read by 1
	const updateVolumesReadByOne = async () => {
		// Get the user's volume count for this manga
		let value = currentUser?.trackedManga?.[id]?.volumesRead;

		// If it's undefined, set the value to 1; otherwise, increment it
		value = value === undefined ? 1 : value + 1;

		// If it is increased over the total volume count for the manga, set the value as the highest amount of chapters
		if (value > fetchedSpecificManga.volumes) {
			value = fetchedSpecificManga.volumes;
		}
		try {
			// Dispatch - start update the user
			dispatch(updateUserStart());
			// Backend fetch to update the user's volumes read
			const response = await fetch(
				`http://localhost:3001/api/auth/updateVolumes`,
				{
					method: "PATCH",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userId: currentUser._id,
						mangaId: id,
						volumesRead: value,
						timeUpdated: new Date(),
					}),
				}
			);
			// Parse the data from the response
			const data = await response.json();
			// If the request is unsuccessful, sign the user out, clear the user redux state, redirect to login page
			if (data.success === false) {
				dispatch(updateUserFailure(data));
				dispatch(signOut());
				persistor.purge(["user"]);
				navigate("/login");
			}
			// If the request is successful dispatch the success of updating the user with the data
			dispatch(updateUserSuccess(data.updatedUser));
		} catch (error) {
			// If there is an error dispatch the failure with the error
			dispatch(updateUserFailure(error));
		}
	};

	// Function to update the user's rating for the manga
	const updateMangaRating = async (rating) => {
		try {
			// Dispatch - start update the user
			dispatch(updateUserStart());
			// Backend fetch to update the user's rating
			const response = await fetch(
				`http://localhost:3001/api/auth/updateManga`,
				{
					method: "PATCH",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userId: currentUser._id,
						mangaId: id,
						rating: rating,
						timeUpdated: new Date(),
					}),
				}
			);
			// Parse the data from the response
			const data = await response.json();
			// If the request is unsuccessful, sign the user out, clear the user redux state, redirect to login page
			if (data.success === false) {
				dispatch(updateUserFailure(data));
				dispatch(signOut());
				persistor.purge(["user"]);
				navigate("/login");
			}
			// If the request is successful dispatch the success of updating the user with the data
			dispatch(updateUserSuccess(data.updatedUser));
		} catch (error) {
			// If there is an error dispatch the failure with the error
			dispatch(updateUserFailure(error));
		}
	};

	// Function to remove manga from the user's list
	const removeManga = async () => {
		try {
			// Dispatch - start update the user
			dispatch(updateUserStart());
			// Backend fetch to remove the manga from the user's list
			const response = await fetch(
				`http://localhost:3001/api/auth/manga/remove/${currentUser._id}/${fetchedSpecificManga._id}`,
				{
					method: "DELETE",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			// Parse the data from the response
			const data = await response.json();
			// If the request is unsuccessful, sign the user out, clear the user redux state, redirect to login page
			if (data.success === false) {
				dispatch(updateUserFailure(data));
				dispatch(signOut());
				persistor.purge(["user"]);
				navigate("/login");
			}
			// If the request is successful dispatch the success of updating the user with the data
			dispatch(updateUserSuccess(data));
		} catch (error) {
			// If there is an error dispatch the failure with the error
			dispatch(updateUserFailure(error));
		}
	};

	return (
		<div className='bg-gradient-to-br from-gray-800 to-gray-700 text-white min-h-[calc(100vh-64px)] p-4'>
			{/* Loading spinner while being fetched */}
			{loading ? (
				<div className='flex items-center justify-center h-full'>
					<div className='animate-spin rounded-full border-t-2 border-b-2 border-[#8A4FFF] h-12 w-12'></div>
				</div>
			) : (
				<div>
					{/* Display the specific manga's information if there is any */}
					{fetchedSpecificManga && (
						<div className='bg-gray-900 rounded-lg p-4 m-4'>
							<div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
								{/* Left column - manga details */}
								<div className='lg:col-span-2'>
									<div className='flex flex-col'>
										<h1 className='text-4xl font-bold mb-2'>
											{fetchedSpecificManga.title}
										</h1>
										<p className='text-lg mb-4'>
											{fetchedSpecificManga.title_jp}
										</p>
										<div className='flex mb-4'>
											<img
												src={fetchedSpecificManga.customImageURL}
												alt={fetchedSpecificManga.title}
												className='object-cover rounded-md w-[225px] h-[318px]'
											/>
											<div className='w-1/2 ml-4'>
												<span className='text-lg font-bold'>Description:</span>
												<div className='border-b-2 border-gray-700'></div>
												<p className='w-full'>
													{fetchedSpecificManga.description}
												</p>
											</div>
										</div>
									</div>
								</div>
								{/* Center column - manga details */}
								<div className='lg:col-span-1 space-y-4'>
									<div className='flex flex-col'>
										<span className='text-lg font-bold'>Details:</span>
										<div className='border-b-2 border-gray-700'></div>
										<div className='flex flex-col mt-2 space-y-2'>
											{/* Manga Details */}
											<span>
												<span className='font-bold'>Type:</span>{" "}
												{fetchedSpecificManga.type}
											</span>
											<span>
												<span className='font-bold'>Chapters:</span>{" "}
												{fetchedSpecificManga.chapters
													? fetchedSpecificManga.chapters
													: "Unknown"}
											</span>
											<span>
												<span className='font-bold'>Volumes:</span>{" "}
												{fetchedSpecificManga.volumes
													? fetchedSpecificManga.volumes
													: "Unknown"}
											</span>
											<span>
												<span className='font-bold'>Status:</span>{" "}
												{fetchedSpecificManga.status}
											</span>
											<span>
												<span className='font-bold'>Published:</span>{" "}
												{fetchedSpecificManga.publishedUntil
													? `${formatDate(
															fetchedSpecificManga.publishedFrom
													  )} to ${formatDate(
															fetchedSpecificManga.publishedUntil
													  )}`
													: `Aired from ${formatDate(
															fetchedSpecificManga.publishedFrom
													  )} - ?`}
											</span>
											<span>
												<span className='font-bold'>Authors:</span>{" "}
												{fetchedSpecificManga.authors &&
												fetchedSpecificManga.authors.filter(Boolean).length > 0
													? fetchedSpecificManga.authors
															.filter(Boolean)
															.join(", ")
													: "None added"}
											</span>
											<span>
												<span className='font-bold'>Serialization:</span>{" "}
												{fetchedSpecificManga.serialization &&
												fetchedSpecificManga.serialization.filter(Boolean)
													.length > 0
													? fetchedSpecificManga.serialization
															.filter(Boolean)
															.join(", ")
													: "None added"}
											</span>
											<span>
												<span className='font-bold'>Genres:</span>{" "}
												{fetchedSpecificManga.genres &&
												fetchedSpecificManga.genres.filter(Boolean).length > 0
													? fetchedSpecificManga.genres
															.filter(Boolean)
															.join(", ")
													: "None added"}
											</span>
										</div>
									</div>
								</div>
								{/* Right column - user actions */}
								<div className='lg:col-span-3 space-y-4'>
									<div className='border-b-2 border-gray-700'></div>
									{/* User status actions */}
									<div className='flex flex-col'>
										<span className='text-lg font-bold mb-2 '>
											Your Status:
										</span>
										<div className='flex mt-2 space-x-4'>
											<button onClick={() => trackManga("Reading")}>
												<span
													className={`px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-purple-600 
                        ${
													currentUser?.trackedManga?.[id]?.status === "Reading"
														? "bg-purple-600"
														: ""
												}`}
												>
													Reading
												</span>
											</button>
											<button onClick={() => trackManga("Completed")}>
												<span
													className={`px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-purple-600 
                        ${
													currentUser?.trackedManga?.[id]?.status ===
													"Completed"
														? "bg-purple-600"
														: ""
												}`}
												>
													Completed
												</span>
											</button>
											<button onClick={() => trackManga("Plan to read")}>
												<span
													className={`px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-purpl	e-600 
                        ${
													currentUser?.trackedManga?.[id]?.status ===
													"Plan to read"
														? "bg-purple-600"
														: ""
												}`}
												>
													Plan to read
												</span>
											</button>
											<button onClick={() => trackManga("On Hold")}>
												<span
													className={`px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-purple-600 
                        ${
													currentUser?.trackedManga?.[id]?.status === "On Hold"
														? "bg-purple-600"
														: ""
												}`}
												>
													On Hold
												</span>
											</button>
											<button onClick={() => trackManga("Dropped")}>
												<span
													className={`px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-purple-600 
                        ${
													currentUser?.trackedManga?.[id]?.status === "Dropped"
														? "bg-purple-600"
														: ""
												}`}
												>
													Dropped
												</span>
											</button>
										</div>
									</div>
									{/* User rating section */}
									<div className='flex flex-col'>
										<span className='text-lg font-bold'>Your Rating:</span>
										<div className='flex mt-2 space-x-4'>
											{/* TODO - ADD OPTION TO REMOVE RATING */}
											{/* Rating options */}
											{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
												<button
													key={num}
													onClick={() => updateMangaRating(num)}
													className={`px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-purple-600${
														currentUser?.trackedManga?.[id]?.rating === num
															? " bg-purple-600 py-2 px-4 rounded-md cursor-pointer"
															: ""
													}`}
												>
													{num}
												</button>
											))}
										</div>
									</div>
									{/* Chapters & Volumes read section */}
									<div className='flex flex-col'>
										<span className='text-lg font-bold'>Chapters Read:</span>
										<div className='flex mt-2 space-x-4'>
											{/* Increase chapters read by one */}
											<button
												onClick={() => updateChaptersReadByOne()}
												className='px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-purple-600'
											>
												+1
											</button>
											{/* Set chapters read to input value */}
											<input
												type='number'
												min='0'
												max={fetchedSpecificManga.chapters}
												placeholder={
													currentUser?.trackedManga?.[id]?.chaptersRead
												}
												onChange={(e) => setChaptersRead(e.target.value)}
												className='w-16 p-2 rounded-md bg-gray-800'
											/>
											<button
												onClick={() => updateChaptersRead()}
												className='px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-purple-600'
											>
												Update
											</button>
										</div>
										<span className='text-lg font-bold mt-4'>
											Volumes Read:
										</span>
										<div className='flex mt-2 space-x-4'>
											{/* Increase volumes read by one */}
											<button
												onClick={() => updateVolumesReadByOne()}
												className='px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-purple-600'
											>
												+1
											</button>
											{/* Set volumes read to input value */}
											<input
												type='number'
												min='0'
												max={fetchedSpecificManga.volumes}
												placeholder={
													currentUser?.trackedManga?.[id]?.volumesRead
												}
												onChange={(e) => setVolumesRead(e.target.value)}
												className='w-16 p-2 rounded-md bg-gray-800'
											/>
											<button
												onClick={() => updateVolumesRead()}
												className='px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-purple-600'
											>
												Update
											</button>
										</div>
									</div>
									{/* User actions section */}
									<div className='flex flex-col'>
										<span className='text-lg font-bold'>Actions:</span>
										<div className='flex mt-2 space-x-4'>
											{/* Remove manga from tracked list */}
											<button
												onClick={() => removeManga()}
												className='px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-red-500'
											>
												Remove from List
											</button>
											{/* If the user is an admin render this section */}
											{currentUser?.role === "admin" && (
												// Allows admins to edit the specific manga
												<button
													onClick={() => navigate(`/edit/manga/${id}`)}
													className='px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800 rounded-md hover:bg-green-500'
												>
													Edit Manga
												</button>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default Manga;
