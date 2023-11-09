import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
	const [formData, setFormData] = useState({});
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			setError(false);
			const res = await axios.post(
				"http://localhost:3001/api/auth/register",
				formData
			);
			const data = res.data;
			setLoading(false);
			if (data.success === false) {
				setError(true);
				return;
			}
			navigate("/login");
		} catch (error) {
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
