// src/pages/AdminComplaints.js
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
    Button,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import api from '../api';

const AdminComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [responseText, setResponseText] = useState('');

    // Fetch all complaints on component load
    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await api.get('/complaints');
                setComplaints(response.data);
            } catch (error) {
                setSnackbar({ open: true, message: 'Failed to fetch complaints.', severity: 'error' });
                console.error('Error fetching complaints:', error);
            }
        };
        fetchComplaints();
    }, []);

    // Open response dialog
    const handleOpenDialog = (complaint) => {
        setSelectedComplaint(complaint);
        setResponseText('');
        setOpenDialog(true);
    };

    // Close response dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedComplaint(null);
    };

    // Handle status and response update for complaints
    const handleUpdateComplaint = async (status) => {
        try {
            await api.put(`/complaints/${selectedComplaint.id}`, { status, response: responseText });
            setComplaints(complaints.map(complaint =>
                complaint.id === selectedComplaint.id ? { ...complaint, status, response: responseText } : complaint
            ));
            setSnackbar({ open: true, message: `Complaint ${status} successfully`, severity: 'success' });
            handleCloseDialog();
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to update complaint.', severity: 'error' });
            console.error('Error updating complaint:', error);
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ open: false, message: '', severity: '' });

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Manage Complaints
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User Name</TableCell>
                            <TableCell>Complaint</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Submitted On</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {complaints.length > 0 ? (
                            complaints.map(({ id, user_name, complaint_text, status, created_at }) => (
                                <TableRow key={id}>
                                    <TableCell>{user_name}</TableCell>
                                    <TableCell>{complaint_text}</TableCell>
                                    <TableCell>
                                        <Typography
                                            sx={{
                                                color:
                                                    status === 'pending' ? 'orange' :
                                                    status === 'resolved' ? 'green' :
                                                    status === 'rejected' ? 'red' :
                                                    status === 'reappealed' ? 'blue' : 'black'
                                            }}
                                        >
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{new Date(created_at).toLocaleString()}</TableCell>
                                    <TableCell>
                                        {(status === 'pending' || status === 'reappealed') ? (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => handleOpenDialog({ id, status: 'resolved' })}
                                                    sx={{ mr: 1 }}
                                                >
                                                    Resolve
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleOpenDialog({ id, status: 'rejected' })}
                                                >
                                                    Reject
                                                </Button>
                                            </>
                                        ) : (
                                            <Typography variant="body2" sx={{ color: 'gray' }}>
                                                No Actions
                                            </Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No complaints found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for Adding Response */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Add Response to Complaint</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Response"
                        fullWidth
                        multiline
                        rows={4}
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        variant="outlined"
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleUpdateComplaint(selectedComplaint.status)} color="success" variant="contained">
                        {selectedComplaint?.status === 'resolved' ? 'Resolve' : 'Reject'}
                    </Button>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminComplaints;
