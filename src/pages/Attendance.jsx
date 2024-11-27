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
    Checkbox,
    Snackbar,
    Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import api from '../api';

const CleanWhiteBackground = styled(Box)(({ theme }) => ({
    backgroundColor: 'white',
    minHeight: '100vh',
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
}));

const ElegantTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    marginTop: theme.spacing(3),
    maxWidth: 600,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    color: '#333',
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

const ElegantButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#CBAF37',
    color: 'white',
    fontWeight: 'bold',
    padding: theme.spacing(1.5, 4),
    borderRadius: theme.spacing(2),
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: '#A59030',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    },
    '&:disabled': {
        backgroundColor: '#E0D5A0',
        color: 'white',
    }
}));

const Attendance = () => {
    const [users, setUsers] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
    const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                const filteredUsers = response.data.filter(user => user.role === 'user');
                setUsers(filteredUsers);
                setAttendance(filteredUsers.reduce((acc, user) => ({ ...acc, [user.id]: false }), {}));
            } catch (error) {
                setSnackbar({ open: true, message: 'Failed to fetch users.', severity: 'error' });
                console.error('Failed to fetch users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleAttendanceToggle = (userId) => {
        setAttendance(prev => ({ ...prev, [userId]: !prev[userId] }));
    };

    const handleSubmitAttendance = async () => {
        const attendanceData = Object.keys(attendance).map(userId => ({
            user_id: userId,
            status: attendance[userId] ? 'present' : 'absent',
        }));
        try {
            const response = await api.post('/attendance/mark', attendanceData);
            setSnackbar({ open: true, message: response.data.message, severity: 'success' });
            setIsAttendanceMarked(response.data.message.includes('already recorded'));
        } catch (error) {
            const message = error.response?.data?.message || 'Error marking attendance.';
            setSnackbar({ open: true, message, severity: 'error' });
            console.error('Error marking attendance:', error);
        }
    };

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
                Attendance Management
            </Typography>
            <ElegantTableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>User</StyledTableCell>
                            <StyledTableCell align="right">Attendance</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id} hover>
                                <StyledTableCell component="th" scope="row">
                                    {user.name}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <Checkbox
                                        checked={attendance[user.id] || false}
                                        onChange={() => handleAttendanceToggle(user.id)}
                                        color="default"
                                        disabled={isAttendanceMarked}
                                        sx={{
                                            color: '#CBAF37',
                                            '&.Mui-checked': {
                                                color: '#CBAF37',
                                            },
                                        }}
                                    />
                                </StyledTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ElegantTableContainer>
            <ElegantButton
                variant="contained"
                onClick={handleSubmitAttendance}
                sx={{ mt: 4 }}
                disabled={isAttendanceMarked}
            >
                {isAttendanceMarked ? 'Attendance Already Marked' : 'Submit Attendance'}
            </ElegantButton>

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

export default Attendance;