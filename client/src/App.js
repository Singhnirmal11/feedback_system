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
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className={`app-container ${theme}`}>
      <div className="top-bar">
        <h1 className="main-heading">SSCSE Feedback System</h1>

        <button
          className="theme-toggle-btn"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? "🌙 Dark Mode" : "☀ Light Mode"}
        </button>
      </div>

      {!isLoggedIn ? (
        showLogin ? (
          <div className={`card ${theme}`}>
            <Login setIsLoggedIn={setIsLoggedIn} setShowLogin={setShowLogin} />
          </div>
        ) : (
          <div className={`card ${theme}`}>
            <Register setShowLogin={setShowLogin} />
          </div>
        )
      ) : (
        <div className={`card ${theme}`}>
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