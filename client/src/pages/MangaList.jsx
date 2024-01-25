import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
	getUserStart,
	getUserSuccess,
	getUserFailure,
} from "../redux/user/userSlice";
const MangaList = () => {
	// Extract the username from the url params
	const { username } = useParams();
	// Redux dispatch hook
	const dispatch = useDispatch();
	// Redux state - gets current and fetched user information
	// React router hook for navigation
	const navigate = useNavigate();
	// Redux state - gets current and fetched user information
	const { currentUser, fetchedUser, loading } = useSelector(
		(state) => state.user
	);
	// State to manage
	const [manga, setManga] = useState([]);

	// Fetch user data
	useEffect(() => {
		const fetchUserData = async () => {
			// Redux store - dispatch action to start fetching the user
			dispatch(getUserStart());
			try {
				// Backend fetch to get user information
				const response = await fetch(
					`http://localhost:3001/api/auth/test/${username}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
				// Parse the data from the response
				const data = await response.json();
				// Obtain the manga IDs and sort them based on the status
				const allMangaIds = Object.keys(data.trackedManga || []).sort(
					(a, b) =>
						(data.trackedManga[b].status === "Reading") -
							(data.trackedManga[a].status === "Reading") ||
						(data.trackedManga[b].status === "Completed") -
							(data.trackedManga[a].status === "Completed") ||
						(data.trackedManga[b].status === "On Hold") -
							(data.trackedManga[a].status === "On Hold") ||
						(data.trackedManga[b].status === "Dropped") -
							(data.trackedManga[a].status === "Dropped") ||
						(data.trackedManga[b].status === "Plan to read") -
							(data.trackedManga[a].status === "Plan to read")
				); // Fetch specific data from the most recent IDs
				const mangaDataPromises = allMangaIds.map(fetchSpecificManga);
				const mangaData = await Promise.all(mangaDataPromises);
				// Set the state with the fetched data
				setManga(mangaData);
				//  If the request is unsuccessful dispatch the failure "User not found!" redirect to homepage
				if (data.success === false) {
					dispatch(getUserFailure("User not found!"));
					navigate("/");
				}
				// If the request is successful dispatch the success with the data
				dispatch(getUserSuccess(data));
			} catch (error) {
				// If the request has an error dispatch the failure witht the error message or default "something went wrong"
				dispatch(getUserFailure(error.message || "Something went wrong!"));
			}
		};
		// Call the fetch user data function
		fetchUserData();
	}, [dispatch, username, navigate]);

	// Function to fetch the specific manga
	const fetchSpecificManga = async (mangaId) => {
		try {
			// Backend fetch to get the specific manga
			const response = await fetch(
				`http://localhost:3001/api/manga/manga/${mangaId}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			// Parse the data from the response
			const data = await response.json();
			// Return the data
			return data;
		} catch (error) {
			// Console log the error
			console.error("Error fetching specific manga:", error);
		}
	};

	return (
		<div className='bg-gradient-to-br from-gray-800 to-gray-700 text-white min-h-[calc(100vh-64px)] p-4'>
			{loading ? (
				<div className='flex items-center justify-center h-full'>
					<div className='animate-spin rounded-full border-t-2 border-b-2 border-[#8A4FFF] h-12 w-12'></div>
				</div>
			) : (
				<div>
					{fetchedUser && (
						<div className='bg-gray-900 text-white mx-4 mt-6 rounded-lg p-6'>
							<h1 className='text-3xl font-bold mb-4'>
								{fetchedUser.username}'s Manga List
							</h1>
							{manga.map((manga) => (
								<div
									className='flex items-center border-b border-gray-700 py-4'
									key={manga?._id}
								>
									<div className='flex-shrink-0 w-24'>
										<span
											className={`text-sm ${
												fetchedUser.trackedManga[manga?._id]?.status ===
												"Reading"
													? "text-blue-500"
													: fetchedUser.trackedManga[manga?._id]?.status ===
													  "Dropped"
													? "text-red-500"
													: fetchedUser.trackedManga[manga?._id]?.status ===
													  "On Hold"
													? "text-yellow-500"
													: fetchedUser.trackedManga[manga?._id]?.status ===
													  "Plan to read"
													? "text-gray-200"
													: fetchedUser.trackedManga[manga?._id]?.status ===
													  "Watching"
													? "text-green-500"
													: ""
											}`}
										>
											{fetchedUser.trackedManga[manga?._id]?.status}
										</span>
									</div>
									<div className='flex-shrink-0 w-12 h-16 mr-4'>
										<img
											src={manga?.customImageURL}
											alt={manga?.title}
											className='w-full h-full object-cover rounded'
										/>
									</div>
									<div className='flex-grow mr-4'>
										<h2 className='text-lg font-bold'>{manga?.title}</h2>
										<p className='text-gray-400'>{manga?.type}</p>
									</div>
									<div className='flex-shrink-0 w-24'>
										<p className='text-gray-400'>
											{fetchedUser.trackedManga[manga?._id]?.chaptersRead}/
											{manga?.chapters} Chapters
										</p>
									</div>
									<div className='flex-shrink-0 w-24'>
										<p className='text-gray-400'>
											{fetchedUser.trackedManga[manga?._id]?.volumesRead}/
											{manga?.volumes} Volumes
										</p>
									</div>
									<div className='flex-shrink-0 w-24'>
										<p className='text-gray-400'>
											Rating: {fetchedUser.trackedManga[manga?._id]?.rating}
										</p>
									</div>
									<div className='flex-shrink-0 w-24'>
										<button className='text-sm text-gray-400 hover:text-white'>
											Edit
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default MangaList;
