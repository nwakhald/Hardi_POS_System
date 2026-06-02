import api from "./axios";

export const getProjects = async () => {
  const response = await api.get("/projects");
  return response.data;
};

export const getProject = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (projectData) => {
  const response = await api.post("/projects", projectData);
  return response.data;
};

export const updateProject = async (id, projectData) => {
  const response = await api.put(`/projects/${id}`, projectData);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

export const startProject = async (id) => {
  const response = await api.post(`/projects/${id}/start`);
  return response.data;
};

export const pauseProject = async (id) => {
  const response = await api.put(`/projects/${id}/pause`);
  return response.data;
};

export const resumeProject = async (id) => {
  const response = await api.put(`/projects/${id}/resume`);
  return response.data;
};