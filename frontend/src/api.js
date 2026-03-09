import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getDashboardSummary = () => api.get('/dashboard/summary');

export const getEmployees = () => api.get('/employees');
export const addEmployee = (data) => api.post('/employees', data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

export const getAttendance = (employeeId) => api.get(`/attendance/${employeeId}`);
export const markAttendance = (data) => api.post('/attendance', data);

export default api;
