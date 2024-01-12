import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
	// State to manage the form data
	const [formData, setFormData] = useState({});
	// State to manage the error
	const [error, setError] = useState(false);
	// State to manage loading
	const [loading, setLoading] = useState(false);
	// React router hook for navigation
	const navigate = useNavigate();

	// Function to set the formData to the user's input
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	// Function to handle the form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			setError(false);
			// Backend fetch to register the user
			const response = await fetch("http://localhost:3001/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			// Parse the response data
			const data = response.data;
			// If the request is unsuccessful set the error to true
			if (data.success === false) {
				setError(true);
				return;
			}
			// if the request is successful set loading to false and redirect to login
			setLoading(false);
			navigate("/login");
		} catch (error) {
			// If the request has an error set loading to false and error to true
			setLoading(false);
			setError(true);
		}
	};

	return (
		<div className='bg-[#171717] border-t-white border-t-2 min-h-[calc(100vh-64px)] text-white flex justify-center items-center'>
			<div className='bg-[#202020] rounded-lg'>
				<div className='m-20'>
					<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
						<input
							type='text'
							placeholder='Username'
							id='username'
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							onChange={handleChange}
							required
						/>
						<input
							type='email'
							placeholder='Email'
							id='email'
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							onChange={handleChange}
							required
						/>
						<input
							type='password'
							placeholder='Password'
							id='password'
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							onChange={handleChange}
							required
						/>
						<button className='bg-[#202020] border-2 border-[#da0037] rounded-lg text-[#ededed] h-8 cursor-pointer hover:bg-[#da0037]'>
							{loading ? "Loading..." : "Sign Up"}
						</button>
					</form>
					<p className='text-red-700 mt-5'>
						{error ? error.message || "Something went wrong!" : ""}
					</p>
				</div>
			</div>
		</div>
	);
};

export default Register;
