import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();

  const { form, handleChange } = useForm({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

const handleLogin = async (e) => {
  e.preventDefault();

     const newErrors = {};

  if (!form.email) {
    newErrors.email = "Email is required";
  } else if (!form.email.includes("@")) {
    newErrors.email = "Invalid email format";
  }

  if (!form.password) {
    newErrors.password = "Password is required";
  } else if (form.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  } else if (form.password.length > 24) {
    newErrors.password = "Password must be less than 24 characters";
  }

  setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

     const res = await fetch("http://127.0.0.1:8000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(form),
  });
  const data = await res.json();

  if (!res.ok) {
    setErrors({
      general: data.message || "Login failed",
    });
    return;
  }

  localStorage.setItem("token", data.access_token);

  navigate("/dashboard");
};

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login</h2>
     {errors.general && <p className="error-text">{errors.general}</p>}

        <form onSubmit={handleLogin}>
          <div className="login-field">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="login-field">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button className="login-button" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}