import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../components/projects/ProjectTable";
import Button from "../components/ui/Button";

export default function PaymentsDue() {
  const navigate = useNavigate();

  const [searchOwner, setSearchOwner] = useState("");
  const [appliedOwner, setAppliedOwner] = useState("");

  const allProjects = [
    {
      id: 1,
      title: "House A",
      owner: "Ahmed",
      phone: "077xxxxxxx",
      location: "Abuja",
      totalCost: 500,
      paid: 500,
      unpaid: 0,
      workStatus: "Completed",
      note: "Closed project",
    },
    {
      id: 2,
      title: "Shop B",
      owner: "Ali",
      phone: "078xxxxxxx",
      location: "Baghdad",
      totalCost: 700,
      paid: 500,
      unpaid: 200,
      workStatus: "Completed",
      note: "Payment not fully completed",
    },
    {
      id: 3,
      title: "House C",
      owner: "Hassan",
      phone: "075xxxxxxx",
      location: "Basra",
      totalCost: 450,
      paid: 0,
      unpaid: 450,
      workStatus: "Handed Off",
      note: "Owner said stop work",
    },
    {
      id: 4,
      title: "Office D",
      owner: "Nwa",
      phone: "079xxxxxxx",
      location: "Baghdad",
      totalCost: 900,
      paid: 300,
      unpaid: 600,
      workStatus: "In Progress",
      note: "Still paying in parts",
    },
  ];

  const handleSearch = () => {
    setAppliedOwner(searchOwner);
  };

  const handleReset = () => {
    setSearchOwner("");
    setAppliedOwner("");
  };

  const filteredProjects = allProjects
    .filter((project) => project.unpaid > 0)
    .filter((project) => {
      if (
        appliedOwner &&
        !project.owner.toLowerCase().includes(appliedOwner.toLowerCase())
      ) {
        return false;
      }

      return true;
    })
    .map((project) => ({
      ...project,
      totalCostText: `$${project.totalCost}`,
      paidText: `$${project.paid}`,
      unpaidText: `$${project.unpaid}`,
    }));

  const summary = filteredProjects.reduce(
    (acc, project) => {
      acc.totalCost += project.totalCost;
      acc.paid += project.paid;
      acc.unpaid += project.unpaid;
      return acc;
    },
    {
      totalCost: 0,
      paid: 0,
      unpaid: 0,
    }
  );

  const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "House / Business" },
    { key: "owner", label: "Owner" },
    { key: "phone", label: "Phone" },
    { key: "location", label: "Location" },
    { key: "workStatus", label: "Work Status" },
    { key: "totalCostText", label: "Total Cost" },
    { key: "paidText", label: "Paid" },
    { key: "unpaidText", label: "Unpaid" },
    { key: "note", label: "Note" },
  ];

  return (
    <div>
      <div className="table-header">
        <h2>Payments Due</h2>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by owner name"
          value={searchOwner}
          onChange={(e) => setSearchOwner(e.target.value)}
          className="input-modern"
        />

        <Button variant="primary" onClick={handleSearch}>
          Search
        </Button>

        <Button variant="secondary" onClick={handleReset}>
          Reset
        </Button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div className="table-container">
          <h4>Total Cost</h4>
          <p>${summary.totalCost}</p>
        </div>

        <div className="table-container">
          <h4>Total Paid</h4>
          <p>${summary.paid}</p>
        </div>

        <div className="table-container">
          <h4>Total Unpaid</h4>
          <p>${summary.unpaid}</p>
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredProjects}
        renderActions={(project) => (
          <Button
            variant="secondary"
            onClick={() => navigate(`/projects/in-progress/${project.id}`)}
          >
            Open
          </Button>
        )}
      />
    </div>
  );
}