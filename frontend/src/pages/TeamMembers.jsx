import { useState } from "react";
import Table from "../components/projects/ProjectTable";
import Button from "../components/ui/Button";

export default function TeamMembers() {
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: "Nwa",
      role: "Installer",
      phone: "077xxxxxxx",
      status: "Available",
      currentWork: "-",
      note: "Can work full day",
    },
    {
      id: 2,
      name: "Ali",
      role: "Technician",
      phone: "078xxxxxxx",
      status: "Working",
      currentWork: "House C",
      note: "Working on cameras",
    },
    {
      id: 3,
      name: "Omar",
      role: "Helper",
      phone: "075xxxxxxx",
      status: "Available",
      currentWork: "-",
      note: "Ready for new task",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

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

  const handleAddMember = (e) => {
    e.preventDefault();

    const newMember = {
      id: teamMembers.length + 1,
      name: formData.name,
      role: formData.role,
      phone: formData.phone,
   
    
      note: formData.note,
    };

    setTeamMembers((prev) => [...prev, newMember]);

    setFormData({
      name: "",
      role: "",
      phone: "",
     
      currentWork: "-",
      note: "",
    });

    setShowForm(false);
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
        renderActions={() => (
          <>
            <Button variant="secondary">Open</Button>
            <Button variant="warning">Edit</Button>
            <Button variant="danger">Delete</Button>
          </>
        )}
      />
    </div>
  );
}