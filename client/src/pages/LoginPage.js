import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

function LoginPage() {
  const { setUserInfo } = useContext(UserContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        response.json().then((userInfo) => {
          setUserInfo(userInfo);
          setLoggedIn(true);
          setRedirect(true);
        });
      } else {
        alert("Invalid Credentials !!!");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }
    setIsLoading(false);
  };
  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="px-[10.5%] flex justify-center">
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 w-full md:w-[600px] text-center"
      >
        <p className="text-4xl font-bold text-gray-700 mb-5">Login</p>
        <div className="flex flex-col">
          <input
            type="text"
            value={username}
            placeholder="Enter the username"
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="new-password"
            className="border-2 border-gray-400 py-2 px-4 rounded-md outline-none"
          />
        </div>
        <div className="flex flex-col">
          <input
            type="password"
            value={password}
            placeholder="Enter the password"
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            className="border-2 border-gray-400 py-2 px-4 rounded-md outline-none"
          />
        </div>
        <button
          type="submit"
          className="btn"
        >
          {isLoading ? "Logging in" : loggedIn ? "Logged In" : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
