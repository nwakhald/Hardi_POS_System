import { useState } from "react";
import Table from "../components/projects/ProjectTable";
import Button from "../components/ui/Button";

export default function Profit() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [appliedMonth, setAppliedMonth] = useState("");
  const [appliedYear, setAppliedYear] = useState("");

  const allProjects = [
    {
      id: 1,
      title: "House A",
      owner: "Ahmed",
      location: "Abuja",
      finishDate: "2025-02-10",
      totalCost: 500,
      expenseCost: 120,
      teamCost: 80,
    },
    {
      id: 2,
      title: "Shop B",
      owner: "Ali",
      location: "Baghdad",
      finishDate: "2025-02-18",
      totalCost: 700,
      expenseCost: 180,
      teamCost: 100,
    },
    {
      id: 3,
      title: "House C",
      owner: "Hassan",
      location: "Basra",
      finishDate: "2025-03-05",
      totalCost: 450,
      expenseCost: 100,
      teamCost: 70,
    },
    {
      id: 4,
      title: "Office D",
      owner: "Nwa",
      location: "Abuja",
      finishDate: "2025-03-20",
      totalCost: 900,
      expenseCost: 250,
      teamCost: 120,
    },
  ];

  const handleSearch = () => {
    setAppliedMonth(selectedMonth);
    setAppliedYear(selectedYear);
  };

  const handleReset = () => {
    setSelectedMonth("");
    setSelectedYear("");
    setAppliedMonth("");
    setAppliedYear("");
  };

  const filteredProjects = allProjects
    .filter((project) => {
      if (!project.finishDate) return false;

      const date = new Date(project.finishDate);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear());

      if (appliedMonth && month !== appliedMonth) return false;
      if (appliedYear && year !== appliedYear) return false;

      return true;
    })
    .map((project) => {
      const profit =
        project.totalCost - project.expenseCost - project.teamCost;

      return {
        ...project,
        totalCostText: `$${project.totalCost}`,
        expenseCostText: `$${project.expenseCost}`,
        teamCostText: `$${project.teamCost}`,
        profit,
        profitText: `$${profit}`,
      };
    });

  const summary = filteredProjects.reduce(
    (acc, project) => {
      acc.totalCost += project.totalCost;
      acc.expenseCost += project.expenseCost;
      acc.teamCost += project.teamCost;
      acc.profit += project.profit;
      return acc;
    },
    {
      totalCost: 0,
      expenseCost: 0,
      teamCost: 0,
      profit: 0,
    }
  );

  const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Project" },
    { key: "owner", label: "Owner" },
    { key: "location", label: "Location" },
    { key: "finishDate", label: "Finish Date" },
    { key: "totalCostText", label: "Total Cost" },
    { key: "expenseCostText", label: "Expense Cost" },
    { key: "teamCostText", label: "Team Cost" },
    { key: "profitText", label: "Profit" },
  ];

  return (
    <div>
      <div className="table-header">
        <h2>Profit</h2>
      </div>

      <div style={{marginBottom:"24px" }} className="filter-bar">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="input-modern"
        >
          <option value="">Choose Month</option>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="input-modern"
        >
          <option value="">Choose Year</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>

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
          <h4>Expense Cost</h4>
          <p>${summary.expenseCost}</p>
        </div>

        <div className="table-container">
          <h4>Team Cost</h4>
          <p>${summary.teamCost}</p>
        </div>

        <div className="table-container">
          <h4>Total Profit</h4>
<p className={summary.profit >= 0 ? "profit-positive" : "profit-negative"}>
  ${summary.profit}
</p>        </div>
      </div>

      <Table columns={columns} data={filteredProjects} />
    </div>
  );
}