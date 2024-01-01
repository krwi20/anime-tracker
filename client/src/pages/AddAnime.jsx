import React, { useState } from "react";

const AddAnime = () => {
	// Anime data from the form
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

	// Form input handling
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

	// Form submission handling
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
			console.log(response);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='bg-[#171717] min-h-[calc(100vh-64px)] p-2 text-white'>
			<div className='bg-[#202020] rounded-lg'>
				<form className='flex flex-col' onSubmit={handleSubmit}>
					{/* Title Section */}
					<label className='flex flex-col'>
						Title:{" "}
						<input
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							type='text'
							placeholder='Title'
							id='title'
							onChange={handleChange}
						/>
					</label>
					{/* Japanese Title Section */}
					<label className='flex flex-col'>
						Japanese Title:{" "}
						<input
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							type='text'
							placeholder='Japanese Title'
							id='title_jp'
							onChange={handleChange}
						/>
					</label>
					{/* Description Section */}

					<label className='flex flex-col'>
						Description:{" "}
						<textarea
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							type='text'
							placeholder='Description'
							id='description'
							onChange={handleChange}
						/>
					</label>

					{/* Image Section */}
					<label className='flex flex-col'>
						Image:{" "}
						<input
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							type='text'
							placeholder='Image'
							id='customImageURL'
							onChange={handleChange}
						/>
					</label>
					{/* Type Section */}
					<label className='flex flex-col'>
						Type:{" "}
						<input
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							type='text'
							placeholder='Type'
							id='type'
							onChange={handleChange}
						/>
					</label>
					{/* Source Section */}
					<label className='flex flex-col'>
						Source:{" "}
						<input
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							type='text'
							placeholder='Source'
							id='source'
							onChange={handleChange}
						/>
					</label>
					{/* Episodes Section */}
					<label className='flex flex-col'>
						Episodes:{" "}
						<input
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							type='number'
							placeholder='Episodes'
							id='episodes'
							onChange={handleChange}
						/>
					</label>
					{/* Status Section */}
					<label className='flex flex-col'>
						Status:{" "}
						<input
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							type='text'
							placeholder='Status'
							id='status'
							onChange={handleChange}
						/>
					</label>
					{/* Airing Section */}
					<label className='flex flex-col'>
						Airing:{" "}
						<input
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							type='checkbox'
							id='airing'
							onChange={handleChange}
						/>
					</label>
					{/* Aired From Section */}
					<label className='flex flex-col'>
						Aired From (Start Date):{" "}
						<input
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							type='date'
							id='airedFrom'
							onChange={handleChange}
						/>
					</label>
					{/* Aired To Section */}
					<label className='flex flex-col'>
						Aired To (End Date):{" "}
						<input
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							type='date'
							id='airedUntil'
							onChange={handleChange}
						/>
					</label>
					{/* Duration Section */}
					<label className='flex flex-col'>
						Duration:{" "}
						<input
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							type='text'
							id='duration'
							placeholder='Duration'
							onChange={handleChange}
						/>
					</label>
					{/* Rating Section */}
					<label className='flex flex-col'>
						Rating:{" "}
						<input
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							type='text'
							id='rating'
							placeholder='Rating'
							onChange={handleChange}
						/>
					</label>
					{/* Background Section */}
					<label className='flex flex-col'>
						Background:{" "}
						<input
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							type='text'
							id='background'
							placeholder='Background'
							onChange={handleChange}
						/>
					</label>
					{/* Season Section */}
					<label className='flex flex-col'>
						Season:{" "}
						<input
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							type='text'
							id='season'
							placeholder='Season'
							onChange={handleChange}
						/>
					</label>
					{/* Year Section */}
					<label className='flex flex-col'>
						Year:{" "}
						<input
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							type='text'
							id='year'
							placeholder='Year'
							onChange={handleChange}
						/>
					</label>
					{/* Producers Section */}
					<label className='flex flex-col'>
						Producers (comma-separated):{" "}
						<input
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							type='text'
							id='producers'
							placeholder='Producers'
							onChange={handleChange}
						/>
					</label>
					{/* Broadcast Section */}
					<label className='flex flex-col'>
						Broadcast:{" "}
						<input
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							type='text'
							id='broadcast'
							placeholder='Broadcast'
							onChange={handleChange}
						/>
					</label>
					{/* Licensors Section */}
					<label className='flex flex-col'>
						Licensors:{" "}
						<input
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							type='text'
							id='licensors'
							placeholder='Licensors'
							onChange={handleChange}
						/>
					</label>
					{/* Studios Section */}
					<label className='flex flex-col'>
						Studios:{" "}
						<input
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							type='text'
							id='studios'
							placeholder='Studios'
							onChange={handleChange}
						/>
					</label>
					{/* Genres Section */}
					<label className='flex flex-col'>
						Genres:{" "}
						<input
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							type='text'
							id='genres'
							placeholder='Genres'
							onChange={handleChange}
						/>
					</label>
					<button type='submit'>Submit</button>
				</form>{" "}
			</div>
		</div>
	);
};

export default AddAnime;
