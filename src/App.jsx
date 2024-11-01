// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/ManageUsers';
import Sidebar from './components/Sidebar';
import UserNavbar from './components/Navbar';
import { Box } from '@mui/material';
import ManageTrainings from './pages/ManageTrainings';
import UserTrainings from './public/Training';
import Schedule from './pages/Schedule';
import Attendance from './pages/Attendance';
import Qualifications from './pages/Qualifications';
import AdminAttendance from './pages/AdminAttendance';
import AdminQualifications from './pages/AdminQualifications';
import PublicBookings from './public/PublicBookings';
import AdminBookings from './pages/AdminBookings';
import Profile from './public/Profile';
import Complaints from './public/Complaints';


// Layout component to conditionally render Sidebar or Navbar
const Layout = ({ children }) => {
    const userRole = localStorage.getItem('userRole');

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Show Sidebar for admin and trainer roles, Navbar for user role */}
            {userRole === 'admin' || userRole === 'trainer' ? (
                <Sidebar />
            ) : (
                userRole === 'user' && <UserNavbar /> // Show Navbar only for "user" role
            )}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {children}
            </Box>
        </Box>
    );
};

const App = () => {
    const userRole = localStorage.getItem('userRole'); // Get user role once

    return (
        <Router>
            {/* Show UserNavbar on all pages, but with additional links for "user" role */}
            <UserNavbar showUserLinks={userRole === 'user'} />
            <Routes>
                {/* Public routes without Layout */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/book-now" element={<PublicBookings />} />

                {/* Protected routes with Layout for admin, trainer, and user */}
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
                    path="/manage-trainings"
                    element={
                        <Layout>
                            <ManageTrainings />
                        </Layout>
                    }
                />
                <Route
                    path="/user-trainings"
                    element={
                        <Layout>
                            <UserTrainings />
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
                 <Route
                    path="/profile"
                    element={
                        <Layout>
                            <Profile />
                        </Layout>
                    }
                />
                <Route
                    path="/complaint"
                    element={
                        <Layout>
                            <Complaints />
                        </Layout>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
