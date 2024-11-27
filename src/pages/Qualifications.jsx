import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    Button,
    Snackbar,
    Alert,
    ThemeProvider,
    createTheme,
    Fade,
    CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { BookmarkBorder, BookmarkAdd, School } from '@mui/icons-material';
import api from '../api';

// Enhanced custom theme with refined golden accent and improved color harmony
const theme = createTheme({
    palette: {
        primary: {
            main: '#CBAF37', // Golden accent
            light: '#E7D194',
            dark: '#AB8F2F',
            contrastText: '#FFFFFF'
        },
        secondary: {
            main: '#2C3E50', // Dark blue-grey for contrast
        },
        background: {
            default: '#F4F6F8',
            paper: '#FFFFFF'
        },
        text: {
            primary: '#2C3E50',
            secondary: '#576573'
        },
        action: {
            hover: 'rgba(203, 175, 55, 0.08)',
            selected: 'rgba(203, 175, 55, 0.16)'
        }
    },
    typography: {
        fontFamily: 'Inter, Roboto, Arial, sans-serif',
        h4: {
            fontWeight: 600,
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
        },
        body1: {
            fontWeight: 500
        }
    },
    shape: {
        borderRadius: 12
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: '#CBAF37',
                    color: 'white',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    borderBottom: '2px solid rgba(0,0,0,0.1)'
                },
                root: {
                    borderBottom: '1px solid rgba(224, 224, 224, 1)'
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(203, 175, 55, 0.05)'
                    }
                },
                icon: {
                    color: '#CBAF37'
                }
            }
        }
    }
});

// Enhanced styled components with more sophisticated animations
const StyledPaper = styled(Paper)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.12)'
    }
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    fontWeight: 600,
    textTransform: 'none',
    padding: '8px 16px',
    transition: 'all 0.3s ease',
    '& .MuiButton-startIcon': {
        marginRight: 8
    },
    '&:hover': {
        transform: 'scale(1.05)',
        backgroundColor: theme.palette.primary.dark
    }
}));

const Qualifications = () => {
    const [qualifications, setQualifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ 
        open: false, 
        message: '', 
        severity: 'info' 
    });

    useEffect(() => {
        const fetchQualifications = async () => {
            try {
                setLoading(true);
                const response = await api.get('/qualifications');
                setQualifications(response.data);
                setLoading(false);
            } catch (error) {
                setSnackbar({ 
                    open: true, 
                    message: 'Failed to fetch qualifications.', 
                    severity: 'error' 
                });
                setLoading(false);
                console.error('Error fetching qualifications:', error);
            }
        };
        fetchQualifications();
    }, []);

    const handleQualificationChange = (userId, newQualification) => {
        setQualifications(prevQualifications =>
            prevQualifications.map(q =>
                q.user_id === userId ? { ...q, qualification: newQualification } : q
            )
        );
    };

    const handleUpdateQualification = async (userId, qualification) => {
        try {
            await api.post('/qualifications', { user_id: userId, qualification });
            setSnackbar({ 
                open: true, 
                message: 'Qualification updated successfully!', 
                severity: 'success' 
            });
        } catch (error) {
            setSnackbar({ 
                open: true, 
                message: 'Failed to update qualification.', 
                severity: 'error' 
            });
            console.error('Error updating qualification:', error);
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ 
        open: false, 
        message: '', 
        severity: 'info' 
    });

    const qualificationLevels = useMemo(() => [
        { value: 'Beginner', icon: <BookmarkBorder /> },
        { value: 'Intermediate', icon: <BookmarkAdd /> },
        { value: 'Expert', icon: <School /> }
    ], []);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ 
                p: { xs: 2, md: 4 }, 
                backgroundColor: theme.palette.background.default,
                minHeight: '100vh'
            }}>
                <Typography 
                    variant="h4" 
                    gutterBottom 
                    sx={{ 
                        mb: 4, 
                        textAlign: 'center',
                        backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    User Qualifications Management
                </Typography>
                <StyledPaper elevation={3}>
                    {loading ? (
                        <Box 
                            display="flex" 
                            justifyContent="center" 
                            alignItems="center" 
                            height={400}
                        >
                            <CircularProgress color="primary" size={60} thickness={4} />
                        </Box>
                    ) : (
                        <Fade in={!loading}>
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>User Name</TableCell>
                                            <TableCell>Qualification Level</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {qualifications.map(({ user_id, user_name, qualification }) => (
                                            <TableRow 
                                                key={user_id}
                                                hover
                                                sx={{ 
                                                    '&:last-child td, &:last-child th': { border: 0 },
                                                    transition: 'background-color 0.3s ease'
                                                }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {user_name}
                                                </TableCell>
                                                <TableCell>
                                                    <Select
                                                        value={qualification || ''}
                                                        onChange={(e) => handleQualificationChange(user_id, e.target.value)}
                                                        fullWidth
                                                        variant="outlined"
                                                        startAdornment={
                                                            qualificationLevels.find(
                                                                level => level.value === qualification
                                                            )?.icon
                                                        }
                                                    >
                                                        {qualificationLevels.map(level => (
                                                            <MenuItem 
                                                                key={level.value} 
                                                                value={level.value}
                                                            >
                                                                {level.icon}
                                                                <Box ml={1}>{level.value}</Box>
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <AnimatedButton
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<BookmarkAdd />}
                                                        onClick={() => handleUpdateQualification(user_id, qualification)}
                                                    >
                                                        Update
                                                    </AnimatedButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Fade>
                    )}
                </StyledPaper>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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

export default Qualifications;