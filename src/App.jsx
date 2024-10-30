// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/ManageUsers';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { Box } from '@mui/material';
import Trainings from './pages/Trainings';
import Schedule from './pages/Schedule';

// Layout component directly inside App.jsx
const Layout = ({ children }) => {
    const userRole = localStorage.getItem('userRole');

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Show Sidebar for admin and trainer roles, Navbar for regular users */}
            {userRole === 'admin' || userRole === 'trainer' ? (
                <Sidebar />
            ) : (
                <Navbar />
            )}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {children}
            </Box>
        </Box>
    );
};

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public routes without Layout */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />

                {/* Protected routes with Layout for admin and trainer */}
                <Route
                    path="/dashboard"
                    element={
                        <Layout>
                            <Dashboard />
                        </Layout>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <Layout>
                            <ManageUsers />
                        </Layout>
                    }
                />
                <Route
                    path="/trainings"
                    element={
                        <Layout>
                            <Trainings />
                        </Layout>
                    }
                />
                <Route
                    path="/schedule"
                    element={
                        <Layout>
                            <Schedule />
                        </Layout>
                    }
                />
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
};

export default App;
