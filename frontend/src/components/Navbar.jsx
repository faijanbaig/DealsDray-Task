import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BASE_URL;

  // useEffect(()=>{
  //   const data = JSON.parse(localStorage.getItem("user"));
  //   setUsername(data);
  // },[username]);

  const handleLogOut= async()=> {
    try {
      await axios.get(`${apiUrl}/admin`,{
        withCredentials: true,
      })
  
      window.localStorage.clear();
        navigate("/");
    } catch (error) {
      console.error("Logout Failed ",error)
    }
  }

  

  return (
    <nav className="bg-blue-600 p-4 sticky top-0">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Brand Name */}
        <div className="text-white text-2xl font-bold">
          <a href="/dashboard">EMS</a>
        </div>

        {/* Nav Links */}
        <div className="flex space-x-12 ">
          <a
            href="/dashboard"
            className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium"
          >
            Home
          </a>
          <a
            href="/employee-list"
            className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium"
          >
            Employee List
          </a>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center space-x-4">
          {/* Username */}
          <span className="text-white text-sm">{username.name}</span>

          {/* Logout Button */}
          <button
            className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600"
            onClick={handleLogOut}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar