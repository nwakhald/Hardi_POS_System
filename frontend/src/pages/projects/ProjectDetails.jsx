import { useParams } from "react-router-dom";
import { useState } from "react";
import Table from "../../components/projects/ProjectTable";
import Button from "../../components/ui/Button";

export default function ProjectDetails() {
  const { id } = useParams();

  const project = {
    id,
    title: "House C",
    owner: "Nwa",
    phone: "077xxxxxxx",
    location: "Abuja",
    projectType: "House",
    startDate: "2026-06-04 12:00 PM",
    deadline: "2026-06-10",
    progress: "80%",
    totalCost: 500,
    paid: 300,
    unpaid: 200,
    expenseCost: 120,
    teamCost: 80,
    notes: "Installation almost finished",
  };

  const [workStatus, setWorkStatus] = useState("In Progress");

  const [teamWorkRows, setTeamWorkRows] = useState([
    {
      id: 1,
      name: "Nwa",
      role: "Installer",
      startTime: "-",
      finishTime: "-",
      status: "Not Working",
      actionState: "idle",
    },
    {
      id: 2,
      name: "Ali",
      role: "Technician",
      startTime: "-",
      finishTime: "-",
      status: "Not Working",
      actionState: "idle",
    },
    {
      id: 3,
      name: "Omar",
      role: "Helper",
      startTime: "-",
      finishTime: "-",
      status: "Not Working",
      actionState: "idle",
    },
  ]);

  const [finishedSessions, setFinishedSessions] = useState([
    {
      id: 1,
      name: "Nwa",
      role: "Installer",
      startTime: "2026-06-04 12:00 PM",
      finishTime: "2026-06-04 01:00 PM",
    },
  ]);

  const [payments] = useState([
    {
      id: 1,
      dateTime: "2026-06-04 03:00 PM",
      amount: "$200",
      method: "Cash",
      note: "First payment",
    },
  ]);

  const [activityLogs, setActivityLogs] = useState([
    {
      id: 1,
      dateTime: "2026-06-04 12:00 PM",
      action: "Resume Work",
      note: "Work resumed",
    },
  ]);

  const getNow = () => new Date().toLocaleString();

  const addLog = (action, note) => {
    setActivityLogs((prev) => [
      {
        id: prev.length + 1,
        dateTime: getNow(),
        action,
        note,
      },
      ...prev,
    ]);
  };

  const handleToggleWorkStatus = () => {
    if (workStatus === "Paused") {
      setWorkStatus("In Progress");
      addLog("Resume Work", "Work resumed");
    } else {
      setWorkStatus("Paused");
      addLog("Pause Work", "Work paused");
    }
  };

  const handleStartWorking = (workerId) => {
    const now = getNow();
    const worker = teamWorkRows.find((w) => w.id === workerId);

    setTeamWorkRows((prev) =>
      prev.map((w) =>
        w.id === workerId
          ? {
              ...w,
              startTime: now,
              finishTime: "-",
              status: "Active Working",
              actionState: "working",
            }
          : w
      )
    );

    if (worker) {
      addLog("Start Working", `${worker.name} started working`);
    }
  };

  const handleAskFinish = (workerId) => {
    setTeamWorkRows((prev) =>
      prev.map((w) =>
        w.id === workerId ? { ...w, actionState: "confirm" } : w
      )
    );
  };

  const handleCancelFinish = (workerId) => {
    setTeamWorkRows((prev) =>
      prev.map((w) =>
        w.id === workerId ? { ...w, actionState: "working" } : w
      )
    );
  };

  const handleFinishWorking = (workerId) => {
    const finishTime = getNow();
    const worker = teamWorkRows.find((w) => w.id === workerId);

    if (!worker) return;

    setFinishedSessions((prev) => [
      {
        id: prev.length + 1,
        name: worker.name,
        role: worker.role,
        startTime: worker.startTime,
        finishTime,
      },
      ...prev,
    ]);

    setTeamWorkRows((prev) =>
      prev.map((w) =>
        w.id === workerId
          ? {
              ...w,
              startTime: "-",
              finishTime: "-",
              status: "Not Working",
              actionState: "idle",
            }
          : w
      )
    );

    addLog("Finish Working", `${worker.name} finished working`);
  };

  const detailRows = [
    { label: "ID", value: project.id },
    { label: "House", value: project.title },
    { label: "Owner", value: project.owner },
    { label: "Phone", value: project.phone },
    { label: "Location", value: project.location },
    { label: "Project Type", value: project.projectType },
    { label: "Start Date", value: project.startDate },
    { label: "Deadline", value: project.deadline },
    { label: "Progress", value: project.progress },
    { label: "Status", value: workStatus },
    { label: "Total Cost", value: `$${project.totalCost}` },
    { label: "Paid", value: `$${project.paid}` },
    { label: "Unpaid", value: `$${project.unpaid}` },
    { label: "Expense Cost", value: `$${project.expenseCost}` },
    { label: "Team Cost", value: `$${project.teamCost}` },
    { label: "Notes", value: project.notes },
  ];

  const teamColumns = [
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "startTime", label: "Start Time" },
    { key: "finishTime", label: "Finish Time" },
    { key: "status", label: "Status" },
  ];

  const finishedSessionColumns = [
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "startTime", label: "Start Time" },
    { key: "finishTime", label: "Finish Time" },
  ];

  const paymentColumns = [
    { key: "dateTime", label: "Date & Time" },
    { key: "amount", label: "Amount" },
    { key: "method", label: "Method" },
    { key: "note", label: "Note" },
  ];

  const activityColumns = [
    { key: "dateTime", label: "Date & Time" },
    { key: "action", label: "Action" },
    { key: "note", label: "Note" },
  ];

  const renderTeamAction = (worker) => {
    if (worker.actionState === "idle") {
      return (
        <Button
          variant="secondary"
          onClick={() => handleStartWorking(worker.id)}
        >
          Start Working
        </Button>
      );
    }

    if (worker.actionState === "working") {
      return (
        <Button
          variant="primary"
          onClick={() => handleAskFinish(worker.id)}
        >
          Active Working
        </Button>
      );
    }

    if (worker.actionState === "confirm") {
      return (
        <>
          <Button
            variant="success"
            onClick={() => handleFinishWorking(worker.id)}
          >
            Yes
          </Button>
          <Button
            variant="warning"
            onClick={() => handleCancelFinish(worker.id)}
          >
            Cancel
          </Button>
        </>
      );
    }

    return null;
  };

  return (
    <div>
      <div className="table-header">
        <h2>Project Details</h2>

        <div>
          <Button
            variant={workStatus === "Paused" ? "success" : "primary"}
            onClick={handleToggleWorkStatus}
          >
            {workStatus === "Paused" ? "Resume" : "Pause"}
          </Button>

          <Button variant="warning">Add Payment</Button>
          <Button variant="success">Complete</Button>
        </div>
      </div>

      <Table data={detailRows} detailMode />

      <div
        className="section-header"
        style={{ marginTop: "24px", marginBottom: "12px" }}
      >
        <h3>Team Work</h3>
      </div>

      <Table
        columns={teamColumns}
        data={teamWorkRows}
        renderActions={renderTeamAction}
      />

      <div
        className="section-header"
        style={{ marginTop: "24px", marginBottom: "12px" }}
      >
        <h3>Finished Sessions</h3>
      </div>

      <Table columns={finishedSessionColumns} data={finishedSessions} />

      <div
        className="section-header"
        style={{ marginTop: "24px", marginBottom: "12px" }}
      >
        <h3>Payments</h3>
      </div>

      <Table columns={paymentColumns} data={payments} />

      <div
        className="section-header"
        style={{ marginTop: "24px", marginBottom: "12px" }}
      >
        <h3>Activity Log</h3>
      </div>

      <Table columns={activityColumns} data={activityLogs} />
    </div>
  );
}