import { useEffect, useState } from "react";
import { getTeamMembers, createTeamMember } from "../api/teamApi";
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

    const response = await createTeamMember({
      name: formData.name,
      phone: formData.phone,
      role: formData.role,
      note: formData.note,
    });

    setTeamMembers((prev) => [response.member, ...prev]);

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
    
            <Button variant="warning">Edit</Button>
            <Button variant="danger">Delete</Button>
          </>
        )}
      />
    </div>
  );
}