import { useEffect, useState } from "react";
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember, getTeamMemberSessions } from "../api/teamApi";
import Table from "../components/projects/ProjectTable";
import Button from "../components/ui/Button";

export default function TeamMembers() {
  const [teamMembers, setTeamMembers] = useState([

  ]);
useEffect(() => {
  const loadMembers = async () => {
    const data = await getTeamMembers();
    setTeamMembers(data);
  };

  loadMembers();
}, []);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [showSessions, setShowSessions] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    phone: "",
    status: "Available",
    currentWork: "-",
    note: "",
  });

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "phone", label: "Phone" },
   
    { key: "note", label: "Note" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddMember = async (e) => {
    e.preventDefault();

    if (editingId) {
      const response = await updateTeamMember(editingId, {
        name: formData.name,
        phone: formData.phone,
        role: formData.role,
        note: formData.note,
      });

      setTeamMembers((prev) => prev.map((m) => (m.id === editingId ? response.member : m)));
      setEditingId(null);
    } else {
      const response = await createTeamMember({
        name: formData.name,
        phone: formData.phone,
        role: formData.role,
        note: formData.note,
      });

      setTeamMembers((prev) => [response.member, ...prev]);
    }

    setFormData({
      name: "",
      phone: "",
      role: "",
      status: "Available",
      currentWork: "-",
      note: "",
    });

    setShowForm(false);
  };

  const handleEdit = (member) => {
    setEditingId(member.id);
    setFormData({
      name: member.name || "",
      phone: member.phone || "",
      role: member.role || "",
      status: member.status || "Available",
      currentWork: member.currentWork || "-",
      note: member.note || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) return;
    await deleteTeamMember(memberId);
    setTeamMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const openSessions = async (member) => {
    setShowSessions(true);
    setSessionsLoading(true);
    try {
      const data = await getTeamMemberSessions(member.id);
      setSessions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load sessions", err);
      setSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  };

  return (
    <div>
      <div className="table-header">
        <h2>Team Members</h2>

        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "+ Add Team Member"}
        </Button>
      </div>

      {showForm && (
        <div className="form-container" style={{ marginBottom: "20px" }}>
          <form className="form" onSubmit={handleAddMember}>
            <div className="form-group">
              <label>Name</label>
              <input
              className="form-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter member name"
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <input
              className="form-input"
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Enter role"
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
              className="form-input"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone"
              />
            </div>

            

            

            <div className="form-group">
              <label>Note</label>
              <textarea
                name="note"
                className="form-input"
                value={formData.note}
                onChange={handleChange}
                placeholder="Enter note"
                rows="3"
              />
            </div>

            <div className="form-actions">
              <Button variant="success" type="submit">
                Save Member
              </Button>
            </div>
          </form>
        </div>
      )}

      <Table
        columns={columns}
        data={teamMembers}
        renderActions={(member) => (
          <>
            <Button variant="primary" onClick={() => openSessions(member)}>History</Button>
            <Button variant="warning" onClick={() => handleEdit(member)}>Edit</Button>
            <Button variant="danger" onClick={() => handleDelete(member.id)}>Delete</Button>
          </>
        )}
      />

      {showSessions && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "90%",
            maxWidth: "800px",
            maxHeight: "90%",
            overflow: "auto",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3>Work History</h3>
              <div>
                <Button variant="secondary" onClick={() => setShowSessions(false)}>Close</Button>
              </div>
            </div>

            {sessionsLoading ? (
              <p>Loading...</p>
            ) : (
              <Table
                columns={[
                  { key: 'id', label: 'ID' },
                  { key: 'project_title', label: 'Project' },
                  { key: 'startTime', label: 'Start Time' },
                  { key: 'finishTime', label: 'Finish Time' },
                ]}
                data={sessions}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}