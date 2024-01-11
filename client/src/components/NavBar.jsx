import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const NavBar = () => {
	const { currentUser } = useSelector((state) => state.user);
	const [searchResults, setSearchResults] = useState([]);
	const [query, setQuery] = useState("");
	const navigate = useNavigate();

	const handleAnimeSearch = async (e) => {
		const query = e.target.value;
		setQuery(query);

		if (!query.trim()) {
			setSearchResults([]);
			return;
		}

		try {
			const res = await fetch(
				`http://localhost:3001/api/anime/anime/search?query=${query}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			const data = await res.json();
			setSearchResults(data);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='bg-gray-900 text-white'>
			<div className='px-8 py-2'>
				<div className='flex justify-between items-center'>
					<Link to='/'>
						<h1 className='text-3xl'>KioTrack</h1>
					</Link>
					<div className='flex gap-8 text-xl pt-2'>
						<div className='relative'>
							<input
								className='bg-gray-800 outline-none rounded-full border-2 border-gray-700 h-11 focus:border-purple-500 text-white px-4 w-72 text-sm transition-all duration-300 placeholder-gray-500 focus:placeholder-opacity-50'
								type='text'
								placeholder='Search for anime, manga...'
								value={query}
								onChange={(e) => handleAnimeSearch(e)}
							/>
							{searchResults.length > 0 && (
								<ul className='absolute bg-gray-800 outline-none border-2 py-2 rounded-md border-purple-500 text-white px-3 w-72 text-sm'>
									{searchResults.map((result) => (
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
						{!currentUser && (
							<Link
								className='px-5 py-2.5 rounded-md bg-gray-800 text-white hover:bg-purple-600'
								to='/register'
							>
								Register
							</Link>
						)}
						{currentUser?.role === "admin" && (
							<button
								className='px-5 py-2.5 rounded-md bg-gray-800 text-white hover:bg-purple-600'
								onClick={() => navigate("/add/anime")}
							>
								Add Anime
							</button>
						)}
						{currentUser ? (
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
