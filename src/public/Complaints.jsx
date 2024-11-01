// src/pages/Complaint.js
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import api from '../api';

const Complaint = () => {
    const [complaint, setComplaint] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    const handleSubmitComplaint = async () => {
        try {
            await api.post('/complaint', { complaint });
            setSnackbar({ open: true, message: 'Complaint submitted successfully!', severity: 'success' });
            setComplaint('');
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to submit complaint.', severity: 'error' });
            console.error('Error submitting complaint:', error);
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ open: false, message: '', severity: '' });

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4">File a Complaint</Typography>
            <TextField
                label="Complaint"
                multiline
                rows={4}
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ mt: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleSubmitComplaint} sx={{ mt: 2 }}>
                Submit Complaint
            </Button>

            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Complaint;
