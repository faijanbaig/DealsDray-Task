import { useState, useEffect } from "react";
import axios from "axios";


const Employee = ({ isEdit, isCreate, employee, setEmployees, setCreate, setEdit }) => {
  const apiUrl = import.meta.env.VITE_BASE_URL;  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    course: [],
    avatar: null
  });

  useEffect(() => {
    if (isEdit && employee) {
      setFormData({ ...employee });
    }
  }, [isEdit, employee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenderChange = (e) => {
    setFormData({ ...formData, gender: e.target.value });
  };

  const handleCourseChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData((prevData) => ({
        ...prevData,
        course: [...prevData.course, value],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        course: prevData.course.filter((course) => course !== value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (isCreate) {
        // POST request to create a new employee
        const response = await axios.post(`${apiUrl}/employees`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });
        
        console.log("New employee created:", response);
        const newEmployee = response.data.data;
        setEmployees((prev) => [...prev, newEmployee]);
        alert("Employee created successfully.");
        
        setCreate(false);
      } else if (isEdit) {
        // PUT request to update an existing employee
        const response = await axios.patch(`${apiUrl}/employees/${employee._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });
  
        const updatedEmployee = response.data; // Adjust according to your response structure
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.uniqueId === updatedEmployee.uniqueId ? updatedEmployee : emp
          )
        );
        alert("Employee updated successfully.");
        
        setEdit(false);
      }
    } catch (error) {
      console.error("Error during employee submission:", error);
      alert("There was an error processing your request. Please try again.");
    }
  };
  
  
  return (
    <>
      {isEdit ? (
        <h1 className="text-2xl font-bold text-blue-600 text-center">Edit Employee</h1>
      ) : (
        <h1 className="text-2xl font-bold text-green-600 text-center">Create Employee</h1>
      )}
      <form className="flex flex-col max-w-md mx-auto p-4" onSubmit={handleSubmit}>
        <label htmlFor="name" className="mb-2 font-semibold">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="border border-gray-300 p-2 rounded mb-4"
          placeholder="Enter name"
          required
        />

        <label htmlFor="email" className="mb-2 font-semibold">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="border border-gray-300 p-2 rounded mb-4"
          placeholder="Enter email"
          required
        />

        <label htmlFor="mobile" className="mb-2 font-semibold">Mobile No</label>
        <input
          type="tel"
          id="mobile"
          name="mobile"
          value={formData.mobile}
          onChange={handleInputChange}
          className="border border-gray-300 p-2 rounded mb-4"
          placeholder="Enter mobile number"
          required
        />

        <label htmlFor="designation" className="mb-2 font-semibold">Designation</label>
        <select
          id="designation"
          name="designation"
          value={formData.designation}
          onChange={handleInputChange}
          className="border border-gray-300 p-2 rounded mb-4"
          required
        >
          <option value="" disabled>Select designation</option>
          <option value="HR">HR</option>
          <option value="Manager">Manager</option>
          <option value="Sales">Sales</option>
        </select>

        {/* Gender Selection (Radio Buttons) */}
        <div className="mb-4">
          <p className="font-semibold mb-2">Gender</p>
          <label className="mr-4">
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={formData.gender === "Male"}
              onChange={handleGenderChange}
              className="mr-2"
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={formData.gender === "Female"}
              onChange={handleGenderChange}
              className="mr-2"
            />
            Female
          </label>
        </div>

        <label className="mb-2 font-semibold">Course</label>
        <div className="mb-4 flex flex-row gap-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              value="MCA"
              checked={formData.course.includes("MCA")}
              onChange={handleCourseChange}
              className="mr-2"
            />
            MCA
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              value="BCA"
              checked={formData.course.includes("BCA")}
              onChange={handleCourseChange}
              className="mr-2"
            />
            BCA
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              value="BSC"
              checked={formData.course.includes("BSC")}
              onChange={handleCourseChange}
              className="mr-2"
            />
            BSC
          </label>
        </div>

        <div className="flex items-center justify-between mb-4">
          <label htmlFor="image" className="font-semibold">Image</label>
          <input
            type="file"
            name="image"
            id="image"
            accept=".jpg, .png"
            onChange={(e) => setFormData({ ...formData, avatar: e.target.files[0] })}
            className="mb-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200 mt-2"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default Employee;
