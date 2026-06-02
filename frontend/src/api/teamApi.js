import api from "./axios";

export const getTeamMembers = async () => {
  const response = await api.get("/team-members");
  return response.data;
};

export const createTeamMember = async (data) => {
  const response = await api.post("/team-members", data);
  return response.data;
};

export const updateTeamMember = async (id, data) => {
  const response = await api.put(`/team-members/${id}`, data);
  return response.data;
};

export const deleteTeamMember = async (id) => {
  const response = await api.delete(`/team-members/${id}`);
  return response.data;
};

export const getTeamMemberSessions = async (id) => {
  const response = await api.get(`/team-members/${id}/sessions`);
  return response.data;
};