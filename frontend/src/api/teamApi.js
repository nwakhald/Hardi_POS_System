import api from "./axios";

export const getTeamMembers = async () => {
  const response = await api.get("/team-members");
  return response.data;
};

export const createTeamMember = async (data) => {
  const response = await api.post("/team-members", data);
  return response.data;
};