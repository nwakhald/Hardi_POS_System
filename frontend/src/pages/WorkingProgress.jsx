import { useNavigate } from "react-router-dom";
import { useState , useEffect } from "react";
import Table from "../components/projects/ProjectTable";
import Button from "../components/ui/Button";

export default function WorkingProgress() {
   const navigate = useNavigate();

  const [workingProjects, setWorkingProjects] = useState([
  
  ]);
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

    const workingProjects = data.filter(
      (project) => 
    project.status === "paused" ||
    project.status === "in_progress"
    );

    setWorkingProjects(workingProjects);
  };

  fetchProjects();
}, []);
 
  const handleToggleStatus = async (id, status) => {
  const token = localStorage.getItem("token");

  const endpoint =
    status === "paused" ? "resume" : "pause";

  const res = await fetch(
    `http://127.0.0.1:8000/api/projects/${id}/${endpoint}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );

  if (!res.ok) {
    return;
  }

  setWorkingProjects((prev) =>
    prev.map((project) =>
      project.id === id
        ? {
            ...project,
            status: status === "paused" ? "in_progress" : "paused",
            lastActionTime: new Date().toLocaleString(),
          }
        : project
    )
  );
};

  const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "House" },
    { key: "owner", label: "Owner" },
    { key: "phone", label: "Phone" },
    { key: "startDate", label: "Start Date" },
    { key: "deadline", label: "Deadline" },
    { key: "progress", label: "Progress" },
    {
      key: "status",
      label: "Status",
      render: (project) =>
        project.status === "in_progress"
          ? "In Progress"
          : project.status === "paused"
          ? "Paused"
          : project.status,
    },
    { key: "currentWorkers", label: "Current Workers" },
    { key: "paid", label: "Paid" },
    { key: "unpaid", label: "Unpaid" },
    { key: "lastActionTime", label: "Last Action Time" },
  ];

  return (
    <div>
      <div className="table-header">
        <h2>Working Progress</h2>
      </div>

      <Table
        columns={columns}
        data={workingProjects}
        renderActions={(project) => (
          <>
            <Button
              variant="secondary"
              onClick={() => navigate(`/projects/in-progress/${project.id}`)}
            >
              Open
            </Button>

            <Button
              variant={project.status === "paused" ? "success" : "primary"}
              onClick={() => handleToggleStatus(project.id, project.status)}
            >
              {project.status === "paused" ? "Resume" : "Pause"}
            </Button>
          </>
        )}
      />
    </div>
  );
}