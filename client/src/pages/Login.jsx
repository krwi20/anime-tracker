import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
	signInStart,
	signInSuccess,
	signInFailure,
} from "../redux/user/userSlice";

const Login = () => {
	// State to manage the form data
	const [formData, setFormData] = useState({});
	// Redux state - gets user information
	const { loading, error } = useSelector((state) => state.user);
	// React router hook for navigation
	const navigate = useNavigate();
	// Redux dispatch hook
	const dispatch = useDispatch();

	// Function to set the formData to the user's input
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	// Function to handle the form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			// Redux store - dispatch action to start sign in
			dispatch(signInStart());
			// Backend fetch to log the user in
			const response = await fetch("http://localhost:3001/api/auth/login", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			// Parse the response data
			const data = await response.json();
			// If the request is unsuccessful dispatch the failure with the data
			if (data.success === false) {
				dispatch(signInFailure(data));
				return;
			}
			// If the request is successful dispatch the success with the data, redirect to homepage
			dispatch(signInSuccess(data));
			navigate("/");
		} catch (error) {
			// If the request has en error dispatch the failure with the error
			dispatch(signInFailure(error));
		}
	};

	return (
		<div className='bg-[#171717] border-t-white border-t-2 min-h-[calc(100vh-64px)] text-white flex justify-center items-center'>
			<div className='bg-[#202020] rounded-lg'>
				<div className='m-20'>
					<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
						<input
							type='email'
							placeholder='Email'
							id='email'
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							onChange={handleChange}
						/>
						<input
							type='password'
							placeholder='Password'
							id='password'
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
							onChange={handleChange}
						/>
						<button className='bg-[#202020] border-2 border-[#da0037] rounded-lg text-[#ededed] h-8 cursor-pointer hover:bg-[#da0037]'>
							{loading ? "Loading..." : "Login"}
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

export default Login;
