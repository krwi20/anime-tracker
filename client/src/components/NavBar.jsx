import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const NavBar = () => {
	// Redux state - Gets current user information
	const { currentUser } = useSelector((state) => state.user);
	// States for search functionality
	const [searchResults, setSearchResults] = useState([]);
	const [query, setQuery] = useState("");
	// React router hook for navigation
	const navigate = useNavigate();

	// Function to search for anime
	const handleAnimeSearch = async (e) => {
		// Set the query to what the user is entering in the search bar
		const query = e.target.value;
		setQuery(query);

		// If there is no query in the search bar, clear the results
		if (!query.trim()) {
			setSearchResults([]);
			return;
		}

		try {
			// Backend fetch to get the anime search results
			const response = await fetch(
				`http://localhost:3001/api/anime/anime/search?query=${query}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			// Parse the data from the response
			const data = await response.json();
			setSearchResults(data);
		} catch (error) {
			// Console log any errors during the fetch
			console.log(error);
		}
	};

	return (
		<div className='bg-gray-900 text-white'>
			<div className='px-8 py-2'>
				<div className='flex justify-between items-center'>
					{/* Link to return to Home.jsx  */}
					<Link to='/'>
						<h1 className='text-3xl'>KioTrack</h1>
					</Link>
					<div className='flex gap-8 text-xl pt-2'>
						{/* Search Bar */}
						<div className='relative'>
							<input
								className='bg-gray-800 outline-none rounded-full border-2 border-gray-700 h-11 focus:border-purple-500 text-white px-4 w-72 text-sm transition-all duration-300 placeholder-gray-500 focus:placeholder-opacity-50'
								type='text'
								placeholder='Search for anime, manga...'
								value={query}
								onChange={(e) => handleAnimeSearch(e)}
							/>
							{/* Display the results dropdown if there are any search results */}
							{searchResults.length > 0 && (
								<ul className='absolute bg-gray-800 outline-none border-2 py-2 rounded-md border-purple-500 text-white px-3 w-72 text-sm'>
									{searchResults.map((result) => (
										// Navigate to the selected anime's page
										<li
											key={result._id}
											className='cursor-pointer rounded hover:bg-purple-500'
											onClick={() => {
												navigate(`/anime/${result._id}`);
												setQuery("");
												setSearchResults([]);
											}}
										>
											{result.title}
										</li>
									))}
								</ul>
							)}
						</div>
						{/* If there is no user logged in, show a register button as well */}
						{!currentUser && (
							<Link
								className='px-5 py-2.5 rounded-md bg-gray-800 text-white hover:bg-purple-600'
								to='/register'
							>
								Register
							</Link>
						)}
						{/* If the current user is an admin, display these features */}
						{currentUser?.role === "admin" && (
							// Button to add an anime to the database
							<div className='flex gap-4'>
								<button
									className='px-5 py-2.5 text-sm rounded-md bg-gray-800 text-white hover:bg-purple-600'
									onClick={() => navigate("/add/anime")}
								>
									Add Anime
								</button>
								{/* Button to add an Manga to the database */}
								<button
									className='px-5 py-2.5 text-sm rounded-md bg-gray-800 text-white hover:bg-purple-600'
									onClick={() => navigate("/add/manga")}
								>
									Add Manga
								</button>
								{/* Button to add a Character to the database */}
								<button
									className='px-5 py-2.5 text-sm rounded-md bg-gray-800 text-white hover:bg-purple-600'
									onClick={() => navigate("/characters/add")}
								>
									Add Character
								</button>
							</div>
						)}
						{/* If there is a user logged in, show their username else show Sign In */}
						{currentUser ? (
							// Link to the user's profile
							<Link
								className='px-5 py-2.5 rounded-md bg-gray-800 text-white hover:bg-purple-600'
								to={`/profile/${currentUser.username}`}
							>
								{currentUser.username}
							</Link>
						) : (
							<Link
								className='px-5 py-2.5 rounded-md bg-gray-800 text-white hover:bg-purple-600'
								to='/login'
							>
								Sign In
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default NavBar;
