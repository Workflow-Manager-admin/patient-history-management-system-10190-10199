import axios from "axios";

/**
 * API client for Patient and History endpoints.
 * Uses .env variables for API_BASE_URL.
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "/api";

// Create an Axios instance with base URL and auth injection
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

// --- AUTH ---

// PUBLIC_INTERFACE
export async function loginUser({ email, password }) {
  const res = await axiosInstance.post("/auth/login", { email, password });
  return res.data;  // { token }
}

// PUBLIC_INTERFACE
export async function getMe() {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
}

// --- PATIENT ---

// PUBLIC_INTERFACE
export async function fetchPatients({ search = "", filter = {} } = {}) {
  let params = {};
  if (search) params.q = search;
  // Add filters here if needed
  const res = await axiosInstance.get("/patients", { params });
  return res.data;
}

// PUBLIC_INTERFACE
export async function fetchPatient(id) {
  const res = await axiosInstance.get(`/patients/${id}`);
  return res.data;
}

// PUBLIC_INTERFACE
export async function createPatient(data) {
  const res = await axiosInstance.post("/patients", data);
  return res.data;
}

// PUBLIC_INTERFACE
export async function updatePatient(id, data) {
  const res = await axiosInstance.put(`/patients/${id}`, data);
  return res.data;
}

/** Fetch list of patient history events */
export async function fetchPatientHistory(id) {
  const res = await axiosInstance.get(`/patients/${id}/history`);
  return res.data;
}

// PUBLIC_INTERFACE
export async function addHistoryEvent(id, data) {
  const res = await axiosInstance.post(`/patients/${id}/history`, data);
  return res.data;
}
