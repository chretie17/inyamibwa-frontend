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
    Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import api from '../api';

const CleanWhiteBackground = styled(Box)(({ theme }) => ({
    backgroundColor: 'white',
    minHeight: '100vh',
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
}));

const ElegantTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    marginTop: theme.spacing(3),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    color: '#333',
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
    fontWeight: 'bold',
    backgroundColor: status === 'present' 
        ? 'rgba(76, 175, 80, 0.1)' 
        : 'rgba(244, 67, 54, 0.1)',
    color: status === 'present' 
        ? '#4CAF50' 
        : '#F44336',
}));

const AdminAttendance = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    useEffect(() => {
        const fetchAttendanceRecords = async () => {
            try {
                const response = await api.get('/attendance/all');
                // Sort records by date, most recent first
                const sortedRecords = response.data.sort((a, b) => 
                    new Date(b.date) - new Date(a.date)
                );
                setAttendanceRecords(sortedRecords);
            } catch (error) {
                setSnackbar({ 
                    open: true, 
                    message: 'Failed to fetch attendance records.', 
                    severity: 'error' 
                });
                console.error('Error fetching attendance:', error);
            }
        };
        fetchAttendanceRecords();
    }, []);

    const handleCloseSnackbar = () => setSnackbar({ open: false, message: '', severity: '' });

    return (
        <CleanWhiteBackground>
            <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                    color: '#333', 
                    fontWeight: 'bold', 
                    mb: 4 
                }}
            >
                Attendance Records
            </Typography>
            
            <ElegantTableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>User Name</StyledTableCell>
                            <StyledTableCell>Date</StyledTableCell>
                            <StyledTableCell align="right">Status</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attendanceRecords.length > 0 ? (
                            attendanceRecords.map(record => (
                                <TableRow key={record.id} hover>
                                    <StyledTableCell>{record.user_name}</StyledTableCell>
                                    <StyledTableCell>
                                        {new Date(record.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        <StatusChip 
                                            label={record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                            status={record.status}
                                            size="small"
                                        />
                                    </StyledTableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <StyledTableCell colSpan={3} align="center">
                                    No attendance records found.
                                </StyledTableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ElegantTableContainer>

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={3000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity} 
                    sx={{ 
                        width: '100%',
                        backgroundColor: snackbar.severity === 'error' ? '#ff4444' : '#00C851',
                        color: 'white'
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </CleanWhiteBackground>
    );
};

export default AdminAttendance;