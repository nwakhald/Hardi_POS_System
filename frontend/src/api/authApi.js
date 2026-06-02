import api from "./axios";

export const login = async (email, password) => {
  const response = await api.post("/login", {
    email,
    password,
  });

  return response.data;
};

export const logout = async () => {
  const response = await api.post("/logout");

  return response.data;
};

export const getUser = async () => {
  const response = await api.get("/user");

  return response.data;
};