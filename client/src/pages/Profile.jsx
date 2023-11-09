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
	}, [dispatch, username]);

	return (
		<div className='bg-[#171717] border-t-white border-t-2 min-h-[calc(100vh-64px)] '>
			{loading && <p className='text-[#ededed]'>Loading...</p>}
			{fetchedUser && (
				<div>
					<h1 className='text-[#ededed]'>{fetchedUser.username}'s Profile</h1>
					{currentUser && currentUser.username === fetchedUser.username && (
						<p className='text-[#ededed]'>This is your own profile</p>
					)}
					{currentUser.role === "admin" && <p>admin</p>}
				</div>
			)}
		</div>
	);
};

export default Profile;
