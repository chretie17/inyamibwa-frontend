import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  createTheme,
  ThemeProvider,
  Grid,
  Chip
} from '@mui/material';
import { 
  Report as ReportIcon, 
  CheckCircle as ResolvedIcon, 
  Pending as PendingIcon, 
  Cancel as RejectedIcon,
  ReportProblem as ReappealIcon
} from '@mui/icons-material';
import api from '../api';

// Custom theme with elegant color palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#5B3F00', // Rich brown
      light: '#8B6B4F',
      dark: '#3B2900'
    },
    secondary: {
      main: '#8B6B4F', // Softer brown
    },
    background: {
      default: '#FAF0E6', // Soft cream
      paper: '#FFFFFF'
    },
    status: {
      pending: '#FFA500', // Orange
      resolved: '#4CAF50', // Green
      rejected: '#F44336', // Red
      reappealed: '#9C27B0' // Purple
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 10px 25px rgba(91,63,0,0.1)',
          transition: 'all 0.3s ease'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s ease'
        }
      }
    }
  }
});

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get(`/complaints/user/${userId}`);
        setComplaints(response.data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };
    fetchComplaints();
  }, [userId]);

  const handleSubmitComplaint = async () => {
    if (!newComplaint.trim()) {
      setSnackbar({ open: true, message: 'Please enter a complaint message.', severity: 'warning' });
      return;
    }

    try {
      await api.post('/complaints/file', { user_id: userId, complaint_text: newComplaint });
      setSnackbar({ open: true, message: 'Complaint submitted successfully!', severity: 'success' });
      setNewComplaint('');
      setComplaints(prev => [...prev, { 
        complaint_text: newComplaint, 
        status: 'Pending', 
        response: '',
        created_at: new Date().toISOString()
      }]);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to submit complaint.', severity: 'error' });
      console.error('Error submitting complaint:', error);
    }
  };

  const handleReappeal = async (id) => {
    try {
      await api.post(`/complaints/reappeal/${id}`);
      setSnackbar({ open: true, message: 'Reappeal submitted!', severity: 'success' });
      setComplaints(prev => prev.map(comp => (comp.id === id ? { ...comp, status: 'Reappealed' } : comp)));
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to reappeal complaint.', severity: 'error' });
      console.error('Error reappealing complaint:', error);
    }
  };

  const handleCloseCase = async (id) => {
    try {
      await api.put(`/complaints/${id}`, { status: 'Closed' });
      setSnackbar({ open: true, message: 'Case closed successfully!', severity: 'success' });
      setComplaints(prev => prev.map(comp => (comp.id === id ? { ...comp, status: 'Closed' } : comp)));
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to close case.', severity: 'error' });
      console.error('Error closing case:', error);
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ open: false, message: '', severity: '' });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <PendingIcon color="warning" />;
      case 'Resolved': return <ResolvedIcon color="success" />;
      case 'Rejected': return <RejectedIcon color="error" />;
      case 'Reappealed': return <ReappealIcon color="secondary" />;
      default: return <ReportIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return theme.palette.status.pending;
      case 'Resolved': return theme.palette.status.resolved;
      case 'Rejected': return theme.palette.status.rejected;
      case 'Reappealed': return theme.palette.status.reappealed;
      default: return theme.palette.primary.main;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        p: 4, 
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh'
      }}>
        <Typography 
          variant="h3" 
          sx={{ 
            mb: 4, 
            color: theme.palette.primary.main, 
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(91,63,0,0.1)'
          }}
        >
          Complaint Management
        </Typography>

        <Grid container spacing={4}>
          {/* New Complaint Section */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={6} 
              sx={{ 
                p: 3, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <Box>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 'bold',
                    mb: 2
                  }}
                >
                  <ReportIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  File a New Complaint
                </Typography>
                <TextField
                  label="Complaint Details"
                  value={newComplaint}
                  onChange={(e) => setNewComplaint(e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Box>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSubmitComplaint}
                fullWidth
                sx={{ 
                  mt: 2,
                  py: 1.5
                }}
              >
                Submit Complaint
              </Button>
            </Paper>
          </Grid>

          {/* Existing Complaints Section */}
          <Grid item xs={12} md={8}>
            <Paper elevation={6}>
              <Typography 
                variant="h5" 
                sx={{ 
                  p: 3, 
                  pb: 0,
                  color: theme.palette.primary.main,
                  fontWeight: 'bold'
                }}
              >
                Previous Complaints
              </Typography>
              
              {complaints.length === 0 ? (
                <Box 
                  sx={{ 
                    p: 4, 
                    textAlign: 'center', 
                    color: theme.palette.text.secondary 
                  }}
                >
                  <ReportIcon sx={{ fontSize: 60, opacity: 0.5, mb: 2 }} />
                  <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    No complaints found. Your filed complaints will appear here.
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Complaint</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Response</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {complaints.map((complaint) => (
                        <TableRow key={complaint.id} hover>
                          <TableCell>{complaint.complaint_text}</TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(complaint.status)}
                              label={complaint.status}
                              sx={{ 
                                backgroundColor: getStatusColor(complaint.status),
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            />
                          </TableCell>
                          <TableCell>{complaint.response || 'No response yet'}</TableCell>
                          <TableCell>
                            {(complaint.status === 'Resolved' || complaint.status === 'Rejected') && (
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  size="small"
                                  onClick={() => handleReappeal(complaint.id)}
                                >
                                  Reappeal
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  onClick={() => handleCloseCase(complaint.id)}
                                >
                                  Close Case
                                </Button>
                              </Box>
                            )}
                            {(complaint.status === 'Pending' || complaint.status === 'Reappealed') && (
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleCloseCase(complaint.id)}
                              >
                                Close Case
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={3000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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

export default Complaints;