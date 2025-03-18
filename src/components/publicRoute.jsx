import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Check if the token is stored in local storage

  return token ? <Navigate to="/" /> : children;
};

export default PublicRoute;