import React, { useEffect, useState } from "react";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setRegistered(true);
        alert("Registration Successful !")
      } else {
        setRegistered(false);
        alert("Registration Failed !")
      }
    } catch (error) {
      alert(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
  }, [registered])
  

  return (
    <div className="px-[10.5%] flex justify-center">
      <form
        onSubmit={handleRegister}
        className="flex flex-col gap-4 w-full md:w-[600px] text-center"
      >
        <p className="text-4xl font-bold text-gray-700 mb-5">Register</p>
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
          {isLoading ? "Registering" : (registered ? "Registered" : "Register")}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
