import Button from "../components/ui/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../components/projects/ProjectTable";
export default function UpcomingWorks() {
  const handleStart = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://127.0.0.1:8000/api/projects/${id}/start`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  });

  if (!res.ok) {
    console.log("Start failed");
    return;
  }

  setProjects(projects.filter((project) => project.id !== id));
};
  const [projects, setProjects] = useState([]);
  useEffect(() => {
  const fetchProjects = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8000/api/projects", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    });

    const data = await res.json();

    const upcoming = data.filter((project) => project.status === "upcoming");

    setProjects(upcoming);
  };

  fetchProjects();
}, []);
  const navigate = useNavigate();
  
const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "owner", label: "Owner" },
    { key: "location", label: "Location" },
    { key: "phone", label: "Phone" },
    { key: "start_date", label: "Start Date" },
    { key: "cost", label: "Cost" },
    { key: "notes", label: "Notes" },
  ];

  return (
    <div>
      <div className="table-header">
        <h2>Upcoming Works</h2>

        <Button variant="primary" onClick={() => navigate("/projects/add")}>
          + Add Project
        </Button>
      </div>

      <Table
        columns={columns}
        data={projects}
        renderActions={(project) => (
          <>
            <Button
              variant="warning"
              onClick={() => navigate(`/projects/edit/${project.id}`)}
            >
              Edit
            </Button>

            <Button variant="danger">Delete</Button>
            <Button variant="success" onClick={()=>handleStart(project.id)}>Start</Button>
          </>
        )}
      />
    </div>
  );
}