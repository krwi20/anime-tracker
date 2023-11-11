import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
	getUserStart,
	getUserSuccess,
	getUserFailure,
} from "../redux/user/userSlice";

const Profile = () => {
	const { username } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { currentUser, fetchedUser, loading } = useSelector(
		(state) => state.user
	);

	useEffect(() => {
		const fetchUserData = async () => {
			console.log("Fetching user data for", username);
			dispatch(getUserStart());
			try {
				const res = await fetch(
					`http://localhost:3001/api/auth/test/${username}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
				const data = await res.json();
				console.log(data);
				dispatch(getUserSuccess(data));
				if (data.success === false) {
					dispatch(getUserFailure("User not found!"));
					navigate("/");
					return;
				}
			} catch (error) {
				dispatch(getUserFailure(error.message || "Something went wrong!"));
			}
		};

		fetchUserData();
	}, [dispatch, username, navigate]);

	return (
		<div className='bg-[#171717] p-2 min-h-[calc(100vh-64px)] '>
			{loading && <p className='text-[#ededed]'>Loading...</p>}
			{fetchedUser && (
				<div className='bg-[#202020] text-[#ededed] mx-6 mt-6 px-2 rounded-lg'>
					<div className='flex justify-between'>
						<h1>{fetchedUser.username}'s Profile</h1>
						{currentUser && currentUser.username === fetchedUser.username && (
							<button>Edit Profile</button>
						)}
					</div>
					<div className='flex'>
						{/* Left Side */}
						<div className='pr-2'>
							<img
								className='h-80 w-56'
								src={fetchedUser.profilePicture}
								alt='user_profile_image'
							/>
						</div>
						{/* Right Side */}
						<div className='flex flex-col border-l pl-2 h-screen'>
							<div className=' '>
								<p>No biography yet.</p>
							</div>
							<div>
								<h1>test</h1>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Profile;
