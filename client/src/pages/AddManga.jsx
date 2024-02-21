import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { persistor } from "../redux/store";
import { signOut } from "../redux/user/userSlice";

const AddManga = () => {
	// React router hook for navigation
	const navigate = useNavigate();
	// Redux dispatch hook
	const dispatch = useDispatch();
	//  State to manage the data from the form
	const [formData, setFormData] = useState({
		title: "",
		title_jp: "",
		description: "Description not currently created...",
		customImageURL:
			"https://wrki20-anime-track.s3.eu-central-1.amazonaws.com/NoImage.png",
		type: "",
		chapters: 0,
		volumes: 0,
		status: "",
		publishing: false,
		publishedFrom: "",
		publishedUntil: "",
		background: "",
		authors: [],
		demographic: [],
		serialization: [],
		genres: [],
	});
	// State to store the image file
	const [imageFile, setImageFile] = useState(null);
	// State to store the uploaded image temporarily to show the user the new image
	const [temporaryImageURL, setTemporaryImageURL] = useState(null);

	// Function to handle the input changes in the form
	const handleChange = (e) => {
		const { id, type, value, checked } = e.target;

		// Handles checkbox input
		if (type === "checkbox") {
			setFormData((prevData) => ({
				...prevData,
				[id]: checked,
			}));
			return;
		}

		// Handles the inputs for ids which are arrays or objects
		if (id === "authors") {
			const authorsArray = value.split(",").map((item) => item.trim());
			setFormData((prevData) => ({
				...prevData,
				authors: authorsArray,
			}));
			return;
		}

		if (id === "demographic") {
			const demographicArray = value.split(",").map((item) => item.trim());
			setFormData((prevData) => ({
				...prevData,
				demographic: demographicArray,
			}));
			return;
		}

		if (id === "serialization") {
			const serializationArray = value.split(",").map((item) => item.trim());
			setFormData((prevData) => ({
				...prevData,
				serialization: serializationArray,
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
				if (key === "broadcast") {
					const { day, time, timezone } = value;
					formDataWithImage.append("broadcast[day]", day);
					formDataWithImage.append("broadcast[time]", time);
					formDataWithImage.append("broadcast[timezone]", timezone);
				} else if (Array.isArray(value)) {
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
			// Backend fetch to add the manga to the database
			const response = await fetch(
				"http://localhost:3001/api/manga/manga/add",
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

	return (
		<div className='bg-gradient-to-br from-gray-800 to-gray-700 text-white min-h-[calc(100vh-64px)] p-4'>
			<div className='bg-gray-900 mx-auto rounded-lg p-6'>
				<form className='grid grid-cols-2 gap-6' onSubmit={handleSubmit}>
					{/* Form inputs for the details of the manga */}
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
							Type:
							<input
								type='text'
								id='type'
								accept='image/jpeg, image/png'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Chapters:
							<input
								type='number'
								id='chapters'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Volumes:
							<input
								type='number'
								id='volumes'
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
							Publishing:
							<input
								type='checkbox'
								id='publishing'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Published From (Start Date):
							<input
								type='date'
								id='publishedFrom'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Published To (End Date):
							<input
								type='date'
								id='publishedUntil'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
					</div>
					<div className='col-span-1 space-y-4'>
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
							Authors (Comma Seperated):
							<input
								type='text'
								id='authors'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Demographic:
							<input
								type='text'
								id='demographic'
								className='rounded-md bg-gray-800 p-2'
								onChange={handleChange}
							/>
						</label>
						<label className='flex flex-col'>
							Serialization (Comma Seperated):
							<input
								type='text'
								id='serialization'
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
					{/* Form Submission Button */}
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

export default AddManga;
