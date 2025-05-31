import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const register = (data: any) => axios.post(`${API_URL}/auth/register`, data);
export const login = (data: any) => axios.post(`${API_URL}/auth/login`, data);

export const getProposals = (token: string) =>
  axios.get(`${API_URL}/proposals`, { headers: { Authorization: `Bearer ${token}` } });

export const createProposal = async (data: any, token: string) =>
  axios.post(
    "http://localhost:5000/api/proposals",
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const updateProposal = (id: string, data: any, token: string) =>
  axios.put(`${API_URL}/proposals/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });

export const deleteProposal = (id: string, token: string) =>
  axios.delete(`${API_URL}/proposals/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export const downloadProposalPDF = (id: string, token: string) =>
  axios.get(`${API_URL}/proposals/${id}/pdf`, { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' });

export const downloadProposalDOCX = (id: string, token: string) =>
  axios.get(`${API_URL}/proposals/${id}/docx`, { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' });