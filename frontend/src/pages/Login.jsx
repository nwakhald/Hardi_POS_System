import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import "../styles/login.css";
import useAuth from "../hooks/useAuth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateLoginForm = ({ email, password }) => {
  const validationErrors = {};

  if (!email) {
    validationErrors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(email)) {
    validationErrors.email = "Please enter a valid email address.";
  }

  if (!password) {
    validationErrors.password = "Password is required.";
  } else if (password.length < 6) {
    validationErrors.password = "Password must be at least 6 characters.";
  } else if (password.length > 24) {
    validationErrors.password = "Password must be less than 24 characters.";
  }

  return validationErrors;
};

export default function Login() {
  const navigate = useNavigate();
  const { login: loginUser } = useAuth();
  const { form, handleChange } = useForm({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const focusFirstError = (fieldErrors) => {
    if (fieldErrors.email) {
      emailRef.current?.focus();
    } else if (fieldErrors.password) {
      passwordRef.current?.focus();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      focusFirstError(validationErrors);
      return;
    }

    setLoading(true);

    try {
      await loginUser(form.email, form.password);
      navigate("/dashboard");
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.message ||
          "Unable to log in. Please check your credentials and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login</h2>
        <div aria-live="polite" aria-atomic="true">
          {errors.general && <p className="error-text">{errors.general}</p>}
        </div>

        <form onSubmit={handleLogin} noValidate>
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              ref={emailRef}
              autoComplete="email"
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && (
              <span id="email-error" className="error-text">
                {errors.email}
              </span>
            )}
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              ref={passwordRef}
              autoComplete="current-password"
              aria-describedby={errors.password ? "password-error" : undefined}
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && (
              <span id="password-error" className="error-text">
                {errors.password}
              </span>
            )}
          </div>

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
