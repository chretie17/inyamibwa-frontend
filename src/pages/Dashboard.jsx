// src/pages/Dashboard.jsx
import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    // Get the user role from localStorage
    const userRole = localStorage.getItem('userRole');

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Render Sidebar for admin users, Navbar for trainers and users */}
            {userRole === 'admin' ? (
                <Sidebar />
            ) : (
                <Navbar />
            )}

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <h2>Welcome to the Dashboard</h2>
                {/* Additional dashboard content here */}
            </Box>
        </Box>
    );
};

export default Dashboard;
