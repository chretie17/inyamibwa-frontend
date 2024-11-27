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

const QualificationChip = styled(Chip)(({ theme, qualification }) => ({
    fontWeight: 'bold',
    backgroundColor: qualification === 'Not Set' 
        ? 'rgba(158, 158, 158, 0.1)' 
        : 'rgba(203, 175, 55, 0.1)',
    color: qualification === 'Not Set' 
        ? '#9E9E9E' 
        : '#CBAF37',
}));

const AdminQualifications = () => {
    const [qualifications, setQualifications] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    // Fetch qualifications
    useEffect(() => {
        const fetchQualifications = async () => {
            try {
                const response = await api.get('/qualifications');
                // Sort qualifications alphabetically by user name
                const sortedQualifications = response.data.sort((a, b) => 
                    a.user_name.localeCompare(b.user_name)
                );
                setQualifications(sortedQualifications);
            } catch (error) {
                setSnackbar({ 
                    open: true, 
                    message: 'Failed to fetch qualifications.', 
                    severity: 'error' 
                });
                console.error('Error fetching qualifications:', error);
            }
        };
        fetchQualifications();
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
                User Qualifications Overview
            </Typography>
            
            <ElegantTableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>User Name</StyledTableCell>
                            <StyledTableCell align="right">Qualification</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {qualifications.map(({ user_id, user_name, qualification }) => (
                            <TableRow key={user_id} hover>
                                <StyledTableCell>{user_name}</StyledTableCell>
                                <StyledTableCell align="right">
                                    <QualificationChip 
                                        label={qualification || 'Not Set'}
                                        qualification={qualification || 'Not Set'}
                                        size="small"
                                    />
                                </StyledTableCell>
                            </TableRow>
                        ))}
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

export default AdminQualifications;