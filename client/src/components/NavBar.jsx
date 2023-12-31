import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiSettings } from "react-icons/fi";

const NavBar = () => {
	const { currentUser } = useSelector((state) => state.user);
	const navigate = useNavigate();

	return (
		// NavBar Container
		<div>
			{/* Content */}
			<div className='px-8 py-2 bg-[#171717] text-white'>
				{/* Link Container */}
				<div className='flex justify-between items-center'>
					<Link to='/'>
						<h1 className='text-3xl'>KioTrack</h1>
					</Link>
					<div className='flex gap-8 text-xl pt-2'>
						{!currentUser && (
							<Link
								className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'
								to='/register'
							>
								<p className='relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0'>
									Register
								</p>
							</Link>
						)}
						{/* test */}
						{currentUser?.role === "admin" && (
							<div>
								<button onClick={() => navigate("/add/anime")}>
									<span>Add Anime</span>
								</button>
							</div>
						)}
						{/* Signed In User */}
						{currentUser ? (
							<div className='flex items-center'>
								<div className='relative inline-flex items-center justify-center mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'>
									<Link
										className='flex items-center'
										to={`/profile/${currentUser.username}`}
									>
										<img
											src={currentUser.profilePicture}
											alt='profile_picture'
											className='h-10 w-10 object-cover'
										/>
										<p className='relative px-8'>{currentUser.username}</p>
									</Link>
								</div>
								<Link className='mb-2 ml-2' to={"/settings"}>
									<FiSettings />
								</Link>
							</div>
						) : (
							<Link
								className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white'
								to='/login'
							>
								<p className='relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#171717] rounded-md group-hover:bg-opacity-0'>
									Sign In
								</p>
							</Link>
						)}
					</div>
				</div>
			</div>
			{/* Border */}
			<div className='bg-gradient-to-br from-purple-500 to-pink-500 h-0.5 w-[100%] bottom-0'></div>
		</div>
	);
};

export default NavBar;
