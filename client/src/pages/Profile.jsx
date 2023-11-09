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
	const { currentUser, loading } = useSelector((state) => state.user);

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
		<div>
			{loading && <p>Loading...</p>}
			{currentUser && (
				<div>
					<h1>{currentUser.username}'s Profile</h1>
					{/* Render other user data here */}
				</div>
			)}
		</div>
	);
};

export default Profile;
