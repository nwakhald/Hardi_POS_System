import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import Table from "../components/projects/ProjectTable";
export default function UpcomingWorks() {
  const navigate = useNavigate();
  const projects = [
    {
      id: 1,
      title: "House A",
      owner: "Nwa",
      location: "Abuja",
      phone: "077xxxxxxx",
      start: "2026-06-01",
      cost: 500,
      notes: "This is a note about House A.",
    },
    {
      id: 2,
      title: "House B",
      owner: "john",
      location: "sarchnar",
      phone: "078xxxxxxx",
      start: "2026-07-01",
      cost: 700,
      notes: "This is a note about House B. hjhuhgu hjk jhh ih ud rese ws",
    },
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