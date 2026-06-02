import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import useAuth from "../../hooks/useAuth";
import "../../styles/header.css";

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <header className="header">
      <div className="header-titles">
        <h1>Security Camera Dashboard</h1>
        <p>Manage projects, payments, workers, and profits</p>
      </div>
      <Button className="logout-button" onClick={handleLogout}>
        Logout
      </Button>
    </header>
  );
}