import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { getProject } from "../../api/projectApi";
import Table from "../../components/projects/ProjectTable";
import Button from "../../components/ui/Button";
export default function ProjectDetails() {
  const { id } = useParams();

 const [project, setProject] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 const [workStatus, setWorkStatus] = useState("In Progress");

 useEffect(() => {
  const loadProject = async () => {
    try {
      setLoading(true);
      const data = await getProject(id);
      setProject(data);
      setWorkStatus(data.status);
    } catch (error) {
      console.error(error);
      setError("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  loadProject();
}, [id]);

const [teamWorkRows, setTeamWorkRows] = useState([]);

const [finishedSessions, setFinishedSessions] = useState([]);

useEffect(() => {
  const fetchTeamWork = async () => {
    try {
      const response = await api.get(`/projects/${id}/team-work`);
      if (Array.isArray(response.data)) {
        setTeamWorkRows(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch team work", error);
    }
  };

  fetchTeamWork();
}, [id]);

useEffect(() => {
  const fetchFinishedSessions = async () => {
    try {
      const response = await api.get(`/projects/${id}/finished-sessions`);
      if (Array.isArray(response.data)) {
        setFinishedSessions(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch finished sessions", error);
    }
  };

  fetchFinishedSessions();
}, [id]);

  const [payments, setPayments] = useState([]);

  const [activityLogs, setActivityLogs] = useState([]);

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [newPayment, setNewPayment] = useState({
    amount: "",
    method: "",
    note: "",
  });

  // Fetch activity logs on component mount
  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        const response = await api.get(`/projects/${id}/activity-logs`);
        if (Array.isArray(response.data)) {
          setActivityLogs(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch activity logs", error);
      }
    };

    fetchActivityLogs();
  }, [id]);

  // Fetch payments on component mount
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get(`/projects/${id}/payments`);
        if (Array.isArray(response.data)) {
          setPayments(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch payments", error);
      }
    };

    fetchPayments();
  }, [id]);

  const getNow = () => new Date().toLocaleString();

  const addLog = async (action, note) => {
    try {
      const response = await api.post(`/projects/${id}/activity-logs`, {
        action,
        note,
        dateTime: getNow(),
      });

      const newLog = response.data.log || {
        id: activityLogs.length + 1,
        dateTime: getNow(),
        action,
        note,
      };

      setActivityLogs((prev) => [newLog, ...prev]);
    } catch (error) {
      console.error("Failed to save activity log", error);
    }
  };

  const handleAddPayment = async (paymentData) => {
    try {
      const response = await api.post(`/projects/${id}/payments`, {
        ...paymentData,
        dateTime: getNow(),
      });

      const newPaymentData = response.data.payment || paymentData;
      setPayments((prev) => [newPaymentData, ...prev]);

      if (response.data.project) {
        setProject((prev) => ({ ...prev, ...response.data.project }));
      }
    } catch (error) {
      console.error("Failed to save payment", error);
      alert("Failed to save payment");
    }
  };

  const handleSubmitPayment = async () => {
    if (!newPayment.amount || !newPayment.method) {
      alert("Please fill in amount and method");
      return;
    }

    await handleAddPayment(newPayment);
    setNewPayment({ amount: "", method: "", note: "" });
    setShowPaymentForm(false);
  };

  const handleToggleWorkStatus = async () => {
    const token = localStorage.getItem("token");

    const endpoint = workStatus === "paused" ? "resume" : "pause";
    const isPausing = endpoint === "pause";

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
      alert("Failed to update project status");
      return;
    }

    const newStatus = workStatus === "paused" ? "in_progress" : "paused";

    setWorkStatus(newStatus);

    // If pausing, automatically finish all active work sessions
    if (isPausing) {
      const activeWorkers = teamWorkRows.filter((w) => w.actionState === "working");
      
      if (activeWorkers.length > 0) {
        // Move active workers to finished sessions
        const finishedSessionsToAdd = activeWorkers.map((worker) => ({
          id: worker.workSessionId,
          name: worker.name,
          startTime: worker.startTime,
          finishTime: getNow(),
        }));

        setFinishedSessions((prev) => [...finishedSessionsToAdd, ...prev]);

        // Reset team work rows
        setTeamWorkRows((prev) =>
          prev.map((w) =>
            w.actionState === "working"
              ? {
                  ...w,
                  startTime: "-",
                  finishTime: "-",
                  status: "Available",
                  actionState: "idle",
                  workSessionId: null,
                }
              : w
          )
        );

        addLog(
          "Auto-Finish Work",
          `${activeWorkers.length} team member(s) work session(s) auto-finished due to project pause`
        );
      } else {
        addLog("Pause Work", "Work paused");
      }
    } else {
      addLog("Resume Work", "Work resumed");
    }
  };

  const handleCompleteProject = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://127.0.0.1:8000/api/projects/${id}/complete`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.message || "Failed to complete project");
      return;
    }

    const data = await res.json();
    setWorkStatus(data.project.status);
    setProject(data.project);

    const activeWorkers = teamWorkRows.filter((w) => w.actionState === "working");
    if (activeWorkers.length > 0) {
      const finishedSessionsToAdd = activeWorkers.map((worker) => ({
        id: worker.workSessionId,
        name: worker.name,
        startTime: worker.startTime,
        finishTime: getNow(),
      }));

      setFinishedSessions((prev) => [...finishedSessionsToAdd, ...prev]);
      setTeamWorkRows((prev) =>
        prev.map((w) =>
          w.actionState === "working"
            ? {
                ...w,
                startTime: "-",
                finishTime: "-",
                status: "Available",
                actionState: "idle",
                workSessionId: null,
              }
            : w
        )
      );
    }

    addLog("Complete Project", "Project marked as completed");
  };

  const handleStartWorking = async (workerId) => {
    try {
      const response = await api.post(
        `/projects/${id}/team-members/${workerId}/start-work`
      );

      const session = response.data.session;
      if (!session) {
        throw new Error("Missing session data from start-work response");
      }

      setTeamWorkRows((prev) =>
        prev.map((w) =>
          w.id === workerId
            ? {
                ...w,
                startTime: session.start_time || getNow(),
                finishTime: "-",
                status: "Working",
                actionState: "working",
                workSessionId: session.id,
              }
            : w
        )
      );

      const worker = teamWorkRows.find((w) => w.id === workerId);
      if (worker) {
        addLog("Start Working", `${worker.name} started working`);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to start work. Check the console for details.";
      console.error("Failed to start work", error);
      alert(errorMessage);
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

 const handleFinishWorking = async (workerId) => {
  const worker = teamWorkRows.find((w) => w.id === workerId);

  if (!worker?.workSessionId) {
    alert("No active work session found");
    return;
  }

  try {
    const response = await api.put(
      `/work-sessions/${worker.workSessionId}/finish-work`
    );

    const session = response.data.session;
    if (!session) {
      throw new Error("Missing session data from finish-work response");
    }

    setFinishedSessions((prev) => [
      {
        id: session.id,
        name: worker.name,
        startTime: session.start_time,
        finishTime: session.finish_time,
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
              status: "Available",
              actionState: "idle",
              workSessionId: null,
            }
          : w
      )
    );

    addLog("Finish Working", `${worker.name} finished working`);
  } catch (error) {
    console.error("Failed to finish work", error);
    alert("Failed to finish work. Check the console for details.");
  }
};

  if (loading) return <p>Loading project details...</p>;
if (error) return <p>{error}</p>;
if (!project) return <p>Project not found.</p>;
  const detailRows = [
  { label: "ID", value: project.id },
  { label: "House", value: project.title },
  { label: "Owner", value: project.owner },
  { label: "Phone", value: project.phone },
  { label: "Location", value: project.location },
  { label: "Start Date", value: project.start_date },
  { label: "Progress", value: `${project.progress}%` },
  { label: "Status", value: workStatus },
  { label: "Total Cost", value: `$${project.cost}` },
  { label: "Paid", value: `$${project.paid}` },
  { label: "Unpaid", value: `$${project.unpaid}` },
  { label: "Expense Cost", value: `$${project.expense_cost}` },
  { label: "Team Cost", value: `$${project.team_cost}` },
  { label: "Notes", value: project.notes || "-" },
];
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString || dateTimeString === '-') return '-';
    try {
      const date = new Date(dateTimeString);
      const day = date.getDate();
      const month = date.toLocaleString('en-US', { month: 'short' }).toLowerCase();
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${month}/${day}/${year} ${hours}:${minutes}`;
    } catch {
      return dateTimeString;
    }
  };

  const teamColumns = [ 
    { key: "name", label: "Name" },
    {
      key: "startTime",
      label: "Start Time",
      render: (row) => formatDateTime(row.startTime),
    },
    { key: "status", label: "Status" },
  ];

  const finishedSessionColumns = [
    { key: "name", label: "Name" },
    {
      key: "startTime",
      label: "Start Time",
      render: (row) => formatDateTime(row.startTime),
    },
    {
      key: "finishTime",
      label: "Finish Time",
      render: (row) => formatDateTime(row.finishTime),
    },
  ];

  const paymentColumns = [
    {
      key: "dateTime",
      label: "Date & Time",
      render: (row) => formatDateTime(row.dateTime),
    },
    { key: "amount", label: "Amount" },
    { key: "method", label: "Method" },
    { key: "note", label: "Note" },
  ];

  const activityColumns = [
    {
      key: "dateTime",
      label: "Date & Time",
      render: (row) => formatDateTime(row.dateTime),
    },
    { key: "action", label: "Action" },
    { key: "note", label: "Note" },
  ];

    const renderTeamAction = (worker) => {
  if (worker.actionState === "working") {
    return (
      <Button variant="primary" onClick={() => handleAskFinish(worker.id)}>
        Working now
      </Button>
    );
  }

  if (worker.actionState === "confirm") {
    return (
      <>
        <Button variant="success" onClick={() => handleFinishWorking(worker.id)}>
          Yes
        </Button>
        <Button variant="warning" onClick={() => handleCancelFinish(worker.id)}>
          Cancel
        </Button>
      </>
    );
  }

  // Only show Start button if project is in progress
  if (workStatus !== "in_progress") {
    return (
      <span style={{ color: "#999", fontSize: "0.9em" }}>
        Project not in progress
      </span>
    );
  }

  return (
    <Button variant="success" onClick={() => handleStartWorking(worker.id)}>
      Start
    </Button>
  );
};

  return (
    <div>
      <div className="table-header">
        <h2>Project Details</h2>

        <div>
         <Button
  variant={workStatus === "paused" ? "success" : "primary"}
  onClick={handleToggleWorkStatus}
>
  {workStatus === "paused" ? "Resume" : "Pause"}
</Button>

          <Button variant="warning" onClick={() => setShowPaymentForm(true)}>Add Payment</Button>
          <Button
            variant="success"
            onClick={handleCompleteProject}
            disabled={workStatus === "completed"}
          >
            {workStatus === "completed" ? "Completed" : "Complete"}
          </Button>
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

      {showPaymentForm && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "8px",
            minWidth: "400px",
          }}>
            <h3>Add Payment</h3>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "4px" }}>Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "4px" }}>Method</label>
              <input
                type="text"
                placeholder="e.g., Cash, Card, Transfer"
                value={newPayment.method}
                onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
                style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "4px" }}>Note</label>
              <input
                type="text"
                placeholder="Optional note"
                value={newPayment.note}
                onChange={(e) => setNewPayment({ ...newPayment, note: e.target.value })}
                style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <Button variant="success" onClick={handleSubmitPayment}>Save Payment</Button>
              <Button variant="secondary" onClick={() => {
                setShowPaymentForm(false);
                setNewPayment({ amount: "", method: "", note: "" });
              }}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}