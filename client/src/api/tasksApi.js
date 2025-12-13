import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export async function fetchTasks() {
  const res = await axios.get(`${API_BASE}/tasks`);
  return res.data;
}

export async function createTask(payload) {
  const res = await axios.post(`${API_BASE}/tasks`, payload);
  return res.data;
}

export async function toggleTask(id) {
  const res = await axios.patch(`${API_BASE}/tasks/${id}/toggle`);
  return res.data;
}

export async function deleteTask(id) {
  await axios.delete(`${API_BASE}/tasks/${id}`);
}
