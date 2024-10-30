import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Snackbar,
    Alert,
} from '@mui/material';
import api from '../api';

const AdminQualifications = () => {
    const [qualifications, setQualifications] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    // Fetch qualifications
    useEffect(() => {
        const fetchQualifications = async () => {
            try {
                const response = await api.get('/qualifications');
                setQualifications(response.data);
            } catch (error) {
                setSnackbar({ open: true, message: 'Failed to fetch qualifications.', severity: 'error' });
                console.error('Error fetching qualifications:', error);
            }
        };
        fetchQualifications();
    }, []);

    const handleCloseSnackbar = () => setSnackbar({ open: false, message: '', severity: '' });

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                User Qualifications Overview
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User Name</TableCell>
                            <TableCell>Qualification</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {qualifications.map(({ user_id, user_name, qualification }) => (
                            <TableRow key={user_id}>
                                <TableCell>{user_name}</TableCell>
                                <TableCell>{qualification || 'Not Set'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminQualifications;
