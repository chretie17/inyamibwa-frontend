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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import api from '../api';

// Elegant Theme with Golden Accent
const elegantTheme = createTheme({
    typography: {
        fontFamily: '"Neue Haas Grotesk", "Helvetica", "Arial", sans-serif',
    },
    palette: {
        mode: 'light',
        primary: {
            main: '#CBAF37', // Golden accent color
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#FFFFFF',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#333333',
            secondary: '#666666',
        },
        action: {
            hover: 'rgba(203, 175, 55, 0.08)', // Soft golden hover
        },
        success: {
            main: '#4CAF50',
        },
        error: {
            main: '#F44336',
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    borderRadius: 12,
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: '#F5F5F5',
                    color: '#333333',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '10px 20px',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 12,
                },
            },
        },
    },
});

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

    // Status color mapping
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'orange';
            case 'resolved': return 'green';
            case 'rejected': return 'red';
            case 'reappealed': return 'blue';
            default: return 'black';
        }
    };

    return (
        <ThemeProvider theme={elegantTheme}>
            <Box sx={{ p: 4 }}>
                <Typography 
                    variant="h3" 
                    gutterBottom 
                    sx={{ 
                        textAlign: 'center', 
                        mb: 4,
                        fontWeight: 700,
                        color: '#333333',
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -10,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 100,
                            height: 4,
                            backgroundColor: '#CBAF37'
                        }
                    }}
                >
                    Complaints Management
                </Typography>

                <Paper elevation={2} sx={{ borderRadius: 2 }}>
                    <TableContainer>
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
                                        <TableRow key={id} hover>
                                            <TableCell>{user_name}</TableCell>
                                            <TableCell>{complaint_text}</TableCell>
                                            <TableCell>
                                                <Typography
                                                    sx={{
                                                        color: getStatusColor(status),
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(created_at).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                {(status === 'pending' || status === 'reappealed') ? (
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            size="small"
                                                            onClick={() => handleOpenDialog({ id, status: 'resolved' })}
                                                        >
                                                            Resolve
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleOpenDialog({ id, status: 'rejected' })}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </Box>
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
                                            <Typography variant="body1" sx={{ color: 'gray', py: 2 }}>
                                                No complaints found.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {/* Dialog for Adding Response */}
                <Dialog 
                    open={openDialog} 
                    onClose={handleCloseDialog} 
                    maxWidth="sm" 
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                        }
                    }}
                >
                    <DialogTitle sx={{ fontWeight: 700, color: '#333333' }}>
                        Add Response to Complaint
                    </DialogTitle>
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
                        <Button 
                            onClick={() => handleUpdateComplaint(selectedComplaint.status)} 
                            color="success" 
                            variant="contained"
                        >
                            {selectedComplaint?.status === 'resolved' ? 'Resolve' : 'Reject'}
                        </Button>
                        <Button 
                            onClick={handleCloseDialog} 
                            color="secondary" 
                            variant="outlined"
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar 
                    open={snackbar.open} 
                    autoHideDuration={3000} 
                    onClose={handleCloseSnackbar}
                >
                    <Alert 
                        onClose={handleCloseSnackbar} 
                        severity={snackbar.severity} 
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
};

export default AdminComplaints;