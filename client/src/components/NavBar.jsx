import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const NavBar = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="px-8 py-2 flex justify-between bg-[#171717] text-white items-center h-16">
      <Link to="/">
        <h1 className="text-3xl">KioTrack</h1>
      </Link>
      <div className="flex gap-8 text-xl">
        {!currentUser && (
          <Link className="hover:text-[#da0037]" to="/register">
            <p>Register</p>
          </Link>
        )}

        {currentUser ? (
          <Link
            className="hover:text-[#da0037]"
            to={`/profile/${currentUser.username}`}
          >
            <div className="flex gap-4">
              <img
                src={currentUser.profilePicture}
                alt="profile_picture"
                className="h7 w-7 object-cover"
              />
              <p>{currentUser.username}</p>
            </div>
          </Link>
        ) : (
          <Link className="hover:text-[#da0037]" to="/login">
            <p>Sign In</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavBar;
