import { useMemo, useState } from "react";
import Table from "../components/projects/ProjectTable";
import Button from "../components/ui/Button";

export default function History() {
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [appliedName, setAppliedName] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const handleSearch = () => {
    setAppliedName(searchName);
    setAppliedDate(searchDate);
  };

  const handleReset = () => {
    setSearchName("");
    setSearchDate("");
    setAppliedName("");
    setAppliedDate("");
    setActiveFilter("all");
  };

  const filteredProjects = useMemo(() => {
    const allProjects = [
      {
        id: 1,
        title: "House A",
        owner: "Ahmed",
        phone: "077xxxxxxx",
        location: "Abuja",
        progress: "100%",
        workStatus: "Completed",
        totalCost: 500,
        paid: 500,
        unpaid: 0,
        finishDate: "2025-04-02",
        teamMembers: ["Nwa", "Ali"],
        workDates: ["2025-04-02"],
        note: "Finished successfully",
      },
      {
        id: 2,
        title: "Shop B",
        owner: "Ali",
        phone: "078xxxxxxx",
        location: "Baghdad",
        progress: "100%",
        workStatus: "Completed",
        totalCost: 700,
        paid: 500,
        unpaid: 200,
        finishDate: "2025-04-03",
        teamMembers: ["Omar", "Nwa"],
        workDates: ["2025-04-02", "2025-04-03"],
        note: "Payment not fully completed",
      },
      {
        id: 3,
        title: "House C",
        owner: "Hassan",
        phone: "075xxxxxxx",
        location: "Basra",
        progress: "70%",
        workStatus: "Handed Off",
        totalCost: 450,
        paid: 150,
        unpaid: 300,
        finishDate: "2025-04-04",
        teamMembers: ["Ali"],
        workDates: ["2025-04-04"],
        note: "Owner said stop work",
      },
    ];

    return allProjects
      .filter((project) => {
        const isHistory =
          project.workStatus === "Completed" ||
          project.workStatus === "Handed Off";

        if (!isHistory) return false;

        if (
          activeFilter === "work_not_complete" &&
          project.workStatus !== "Handed Off"
        ) {
          return false;
        }

        if (activeFilter === "unpaid" && project.unpaid <= 0) {
          return false;
        }

        if (
          activeFilter === "closed" &&
          !(project.workStatus === "Completed" && project.unpaid === 0)
        ) {
          return false;
        }

        const matchName = appliedName
          ? project.teamMembers.some((member) =>
              member.toLowerCase().includes(appliedName.toLowerCase())
            )
          : true;

        const matchDate = appliedDate
          ? project.workDates.includes(appliedDate)
          : true;

        return matchName && matchDate;
      })
      .map((project) => ({
        ...project,
        totalCost: `$${project.totalCost}`,
        paid: `$${project.paid}`,
        unpaid: `$${project.unpaid}`,
        teamMembersText: project.teamMembers.join(", "),
        workDatesText: project.workDates.join(", "),
      }));
  }, [appliedName, appliedDate, activeFilter]);

  const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "House / Business" },
    { key: "owner", label: "Owner" },
    { key: "phone", label: "Phone" },
    { key: "location", label: "Location" },
    { key: "teamMembersText", label: "Team Members" },
    { key: "workDatesText", label: "Work Dates" },
    { key: "progress", label: "Progress" },
    { key: "workStatus", label: "Work Status" },
    { key: "finishDate", label: "Finish Date" },
    { key: "totalCost", label: "Total Cost" },
    { key: "paid", label: "Paid" },
    { key: "unpaid", label: "Unpaid" },
    { key: "note", label: "Note" },
  ];

  return (
    <div>
      <div className="table-header">
        <h2>History</h2>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by worker name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="input-modern"
        />

        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="input-modern"
        />

        <Button variant="primary"  onClick={handleSearch}>
          Search
        </Button>

        <Button variant="secondary" onClick={handleReset}>
          Reset
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          marginTop: "10px",
          flexWrap: "wrap",
        }}
      >
        <Button
          variant={activeFilter === "all" ? "primary" : "secondary"}
          onClick={() => setActiveFilter("all")}
        >
          All
        </Button>

        <Button
          variant={activeFilter === "work_not_complete" ? "primary" : "secondary"}
          onClick={() => setActiveFilter("work_not_complete")}
        >
          Work Didn’t Complete
        </Button>

        <Button
          variant={activeFilter === "unpaid" ? "primary" : "secondary"}
          onClick={() => setActiveFilter("unpaid")}
        >
          Unpaid
        </Button>

        <Button
          variant={activeFilter === "closed" ? "primary" : "secondary"}
          onClick={() => setActiveFilter("closed")}
        >
          Closed
        </Button>
      </div>

      <Table
        columns={columns}
        data={filteredProjects}
        renderActions={() => <Button variant="secondary">Open</Button>}
      />
    </div>
  );
}