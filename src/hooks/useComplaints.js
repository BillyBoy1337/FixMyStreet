import axios from 'axios';
import { API_BASE_URL } from '@/constants';
import { useNavigate } from 'react-router-dom';

const fetchComplaints = async () => {
  // const navigate = useNavigate();
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/api/complaints/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.error === 'invalid token') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // throw new Error('Invalid token');
      // navigate('/');


    } else {
      throw error;
    }
  }
};

export default fetchComplaints;