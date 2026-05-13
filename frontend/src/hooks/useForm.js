import { useState } from "react";

export default function useForm(initialValues) {
  const [form, setForm] = useState(initialValues);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return { form, setForm, handleChange };
}