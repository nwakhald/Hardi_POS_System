import { useEffect, useState } from "react";
import Table from "../components/projects/ProjectTable";
import Button from "../components/ui/Button";
import { getProjects } from "../api/projectApi";

export default function Profit() {
  const [projects, setProjects] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [appliedMonth, setAppliedMonth] = useState("");
  const [appliedYear, setAppliedYear] = useState("");
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
        setError("Failed to load profit projects");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

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

  const filteredProjects = projects
    .filter((project) => {
      const finishDate = project.finish_date || project.finishDate;
      if (!finishDate) return false;

      const date = new Date(finishDate);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear());

      if (appliedMonth && month !== appliedMonth) return false;
      if (appliedYear && year !== appliedYear) return false;

      return true;
    })
    .map((project) => {
      const totalCost = Number(project.cost || 0);
      const revenue = Number(project.paid || 0);
      const expenseCost = Number(project.expense_cost || 0);
      const teamCost = Number(project.team_cost || 0);
      const profit = revenue - expenseCost - teamCost;
      const finishDate = project.finish_date || project.finishDate || "";

      return {
        ...project,
        finishDate,
        totalCost,
        revenue,
        expenseCost,
        teamCost,
        totalCostText: `$${totalCost.toFixed(2)}`,
        revenueText: `$${revenue.toFixed(2)}`,
        expenseCostText: `$${expenseCost.toFixed(2)}`,
        teamCostText: `$${teamCost.toFixed(2)}`,
        profit,
        profitText: `$${profit.toFixed(2)}`,
      };
    });

  const summary = filteredProjects.reduce(
    (acc, project) => {
      acc.totalCost += project.totalCost;
      acc.revenue += project.revenue;
      acc.expenseCost += project.expenseCost;
      acc.teamCost += project.teamCost;
      acc.profit += project.profit;
      return acc;
    },
    {
      totalCost: 0,
      revenue: 0,
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
    { key: "revenueText", label: "Paid" },
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
          <p>${summary.totalCost.toFixed(2)}</p>
        </div>

        <div className="table-container">
          <h4>Total Paid</h4>
          <p>${summary.revenue.toFixed(2)}</p>
        </div>

        <div className="table-container">
          <h4>Expense Cost</h4>
          <p>${summary.expenseCost.toFixed(2)}</p>
        </div>

        <div className="table-container">
          <h4>Team Cost</h4>
          <p>${summary.teamCost.toFixed(2)}</p>
        </div>

        <div className="table-container">
          <h4>Total Profit</h4>
          <p className={summary.profit >= 0 ? "profit-positive" : "profit-negative"}>
            ${summary.profit.toFixed(2)}
          </p>
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Loading profit data...</p>
      ) : (
        <Table columns={columns} data={filteredProjects} />
      )}
    </div>
  );
}