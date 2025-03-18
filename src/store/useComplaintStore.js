import { create } from "zustand";
import axios from 'axios';
import { API_BASE_URL } from '@/constants';
import fetchComplaints from "@/hooks/useComplaints";

const useComplaintStore = create((set) => ({
  complaints: [],
  loading: false,
  error: null,

  fetchComplaints: async () => {
    set({ loading: true, error: null });
    try {
      const complaints = await fetchComplaints();
      set({ complaints, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addComplaint: async (formData) => {
    set({ loading: true, error: null });
    const token = localStorage.getItem('token');
    if (!token) {
      set({ error: 'No token found', loading: false });
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/complaints/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      set((state) => ({
        complaints: [response.data, ...state.complaints],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteComplaint: async (complaintID, userID) => {
    set({ loading: true, error: null });
    const token = localStorage.getItem('token');
    if (!token) {
      set({ error: 'No token found', loading: false });
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/complaints/${complaintID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: { userID }, // Include userID in the data payload
      });
      set((state) => ({
        complaints: state.complaints.filter((complaint) => complaint.id !== complaintID),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useComplaintStore;