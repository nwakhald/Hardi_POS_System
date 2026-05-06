import React from 'react';
import Button from "../ui/Button";
import "../../styles/header.css";

async function handleLogout() {
  const token = localStorage.getItem("token");

  await fetch("http://127.0.0.1:8000/api/logout", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/json",
    },
  });

  localStorage.removeItem("token");

  window.location.href = "/login";
}
export default function Header() {
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