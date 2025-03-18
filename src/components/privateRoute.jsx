import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Check if the token is stored in local storage

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;