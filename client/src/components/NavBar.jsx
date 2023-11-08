import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
	return (
		<div className='px-8 py-2 flex justify-between bg-black text-white items-center '>
			<Link to='/'>
				<h1 className='text-3xl'>KioTrack</h1>
			</Link>
			<div className='flex gap-8 text-xl'>
				<Link className='hover:text-red-500' to='/register'>
					Register
				</Link>
				<Link className='hover:text-red-500' to='/login'>
					Login
				</Link>
			</div>
		</div>
	);
};

export default NavBar;
