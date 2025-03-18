import { useState } from "react";
import axios from "axios";
import useShowToast from "@/hooks/useShowToast";
import { API_BASE_URL } from "@/constants";

const useUpdateComplaint = () => {
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateComplaint = async (complaintID, formData) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE_URL}/api/complaints/${complaintID}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        showToast("Success", "Complaint updated successfully", "success");
      } else {
        showToast("Error", "Failed to update complaint", "error");
      }
    } catch (error) {
        console.log(error)
      setError(error.message);
      showToast("Error", error.response?.data?.message || error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, updateComplaint };
};

export default useUpdateComplaint;