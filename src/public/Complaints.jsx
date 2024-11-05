// src/pages/Complaints.js
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
} from '@mui/material';
import api from '../api';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const userId = localStorage.getItem('userId'); // Get user ID from local storage

  // Fetch complaints
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

  // Handle new complaint submission
  const handleSubmitComplaint = async () => {
    if (!newComplaint) {
      setSnackbar({ open: true, message: 'Please enter a complaint message.', severity: 'warning' });
      return;
    }

    try {
      await api.post('/complaints/file', { user_id: userId, complaint_text: newComplaint });
      setSnackbar({ open: true, message: 'Complaint submitted successfully!', severity: 'success' });
      setNewComplaint('');
      setComplaints(prev => [...prev, { complaint_text: newComplaint, status: 'Pending', response: '' }]);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to submit complaint.', severity: 'error' });
      console.error('Error submitting complaint:', error);
    }
  };

  // Handle reappeal
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

  // Handle closing the case
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

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Complaints
      </Typography>

      {/* New Complaint Form */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          File a New Complaint
        </Typography>
        <TextField
          label="Complaint Message"
          value={newComplaint}
          onChange={(e) => setNewComplaint(e.target.value)}
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSubmitComplaint}>
          Submit Complaint
        </Button>
      </Box>

      {/* Existing Complaints Table */}
      <Typography variant="h6" gutterBottom>
        Previous Complaints
      </Typography>
      {complaints.length === 0 ? (
        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
          No complaints found. Your filed complaints will appear here.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
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
                <TableRow key={complaint.id}>
                  <TableCell>{complaint.complaint_text}</TableCell>
                  <TableCell>{complaint.status}</TableCell>
                  <TableCell>{complaint.response || 'No response yet'}</TableCell>
                  <TableCell>
                    {complaint.status === 'Resolved' || complaint.status === 'Rejected' ? (
                      <>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleReappeal(complaint.id)}
                          sx={{ mr: 1 }}
                        >
                          Reappeal
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleCloseCase(complaint.id)}
                        >
                          Close Case
                        </Button>
                      </>
                    ) : complaint.status === 'Pending' || complaint.status === 'Reappealed' ? (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleCloseCase(complaint.id)}
                      >
                        Close Case
                      </Button>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Complaints;
