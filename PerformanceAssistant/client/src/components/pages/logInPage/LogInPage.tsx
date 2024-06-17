import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CCTech from "../../images/CCTech.png";
 
const LoginPage = ({ closeLogin }) => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
 
  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email, Password }),
      });
 
      const data = await response.json();
 
      if (data) {
        navigate("/homepage");
        closeLogin();
      } else {
        setError("Incorrect Email or Password");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };
 
  return (
    <div className="flex flex-col justify-center items-center bg-white p-8 rounded-lg">
      <button onClick={closeLogin} className="self-end px-4 py-2 text-lg">
        X
      </button>
      <img
        src={CCTech}
        alt="CCTech Logo"
        className="mb-8"
        style={{ width: "150px", height: "auto" }}
      />
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        className="w-64 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 mb-4"
        value={Email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-64 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 mb-4"
        value={Password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="w-64 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
};
 
export default LoginPage;