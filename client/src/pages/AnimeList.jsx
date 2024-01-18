import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
	getUserStart,
	getUserSuccess,
	getUserFailure,
} from "../redux/user/userSlice";

const AnimeList = () => {
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
	const [anime, setAnime] = useState([]);

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
				// Obtain the anime IDs and sort them based on the status
				const allAnimeIds = Object.keys(data.trackedAnime || []).sort(
					(a, b) =>
						(data.trackedAnime[b].status === "Watching") -
							(data.trackedAnime[a].status === "Watching") ||
						(data.trackedAnime[b].status === "Completed") -
							(data.trackedAnime[a].status === "Completed") ||
						(data.trackedAnime[b].status === "On Hold") -
							(data.trackedAnime[a].status === "On Hold") ||
						(data.trackedAnime[b].status === "Dropped") -
							(data.trackedAnime[a].status === "Dropped") ||
						(data.trackedAnime[b].status === "Plan to watch") -
							(data.trackedAnime[a].status === "Plan to watch")
				); // Fetch specific data from the most recent IDs
				const animeDataPromises = allAnimeIds.map(fetchSpecificAnime);
				const animeData = await Promise.all(animeDataPromises);
				// Set the state with the fetched data
				setAnime(animeData);
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

	// Function to fetch the specific anime
	const fetchSpecificAnime = async (animeId) => {
		try {
			// Backend fetch to get the specific anime
			const response = await fetch(
				`http://localhost:3001/api/anime/anime/${animeId}`,
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
			console.error("Error fetching specific anime:", error);
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
								{fetchedUser.username}'s Anime List
							</h1>
							{anime.map((anime) => (
								<div
									className='flex items-center border-b border-gray-700 py-4'
									key={anime._id}
								>
									<div className='flex-shrink-0 w-24'>
										<span
											className={`text-sm ${
												fetchedUser.trackedAnime[anime._id]?.status ===
												"Completed"
													? "text-blue-500"
													: fetchedUser.trackedAnime[anime._id]?.status ===
													  "Dropped"
													? "text-red-500"
													: fetchedUser.trackedAnime[anime._id]?.status ===
													  "On Hold"
													? "text-yellow-500"
													: fetchedUser.trackedAnime[anime._id]?.status ===
													  "Plan to watch"
													? "text-gray-200"
													: fetchedUser.trackedAnime[anime._id]?.status ===
													  "Watching"
													? "text-green-500"
													: ""
											}`}
										>
											{fetchedUser.trackedAnime[anime._id]?.status}
										</span>
									</div>
									<div className='flex-shrink-0 w-12 h-16 mr-4'>
										<img
											src={anime.customImageURL}
											alt={anime.title}
											className='w-full h-full object-cover rounded'
										/>
									</div>
									<div className='flex-grow mr-4'>
										<h2 className='text-lg font-bold'>{anime.title}</h2>
										<p className='text-gray-400'>{anime.type}</p>
									</div>
									<div className='flex-shrink-0 w-24'>
										<p className='text-gray-400'>
											{fetchedUser.trackedAnime[anime._id]?.episodesWatched}/
											{anime.episodes} Episodes
										</p>
									</div>
									<div className='flex-shrink-0 w-24'>
										<p className='text-gray-400'>
											Rating: {fetchedUser.trackedAnime[anime._id]?.rating}
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

export default AnimeList;
