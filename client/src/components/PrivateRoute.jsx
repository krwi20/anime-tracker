import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

function PrivateRoute({ role }) {
	const { currentUser } = useSelector((state) => state.user);
	console.log(currentUser);

	if (!currentUser) {
		return <Navigate to='/login' />;
	}

	if (role && currentUser.role !== role) {
		return <Navigate to='/not-authorized' />;
	}

	return <Outlet />;
}

export default PrivateRoute;
