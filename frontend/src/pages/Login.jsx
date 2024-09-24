import { useState } from "react";
import axios from "axios";
import {useNavigate } from "react-router-dom"; 

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    // setError("");
    try {
      const response = await axios.post(
        `${apiUrl}/admin`,
        {
          username,
          password,
        },
        { withCredentials: true }
      );
      console.log("Response:", response);
      localStorage.setItem("user", JSON.stringify(response.data.data.loggedInUser));
      
      navigate("/dashboard")
    } catch (error) {
      // setError("Login failed. Please check your credentials."); // Set error message
      console.error("Login failed", error);
    } finally {
      setLoading(false); // Reset loading to false after request is complete
    }
    
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 flex-col">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm h-80 flex flex-col gap-3 "
      >
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Username:
        </label>
        <input
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password:
        </label>
        <input
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          type="text"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required>
          </input>
        <button type="submit" id="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 mt-5" disabled={loading}>
        {loading ? (
                <>
                  <span>Submitting..</span>
                </>
              ) : (
                "Login"
              )}
        </button>
      </form>
    </div>
  );
};

export default Login;
