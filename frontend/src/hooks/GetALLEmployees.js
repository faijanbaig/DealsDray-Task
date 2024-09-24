import { useState, useEffect } from "react";
import axios from "axios";

const GetALLEmployees = (url) => {
  const [employees, setEmployees] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url, { withCredentials: true });
        setEmployees(response.data.data);
        console.log(response);
        // setLoading(false);
      } catch (error) {
        // setError(error);
        // setLoading(false);
        console.log(error)
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      // Reset students state when unmounting
      setEmployees([]);
    };
  }, [url,setEmployees]); // Re-run effect when URL changes

  return { employees ,setEmployees };
};

export default GetALLEmployees;
