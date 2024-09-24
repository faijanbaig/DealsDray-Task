import CreateEmployee from "./pages/CreateEmployee"
import Dashboard from "./pages/Dashboard"
import EditEmployee from "./pages/EditEmployee"
import EmployeeList from "./pages/EmployeeList"
import Login from "./pages/Login"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
const App = () => {
  return (
    <div className="text-xxl">
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      {/* <Route path="/home" element={<Navbar />} /> */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/Create-employee" element={<CreateEmployee />} />
      <Route path="/employee-list" element={<EmployeeList />} />
      <Route path="/edit-employee/:id" element={<EditEmployee />} />
    </Routes>
  </Router>
    </div>
    
  )
}

export default App