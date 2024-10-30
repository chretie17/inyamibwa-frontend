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
import Attendance from './pages/Attendance';
import Qualifications from './pages/Qualifications';
import AdminAttendance from './pages/AdminAttendance';
import AdminQualifications from './pages/AdminQualifications';
import PublicBookings from './public/PublicBookings';
import AdminBookings from './pages/AdminBookings';

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
                <Route path="/book-now" element={<PublicBookings />} />


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
                    path="/adminbookings"
                    element={
                        <Layout>
                            <AdminBookings />
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
                  <Route
                    path="/attendance"
                    element={
                        <Layout>
                            <Attendance />
                        </Layout>
                    }
                />
                  <Route
                    path="/qualifications"
                    element={
                        <Layout>
                            <Qualifications />
                        </Layout>
                    }
                />
                <Route
                    path="/adminqualifications"
                    element={
                        <Layout>
                            <AdminQualifications />
                        </Layout>
                    }
                />
                 <Route
                    path="/adminattendance"
                    element={
                        <Layout>
                            <AdminAttendance />
                        </Layout>
                    }
                />
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
};

export default App;
