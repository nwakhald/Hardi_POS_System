import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import Table from "../components/projects/ProjectTable";
export default function UpcomingWorks() {
  const navigate = useNavigate();
  const projects = [
   
  ];
const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "owner", label: "Owner" },
    { key: "location", label: "Location" },
    { key: "phone", label: "Phone" },
    { key: "start", label: "Start Date" },
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
            <Button variant="success">Start</Button>
          </>
        )}
      />
    </div>
  );
}