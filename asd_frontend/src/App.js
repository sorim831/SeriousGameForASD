import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./temp/Login";
import Home from "./temp/Home";
import Register from "./temp/Register";
import Access from "./temp/Access";
import GetStudents from "./temp/GetStudents";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/access" element={<Access />} />
        <Route path="/list" element={<GetStudents />} />
      </Routes>
    </Router>
  );
}

export default App;
