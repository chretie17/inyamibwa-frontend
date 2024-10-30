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
import api from '../api';

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
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Attendance Management
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Attendance</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>
                                    <Checkbox
                                        checked={attendance[user.id] || false}
                                        onChange={() => handleAttendanceToggle(user.id)}
                                        color="primary"
                                        disabled={isAttendanceMarked}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitAttendance}
                sx={{ mt: 3 }}
                disabled={isAttendanceMarked}
            >
                {isAttendanceMarked ? 'Attendance Already Marked' : 'Submit Attendance'}
            </Button>

            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Attendance;
