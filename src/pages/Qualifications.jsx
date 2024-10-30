import React, { useState, useEffect } from 'react';
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
    Select,
    MenuItem,
    Button,
    Snackbar,
    Alert,
} from '@mui/material';
import api from '../api';

const Qualifications = () => {
    const [qualifications, setQualifications] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    // Fetch existing qualifications
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

    // Update qualification in local state
    const handleQualificationChange = (userId, newQualification) => {
        setQualifications(prevQualifications =>
            prevQualifications.map(q =>
                q.user_id === userId ? { ...q, qualification: newQualification } : q
            )
        );
    };

    // Submit updated qualification to the server
    const handleUpdateQualification = async (userId, qualification) => {
        try {
            await api.post('/qualifications', { user_id: userId, qualification });
            setSnackbar({ open: true, message: 'Qualification updated successfully!', severity: 'success' });
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to update qualification.', severity: 'error' });
            console.error('Error updating qualification:', error);
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ open: false, message: '', severity: '' });

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Manage User Qualifications
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User Name</TableCell>
                            <TableCell>Qualification</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {qualifications.map(({ user_id, user_name, qualification }) => (
                            <TableRow key={user_id}>
                                <TableCell>{user_name}</TableCell>
                                <TableCell>
                                    <Select
                                        value={qualification || ''}
                                        onChange={(e) => handleQualificationChange(user_id, e.target.value)}
                                        fullWidth
                                    >
                                        <MenuItem value="Beginner">Beginner</MenuItem>
                                        <MenuItem value="Intermediate">Intermediate</MenuItem>
                                        <MenuItem value="Expert">Expert</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleUpdateQualification(user_id, qualification)}
                                    >
                                        Update
                                    </Button>
                                </TableCell>
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

export default Qualifications;
