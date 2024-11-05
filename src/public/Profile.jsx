// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import api from '../api';

const Profile = () => {
    const [user, setUser] = useState({});
    const userId = localStorage.getItem('userId'); // Retrieve userId from local storage

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/public/profile', { params: { userId } });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, [userId]);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4">Profile</Typography>
            <Paper sx={{ p: 2, mt: 2 }}>
                <Typography variant="body1"><strong>Name:</strong> {user.name}</Typography>
                <Typography variant="body1"><strong>Email:</strong> {user.email}</Typography>
                <Typography variant="body1"><strong>Role:</strong> {user.role}</Typography>
                <Typography variant="body1"><strong>Qualifications:</strong> {user.qualifications}</Typography>
            </Paper>
        </Box>
    );
};

export default Profile;
