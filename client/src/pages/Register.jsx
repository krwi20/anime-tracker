import React, { useState } from "react";

const Register = () => {
	return (
		<div className='bg-[#171717] border-t-white border-t-2 min-h-[calc(100vh-64px)] text-white flex justify-center items-center'>
			<div className='bg-[#202020] rounded-lg'>
				<div className='m-20'>
					<form className='flex flex-col gap-4'>
						<input
							type='text'
							placeholder='Username'
							id='username'
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
						/>
						<input
							type='email'
							placeholder='Email'
							id='email'
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
						/>
						<input
							type='password'
							placeholder='Password'
							id='password'
							className='bg-[#202020] outline-none rounded-lg border-2 border-[#444444] h-8 focus:border-[#da0037] text-[#ededed] px-3'
						/>
						<button className='bg-[#202020] border-2 border-[#da0037] rounded-lg text-[#ededed] h-8 cursor-pointer hover:bg-[#da0037]'>
							Sign Up
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Register;
