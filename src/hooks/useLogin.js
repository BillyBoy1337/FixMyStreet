import { useState } from 'react';
import axios from 'axios';
import useShowToast from './useShowToast';
import { API_BASE_URL } from '@/constants';
import useAuthStore from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

const useLogin = () => {
  const showToast = useShowToast();
  const loginUser = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const login = async (inputs) => {
    if (!inputs.email || !inputs.password) {
      return showToast('Error', 'Please fill all the fields', 'error');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, inputs);
      if (response.status === 200) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        loginUser(user);
        showToast('Success', 'Logged in successfully', 'success');
        navigate('/');
      } else if (response.status === 401) {
        showToast('Error', 'Invalid credentials', 'error');
      }
    } catch (error) {
        if (error.response.status === 401) {
            setError("Invalid credentials")
          showToast('Error', 'Invalid credentials', 'error');
        }else if (error.response.status === 404) {
            setError("User not found")
          showToast('Error', 'User not found', 'error');
        }else{
            setError(error.message);
            showToast('Error', error.response.data.error +" "+ error.message , 'error');
            }
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, login };
};

export default useLogin;