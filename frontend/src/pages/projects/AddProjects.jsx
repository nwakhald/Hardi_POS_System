import ProjectForm from "../../components/projects/ProjectForm";
import useForm from "../../hooks/useForm";

export default function AddProject() {
  const { form, setForm, handleChange } = useForm({
    title: "",
    owner: "",
    location: "",
    phone: "",
    start_date: "",
    cost: "",
    notes: "",
  });

  const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  const url = "http://127.0.0.1:8000/api/projects";
  const method = "POST";

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(form),
  });

  const data = await res.json();

  console.log(data);
  
  // Clear form after successful submission
  setForm({
    title: "",
    owner: "",
    location: "",
    phone: "",
    start_date: "",
    cost: "",
    notes: "",
  });
};

  return (
    <div>
      <h2>Add New Project</h2>
      <ProjectForm
        form={form}
        handleChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}