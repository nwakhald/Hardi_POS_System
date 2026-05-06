import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Table from "../components/projects/ProjectTable";
import Button from "../components/ui/Button";

export default function WorkingProgress() {
  const navigate = useNavigate();

  const [workingProjects, setWorkingProjects] = useState([
  
  ]);

  const getNow = () => new Date().toLocaleString();

  const handleToggleStatus = (id) => {
    setWorkingProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? {
              ...project,
              status: project.status === "Paused" ? "In Progress" : "Paused",
              lastActionTime: getNow(),
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
    { key: "status", label: "Status" },
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
              variant={project.status === "Paused" ? "success" : "primary"}
              onClick={() => handleToggleStatus(project.id)}
            >
              {project.status === "Paused" ? "Resume" : "Pause"}
            </Button>
          </>
        )}
      />
    </div>
  );
}