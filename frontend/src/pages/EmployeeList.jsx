import { useState, useEffect } from "react";
import Employee from "../components/Employee";
import axios from "axios";
import Navbar from "../components/navbar";

const EmployeeList = () => {
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(6);
  const [isEdit, setEdit] = useState(false);
  const [isCreate, setCreate] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);

  // const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_BASE_URL;
  // const { employees, setEmployees } = GetALLEmployees(`${apiUrl}/employees`); // Fetch and set employees

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchEmployees = async () => {
    try {
        const response = await axios.get(`${apiUrl}/employees`, {
            withCredentials: true,
        });
        setEmployees(response.data.data);
        setCount(response.data.data.length); 
    } catch (error) {
        console.error("Error fetching employees:", error);
    }
};

useEffect(() => {
    fetchEmployees();
}, [fetchEmployees]);


  useEffect(() => {
    setCount(employees.length);
  }, [employees, setEmployees]);

  const handleCreateEmployee = () => {
    setCreate(true);
    setEdit(false);
    setSelectedEmployee(null);
  };

  const handleEditEmployee = (employeeId) => {
    setCreate(false);
    setEdit(true);
    const employeeToEdit = employees.find((emp) => emp._id === employeeId);
    setSelectedEmployee(employeeToEdit); // Pass employee to edit form
  };

  const handleDeleteEmployee = async (employeeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${apiUrl}/employees/${employeeId}`, {
        withCredentials: true,
      });

      const updatedEmployees = employees.filter(
        (emp) => emp._id !== employeeId
      );
      setEmployees(updatedEmployees);

      alert("Employee deleted successfully.");
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete the employee. Please try again.");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.mobile.toString().includes(searchTerm.toLowerCase()) ||
      employee.uniqueId.toString().includes(searchTerm.toLowerCase()) ||
      employee.gender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar />
      {isEdit || isCreate ? (
        <Employee
          isEdit={isEdit}
          isCreate={isCreate}
          employee={selectedEmployee}
          setEmployees={setEmployees}
          setCreate={setCreate}
          setEdit={setEdit}
        />
      ) : (
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold">Total Count: {count}</span>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleCreateEmployee}
            >
              Create Employee
            </button>
          </div>

          <div className="flex flex-row-reverse gap-1 mb-4">
            <input
              type="text"
              placeholder="Enter Search keyword"
              value={searchTerm}
              onChange={handleSearchChange}
              className="px-4 py-1 border border-black"
            />
            <button id="search" className="bg-green-500 p-2">
              Search
            </button>
          </div>

          {/* Employee List as Table */}
          <div className="flex justify-center ">
            <table className="min-w-full bg-white border border-gray-200 ">
              <thead>
                <tr className="bg-gray-200 text-gray-600">
                  <th className="py-2 px-4 border">Profile</th>
                  <th className="py-2 px-4 border">Unique Id</th>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Mobile No</th>
                  <th className="py-2 px-4 border">Designation</th>
                  <th className="py-2 px-4 border">Gender</th>
                  <th className="py-2 px-4 border">Course</th>
                  <th className="py-2 px-4 border">Create Date</th>
                  <th className="py-2 px-8 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees.map((employee) => (
                  <tr key={employee.uniqueId} className="hover:bg-gray-100">
                    <td className="py-3 px-4 border">
                      <img
                        className="w-16 h-16 rounded-full object-cover"
                        src={employee?.avatar}
                        alt=""
                      />
                    </td>
                    <td className="py-3 px-4 border">{employee.uniqueId}</td>
                    <td className="py-3 px-4 border">{employee.name}</td>
                    <td className="py-3 px-4 border">{employee.email}</td>
                    <td className="py-3 px-4 border">{employee.mobile}</td>
                    <td className="py-3 px-4 border">{employee.designation}</td>
                    <td className="py-3 px-4 border">{employee.gender}</td>
                    <td className="py-3 px-4 border">
                      {employee.course.map((c, index) => (
                        <div key={index}>{c}</div>
                      ))}
                    </td>
                    <td className="py-3 px-4 border">
                      {employee.createdAt.substring(0, 10)}
                    </td>
                    <td className="py-8 px-8 border flex justify-between">
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        onClick={() => handleEditEmployee(employee._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
                        onClick={() => handleDeleteEmployee(employee._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-4">
            {Array.from(
              {
                length: Math.ceil(filteredEmployees.length / employeesPerPage),
              },
              (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className="mx-1 bg-gray-200 p-2 rounded"
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeList;
