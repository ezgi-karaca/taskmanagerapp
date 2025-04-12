import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
});

export const login = (data) => API.post("/auth/login", data);

export default API;
