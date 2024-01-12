import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddAnime = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		title: "",
		title_jp: "",
		description: "Description not currently created...",
		customImageURL:
			"https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
		type: "",
		source: "",
		episodes: 0,
		status: "",
		airing: false,
		airedFrom: "",
		airedUntil: "",
		duration: "",
		rating: "",
		background: "",
		season: "",
		year: 0,
		producers: [],
		broadcast: {},
		licensors: [],
		studios: [],
		genres: [],
	});

	const handleChange = (e) => {
		const { id, type, value, checked } = e.target;

		if (type === "checkbox") {
			setFormData((prevData) => ({
				...prevData,
				[id]: checked,
			}));
			return;
		}

		if (id === "producers") {
			const producersArray = value.split(",").map((item) => item.trim());
			setFormData((prevData) => ({
				...prevData,
				producers: producersArray,
			}));
			return;
		}

		if (id === "licensors") {
			const licensorsArray = value.split(",").map((item) => item.trim());
			setFormData((prevData) => ({
				...prevData,
				licensors: licensorsArray,
			}));
			return;
		}

		if (id === "studios") {
			const studiosArray = value.split(",").map((item) => item.trim());
			setFormData((prevData) => ({
				...prevData,
				studios: studiosArray,
			}));
			return;
		}

		if (id === "genres") {
			const genresArray = value.split(",").map((item) => item.trim());
			setFormData((prevData) => ({
				...prevData,
				genres: genresArray,
			}));
			return;
		}

		if (id === "broadcast") {
			const [day, time, timezone] = value.split(",");
			setFormData((prevData) => ({
				...prevData,
				broadcast: {
					day,
					time,
					timezone,
				},
			}));
			return;
		}

		setFormData((prevData) => ({
			...prevData,
			[id]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch(
				"http://localhost:3001/api/anime/anime/add",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				}
			);
			const data = await response.json();
			if (data.success === false) {
				console.log("err");
			}
			navigate("/");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='bg-gradient-to-br from-purple-800 to-pink-500 text-white min-h-[calc(100vh-64px)] p-4'>
			<div className='bg-gray-900 mx-auto rounded-lg p-6'>
				<form className='grid grid-cols-2 gap-6' onSubmit={handleSubmit}>
					<div className='col-span-1 space-y-4'>
						<label className='flex flex-col'>
							Title:
							<input
								type='text'
								id='title'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Japanese Title:
							<input
								type='text'
								id='title_jp'
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
							<input
								type='text'
								id='customImageURL'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Type:
							<input
								type='text'
								id='type'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Source:
							<input
								type='text'
								id='source'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Episodes:
							<input
								type='number'
								id='episodes'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Status:
							<input
								type='text'
								id='status'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Airing:
							<input
								type='checkbox'
								id='airing'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Aired From (Start Date):
							<input
								type='date'
								id='airedFrom'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Aired To (End Date):
							<input
								type='date'
								id='airedUntil'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
					</div>
					<div className='col-span-1 space-y-4'>
						<label className='flex flex-col'>
							Duration:
							<input
								type='text'
								id='duration'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Rating:
							<input
								type='text'
								id='rating'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Background:
							<input
								type='text'
								id='background'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Season:
							<input
								type='text'
								id='season'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Year:
							<input
								type='text'
								id='year'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Producers (Comma Seperated):
							<input
								type='text'
								id='producers'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Broadcast:
							<input
								type='text'
								id='broadcast'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Licensors (Comma Seperated):
							<input
								type='text'
								id='licensors'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Studios (Comma Seperated):
							<input
								type='text'
								id='studios'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Genres (Comma Seperateed):
							<input
								type='text'
								id='genres'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
					</div>
					<button
						type='submit'
						className='bg-gray-800 rounded-md flex-grow px-4 py-2 hover:bg-purple-600 col-span-2'
					>
						Submit
					</button>
				</form>
			</div>
		</div>
	);
};

export default AddAnime;
