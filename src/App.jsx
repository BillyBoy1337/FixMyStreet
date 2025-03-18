import { useState } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import PageLayout from './Layout/layout';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SimpleRegistrationForm } from './pages/RegisterPage';
import { LoginPage } from './pages/SignUpPage';
import PrivateRoute from './components/privateRoute';
import PublicRoute from './components/publicRoute';
import Dashboard from './pages/Dashboard';
import NotFoundPage from './pages/NotFoundPage';
import Reportings from './pages/Reportings';


function App() {
  localStorage.setItem('chakra-ui-color-mode', 'light');
  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/register" element={<PublicRoute><SimpleRegistrationForm /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

        <Route path="/stats" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/reporting" element={<PrivateRoute><Reportings /></PrivateRoute>} />
        <Route path="*" element={<NotFoundPage/>} />
        {/* <Route path="/test" element={<FileUpload/>} /> */}
        {/* </Route> */}
      </Routes>
    </PageLayout>
  );
}

export default App;