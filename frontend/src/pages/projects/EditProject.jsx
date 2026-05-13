import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProjectForm from "../../components/projects/ProjectForm";
import useForm from "../../hooks/useForm";

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { form, setForm, handleChange } = useForm({
    title: "",
    owner: "",
    location: "",
    phone: "",
    start_date: "",
    cost: "",
    notes: "",
  });

  useEffect(() => {
    const fetchProject = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/api/projects/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok) {
        return;
      }

      const data = await res.json();
console.log("OLD PROJECT DATA:", data);
      setForm({
        title: data.title || "",
        owner: data.owner || "",
        location: data.location || "",
        phone: data.phone || "",
        start_date: data.start_date || "",
        cost: data.cost || "",
        notes: data.notes || "",
      });
    };

    if (id) {
      fetchProject();
    }
  }, [id, setForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch(`http://127.0.0.1:8000/api/projects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      navigate("/projects/upcoming");
    }
  };

  return (
    <div>
      <h2>Edit Project</h2>
      <ProjectForm form={form} handleChange={handleChange} onSubmit={handleSubmit} isEdit />
    </div>
  );
}
