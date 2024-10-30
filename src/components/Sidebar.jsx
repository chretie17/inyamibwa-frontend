// src/components/Sidebar.jsx
import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, Box, Typography, Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('username'); // Assuming username is saved in localStorage on login
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 240,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 240,
                    boxSizing: 'border-box',
                    backgroundColor: '#f4f6f8',
                    color: '#333',
                },
            }}
        >
            <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h6">{username}</Typography>
                <Typography variant="subtitle2" color="textSecondary">
                    Role: {userRole}
                </Typography>
            </Box>
            <Divider />
            <List>
                {/* Common Sidebar Items */}
                <ListItem button onClick={() => navigate('/dashboard')}>
                    <ListItemIcon><DashboardIcon /></ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button onClick={() => navigate('/trainings')}>
                    <ListItemIcon><AssignmentIcon /></ListItemIcon>
                    <ListItemText primary="Trainings" />
                </ListItem>
                <ListItem button onClick={() => navigate('/schedule')}>
                    <ListItemIcon><AssignmentIcon /></ListItemIcon>
                    <ListItemText primary="Schedule" />
                </ListItem>
                {/* Conditional Items Based on Role */}
                {userRole === 'admin' && (
                    <>
                        <ListItem button onClick={() => navigate('/users')}>
                            <ListItemIcon><PeopleIcon /></ListItemIcon>
                            <ListItemText primary="Users" />
                        </ListItem>
                        <ListItem button onClick={() => navigate('/complaints')}>
                            <ListItemIcon><ReportProblemIcon /></ListItemIcon>
                            <ListItemText primary="Complaints" />
                        </ListItem>
                    </>
                )}

                {userRole === 'trainer' && (
                    <ListItem button onClick={() => navigate('/attendance')}>
                        <ListItemIcon><SchoolIcon /></ListItemIcon>
                        <ListItemText primary="Attendance" />
                    </ListItem>
                )}
            </List>
            <Divider />
            <Box sx={{ textAlign: 'center', mt: 'auto', mb: 2, px: 2 }}>
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    fullWidth
                >
                    Logout
                </Button>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
