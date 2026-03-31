import { useEffect, useState } from "react";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import FacultyList from "./components/FacultyList";
import AdminDashboard from "./components/AdminDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="app-container">
      <h1 className="main-heading">University Faculty Feedback System</h1>

      {!isLoggedIn ? (
        showLogin ? (
          <div className="card">
            <Login setIsLoggedIn={setIsLoggedIn} setShowLogin={setShowLogin} />
          </div>
        ) : (
          <div className="card">
            <Register setShowLogin={setShowLogin} />
          </div>
        )
      ) : (
        <div className="card">
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              setIsLoggedIn(false);
            }}
          >
            Logout
          </button>

          {localStorage.getItem("role") === "admin" ? (
            <AdminDashboard />
          ) : (
            <FacultyList />
          )}
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default App;