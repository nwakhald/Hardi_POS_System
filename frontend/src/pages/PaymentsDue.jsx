import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../components/projects/ProjectTable";
import Button from "../components/ui/Button";
import { getProjects } from "../api/projectApi";

export default function PaymentsDue() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [searchOwner, setSearchOwner] = useState("");
  const [appliedOwner, setAppliedOwner] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [appliedLocation, setAppliedLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        console.error("Failed to load projects", err);
        setError("Failed to load payment due projects");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleSearch = () => {
    setAppliedOwner(searchOwner);
    setAppliedDate(searchDate);
    setAppliedLocation(searchLocation);
  };

  const handleReset = () => {
    setSearchOwner("");
    setAppliedOwner("");
    setSearchDate("");
    setAppliedDate("");
    setSearchLocation("");
    setAppliedLocation("");
  };

  const filteredProjects = projects
    .filter((project) => Number(project.unpaid) > 0)
    .filter((project) => {
      if (
        appliedOwner &&
        !project.owner.toLowerCase().includes(appliedOwner.toLowerCase())
      ) {
        return false;
      }

      if (
        appliedDate &&
        project.start_date !== appliedDate
      ) {
        return false;
      }

      if (
        appliedLocation &&
        !project.location.toLowerCase().includes(appliedLocation.toLowerCase())
      ) {
        return false;
      }

      return true;
    })
    .map((project) => ({
      ...project,
      workStatus: project.status ? project.status.replace(/_/g, " ") : "-",
      totalCostText: `$${Number(project.cost).toFixed(2)}`,
      paidText: `$${Number(project.paid).toFixed(2)}`,
      unpaidText: `$${Number(project.unpaid).toFixed(2)}`,
    }));

  const summary = filteredProjects.reduce(
    (acc, project) => {
      acc.totalCost += Number(project.cost || 0);
      acc.paid += Number(project.paid || 0);
      acc.unpaid += Number(project.unpaid || 0);
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
    { key: "start_date", label: "Date" },
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

        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="input-modern"
          style={{ maxWidth: "180px" }}
        />

        <input
          type="text"
          placeholder="Search by location"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
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
          <p>${summary.totalCost.toFixed(2)}</p>
        </div>

        <div className="table-container">
          <h4>Total Paid</h4>
          <p>${summary.paid.toFixed(2)}</p>
        </div>

        <div className="table-container">
          <h4>Total Unpaid</h4>
          <p>${summary.unpaid.toFixed(2)}</p>
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Loading payment due projects...</p>
      ) : (
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
      )}
    </div>
  );
}