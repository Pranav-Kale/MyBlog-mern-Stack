import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

function Header() {

  const {userInfo,setUserInfo} = useContext(UserContext);
  const username = userInfo?.username;

  useEffect(() => {
    try {
      fetch("http://localhost:4000/profile", {
        credentials: "include",
      }).then((response) => {
        response.json().then((userInfo) => {
          setUserInfo(userInfo);
        });
      });
    } catch (error) {
      console.error(error);
    }
  }, []);
  
  const handleLogout = async () => {
    await fetch("http://localhost:4000/logout", 
    {
      credentials: "include",
      method : "POST"
    });
    setUserInfo(null);
  }

  return (
    <div className="flex w-full h-16 sm:h-20 items-center justify-between px-[5%] sm:px-[10.5%] border-b-2 border-gray-600 mb-5">
      <Link to="/" className="text-black font-bold text-2xl sm:text-3xl">
        MyBlog
      </Link>
      <nav className="flex gap-4 items-center font-semibold text-lg">
        {username && (
          <>
            <Link to="/create">Create new post</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
        {!username && (
          <div className="flex gap-4 justify-center items-center text-base">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Header;
