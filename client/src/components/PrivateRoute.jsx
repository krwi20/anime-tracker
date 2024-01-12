import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

function PrivateRoute({ role }) {
	// Get the current user info from the redux state
	const { currentUser } = useSelector((state) => state.user);

	// If there is not a current user, they should be redirected to the login page
	if (!currentUser) {
		return <Navigate to='/login' />;
	}

	// If there is a current user but their role doesn't match the requirements, redirect to an unauthorised page
	if (role && currentUser.role !== role) {
		return <Navigate to='/not-authorized' />;
	}

	// If the user is logged in and has the required role then render the child components
	return <Outlet />;
}

export default PrivateRoute;
