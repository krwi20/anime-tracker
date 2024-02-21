import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { persistor } from "../redux/store";
import { signOut } from "../redux/user/userSlice";

const AddCharacter = () => {
	// React router hook for navigation
	const navigate = useNavigate();
	// Redux dispatch hook
	const dispatch = useDispatch();
	//  State to manage the data from the form
	const [formData, setFormData] = useState({
		name: "",
		alternativeName: "",
		description: "Description not currently created...",
		customImageURL:
			"https://wrki20-anime-track.s3.eu-central-1.amazonaws.com/NoImage.png",
		animeAppearences: [],
		mangaAppearences: [],
	});
	// State to store the image file
	const [imageFile, setImageFile] = useState(null);
	// State to store the uploaded image temporarily to show the user the new image
	const [temporaryImageURL, setTemporaryImageURL] = useState(null);
	// Redux state - gets anime information
	const { fetchedAllAnime, loading } = useSelector((state) => state.anime);
	// Redux state - gets manga information
	const { fetchedAllManga } = useSelector((state) => state.manga);

	// Function to handle the input changes in the form
	const handleChange = (e) => {
		const { id, value } = e.target;

		// Handles any other ids that don't require being changed
		setFormData((prevData) => ({
			...prevData,
			[id]: value,
		}));
	};

	// Function to handle the form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			// Create a new FormData object to send data as multipart/form-data for the image file
			const formDataWithImage = new FormData();
			// Iterate over the properties of formData
			Object.entries(formData).forEach(([key, value]) => {
				// If the value is an object (specifically "broadcast"), append its properties individually
				if (Array.isArray(value)) {
					// If the value is an array, append each element individually
					value.forEach((item) => {
						formDataWithImage.append(key, item);
					});
				} else {
					formDataWithImage.append(key, value);
				}
			});
			// Change the customImageURL property in FormData using the selected image file
			formDataWithImage.append("customImageURL", imageFile);

			for (const pair of formDataWithImage.entries()) {
				console.log(pair[0] + ", " + pair[1]);
			}
			// Backend fetch to add the manga to the database
			const response = await fetch(
				"http://localhost:3001/api/characters/characters/add",
				{
					method: "POST",
					credentials: "include",
					body: formDataWithImage,
				}
			);
			// Parse the data from the response
			const data = await response.json();
			// If the request is unsuccessful, sign the user out, clear the user redux state, redirec to login page
			if (data.success === false) {
				dispatch(signOut());
				persistor.purge(["user"]);
				navigate("/login");
			}
			// Clear the temporary image display
			setTemporaryImageURL(null);
			// If the request is successful, redirect back to homepage
			navigate("/");
		} catch (error) {
			// Console log any errors during the fetch
			console.log(error);
			// Clear the temporary image display
			setTemporaryImageURL(null);
		}
	};

	const [showAnimeAddPanel, setShowAnimeAddPanel] = useState(false);

	const handleAddAnimeClick = (e) => {
		e.preventDefault(); // Prevent form submission
		setShowAnimeAddPanel(true);
	};

	const [showMangaAddPanel, setShowMangaAddPanel] = useState(false);

	const handleAddMangaClick = (e) => {
		e.preventDefault(); // Prevent form submission
		setShowMangaAddPanel(true);
	};

	// States for search functionality
	const [searchResults, setSearchResults] = useState([]);
	const [query, setQuery] = useState("");

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

	// Function to search for anime
	const handleMangaSearch = async (e) => {
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
				`http://localhost:3001/api/manga/manga/search?query=${query}`,
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

	const test = (anime) => {
		const isAnimeSelected = formData.animeAppearences.includes(anime._id);

		if (!isAnimeSelected) {
			setFormData((prevData) => ({
				...prevData,
				animeAppearences: [...prevData.animeAppearences, anime._id],
			}));
		} else {
			setFormData((prevData) => ({
				...prevData,
				animeAppearences: prevData.animeAppearences.filter(
					(id) => id !== anime._id
				),
			}));
		}
	};

	const testManga = (manga) => {
		const isMangaSelected = formData.mangaAppearences.includes(manga._id);

		if (!isMangaSelected) {
			setFormData((prevData) => ({
				...prevData,
				mangaAppearences: [...prevData.mangaAppearences, manga._id],
			}));
		} else {
			setFormData((prevData) => ({
				...prevData,
				mangaAppearences: prevData.mangaAppearences.filter(
					(id) => id !== manga._id
				),
			}));
		}
	};

	return (
		<div className='bg-gradient-to-br from-gray-800 to-gray-700 text-white min-h-[calc(100vh-64px)] p-4'>
			<div className='bg-gray-900 mx-auto rounded-lg p-6'>
				<form className='grid grid-cols-2 gap-6' onSubmit={handleSubmit}>
					{/* Form inputs for the details of the manga */}
					<div className='col-span-1 space-y-4'>
						<label className='flex flex-col'>
							Name:
							<input
								type='text'
								id='name'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Alternative Name:
							<input
								type='text'
								id='alternativeName'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Description:
							<textarea
								id='description'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Image:
							<img
								src={
									temporaryImageURL ||
									`https://wrki20-anime-track.s3.eu-central-1.amazonaws.com/NoImage.png`
								}
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
							Anime Appearences:
							<ul>
								{formData.animeAppearences.map((animeId) => (
									<li key={animeId}>
										{
											fetchedAllAnime.find((anime) => anime._id === animeId)
												.title
										}
									</li>
								))}
							</ul>
							<button onClick={handleAddAnimeClick}>Add</button>
						</label>
						<label className='flex flex-col'>
							Manga Appearences:
							<ul>
								{formData.mangaAppearences.map((mangaId) => (
									<li key={mangaId}>
										{
											fetchedAllManga.find((manga) => manga._id === mangaId)
												.title
										}
									</li>
								))}
							</ul>
							<button onClick={handleAddMangaClick}>Add</button>
						</label>
					</div>
					{/* Form Submission Button */}
					<button
						type='submit'
						className='bg-gray-800 rounded-md flex-grow px-4 py-2 hover:bg-purple-600 col-span-2'
					>
						Submit
					</button>
				</form>
			</div>
			{showAnimeAddPanel && (
				<div className='fixed inset-0 flex items-center justify-center backdrop-filter backdrop-blur-lg'>
					<div className='bg-gray-900 rounded-lg p-6 w-[1800px] h-[1300px] flex flex-col justify-between'>
						<div>
							<h2 className='text-white text-xl mb-4'>Add Anime Appearances</h2>
							{/* Search bar for anime */}
							<input
								className='bg-gray-800 text-white px-3 py-2 rounded-md w-full mb-4 focus:outline-none focus:ring focus:border-purple-500'
								type='text'
								placeholder='Search for anime...'
								value={query}
								onChange={(e) => handleAnimeSearch(e)}
							/>
							{/* Container for anime content with fixed height and scrolling */}
							<div className='max-h-[1100px] pr-4 overflow-y-auto'>
								{/* Display search results or fetchedAllAnime */}
								{query.trim() === "" ? (
									<div className='flex gap-4 flex-wrap'>
										{fetchedAllAnime
											.filter((anime) =>
												formData.animeAppearences.includes(anime._id)
											)
											.map((result) => (
												<div
													key={result._id}
													className={`bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center w-[150px] hover:bg-blue-500 ${
														formData.animeAppearences.includes(result._id)
															? "bg-green-500"
															: ""
													}`}
													onClick={() => test(result)}
												>
													<img
														src={result.customImageURL}
														alt={result.title}
														className='object-cover rounded-md w-24 h-32 mb-2'
													/>
													<span className='text-white text-center'>
														{result.title}
													</span>
												</div>
											))}
										{/* Display remaining anime appearances */}
										{fetchedAllAnime
											.filter(
												(anime) =>
													!formData.animeAppearences.includes(anime._id)
											)
											.map((result) => (
												<div
													key={result._id}
													className={`bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center w-[150px] hover:bg-blue-500 ${
														formData.animeAppearences.includes(result._id)
															? "bg-green-500"
															: ""
													}`}
													onClick={() => test(result)}
												>
													<img
														src={result.customImageURL}
														alt={result.title}
														className='object-cover rounded-md w-24 h-32 mb-2'
													/>
													<span className='text-white text-center'>
														{result.title}
													</span>
												</div>
											))}
									</div>
								) : (
									<div className='flex gap-4 flex-wrap'>
										{searchResults.map((result) => (
											<div
												key={result._id}
												className={`bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center w-[150px] hover:bg-blue-500 ${
													formData.animeAppearences.includes(result._id)
														? "bg-green-500"
														: ""
												}`}
												onClick={() => test(result)}
											>
												<img
													src={result.customImageURL}
													alt={result.title}
													className='object-cover rounded-md w-24 h-32 mb-2'
												/>
												<span className='text-white text-center'>
													{result.title}
												</span>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
						{/* Close button */}
						<button
							onClick={() => setShowAnimeAddPanel(false)}
							className='bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md mt-4 ml-auto'
						>
							Close
						</button>
					</div>
				</div>
			)}
			{showMangaAddPanel && (
				<div className='fixed inset-0 flex items-center justify-center backdrop-filter backdrop-blur-lg'>
					<div className='bg-gray-900 rounded-lg p-6 w-[1800px] h-[1300px] flex flex-col justify-between'>
						<div>
							<h2 className='text-white text-xl mb-4'>Add Manga Appearances</h2>
							{/* Search bar for manga */}
							<input
								className='bg-gray-800 text-white px-3 py-2 rounded-md w-full mb-4 focus:outline-none focus:ring focus:border-purple-500'
								type='text'
								placeholder='Search for manga...'
								value={query}
								onChange={(e) => handleMangaSearch(e)}
							/>
							{/* Container for manga content with fixed height and scrolling */}
							<div className='max-h-[1100px] pr-4 overflow-y-auto'>
								{/* Display search results or fetchedAllMangga */}
								{query.trim() === "" ? (
									<div className='grid grid-cols-6 gap-4'>
										{fetchedAllManga
											.filter((manga) =>
												formData.mangaAppearences.includes(manga._id)
											)
											.map((result) => (
												<div
													key={result._id}
													className={`bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center w-[150px] hover:bg-blue-500 ${
														formData.mangaAppearences.includes(result._id)
															? "bg-green-500"
															: ""
													}`}
													onClick={() => testManga(result)}
												>
													<img
														src={result.customImageURL}
														alt={result.title}
														className='object-cover rounded-md w-24 h-32 mb-2'
													/>
													<span className='text-white text-center'>
														{result.title}
													</span>
												</div>
											))}
										{/* Display remaining manga appearances */}
										{fetchedAllManga
											.filter(
												(manga) =>
													!formData.mangaAppearences.includes(manga._id)
											)
											.map((result) => (
												<div
													key={result._id}
													className={`bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center w-[150px] hover:bg-blue-500 ${
														formData.mangaAppearences.includes(result._id)
															? "bg-green-500"
															: ""
													}`}
													onClick={() => testManga(result)}
												>
													<img
														className='object-cover rounded-md w-24 h-32 mb-2'
														src={result.customImageURL}
														alt={result.title}
													/>
													<span className='text-white text-center'>
														{result.title}
													</span>
												</div>
											))}
									</div>
								) : (
									<div className='grid grid-cols-6 gap-4'>
										{searchResults.map((result) => (
											<div
												key={result._id}
												className={`bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center w-[150px] hover:bg-blue-500 ${
													formData.mangaAppearences.includes(result._id)
														? "bg-green-500"
														: ""
												}`}
												onClick={() => testManga(result)}
											>
												<img
													src={result.customImageURL}
													alt={result.title}
													className='object-cover rounded-md w-24 h-32 mb-2'
												/>
												<span className='text-white text-center'>
													{result.title}
												</span>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
						{/* Close button */}
						<button
							onClick={() => setShowMangaAddPanel(false)}
							className='bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md mt-4 ml-auto'
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default AddCharacter;
