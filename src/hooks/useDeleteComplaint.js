import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useComplaintStore from '@/store/useComplaintStore';
import useShowToast from './useShowToast';

const useDeleteComplaint = () => {
  const showToast = useShowToast();
  const { deleteComplaint, loading, error } = useComplaintStore();
  const navigate = useNavigate();

  const handleDeleteComplaint = async (complaintID, userID) => {
    try {
      await deleteComplaint(complaintID,userID);
      showToast("Success", "Complaint deleted successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
      if (error.message === 'No token found' || error.message === 'Invalid token') {
        navigate('/login');
      }
    }
  };

  return { handleDeleteComplaint, loading, error };
};

export default useDeleteComplaint;