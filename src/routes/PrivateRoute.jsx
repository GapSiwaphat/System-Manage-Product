import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
    const { isAuthenticated } = useAuth(); 

    if (isAuthenticated) {
        return <Outlet />; 
    } 
    return <Navigate to="/login" replace />; 
};

export default PrivateRoute;