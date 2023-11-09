import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
	signInStart,
	signInSuccess,
	signInFailure,
} from "../redux/user/userSlice";

const Login = () => {
	const [formData, setFormData] = useState({});
	const { loading, error } = useSelector((state) => state.user);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			dispatch(signInStart());
			const res = await fetch("http://localhost:3001/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(signInFailure(data));
				return;
			}
			dispatch(signInSuccess(data));
			navigate("/");
		} catch (error) {
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
