import { useState } from "react";
import { toast } from "react-toastify";


const API_URL = process.env.REACT_APP_API_URL || "https://feedback-system-wheat.vercel.app";

function Login({ setIsLoggedIn, setShowLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      if (response.ok) {
        toast.success("Login successful");
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        setIsLoggedIn(true);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      <p>
        Don't have an account?{" "}
        <button onClick={() => setShowLogin(false)}>Register</button>
      </p>
    </div>
  );
}

export default Login;