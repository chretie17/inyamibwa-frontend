import React, { useState, useEffect } from 'react';
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
    TextField,
    Button,
    Snackbar,
    Alert,
    Container,
    Card,
    CardContent,
    CardHeader,
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
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    borderRadius: 12,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
                    },
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
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& label.Mui-focused': {
                        color: '#CBAF37',
                    },
                    '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                            borderColor: '#CBAF37',
                        },
                    },
                },
            },
        },
    },
});

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [eventTypes, setEventTypes] = useState([]);
    const [newEventType, setNewEventType] = useState({ event_type: '', fee: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookingsResponse = await api.get('/bookings');
                const eventTypesResponse = await api.get('/bookings/event-types');
                setBookings(bookingsResponse.data);
                setEventTypes(eventTypesResponse.data);
            } catch (error) {
                setSnackbar({ open: true, message: 'Failed to fetch data.', severity: 'error' });
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleEventTypeChange = (e) => {
        const { name, value } = e.target;
        setNewEventType((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddOrUpdateEventType = async () => {
        if (!newEventType.event_type || !newEventType.fee) {
            setSnackbar({ open: true, message: 'Please fill out all fields.', severity: 'warning' });
            return;
        }
        try {
            await api.post('/bookings/event-types', newEventType);
            setSnackbar({ open: true, message: 'Event type added successfully!', severity: 'success' });
            setNewEventType({ event_type: '', fee: '' });

            const eventTypesResponse = await api.get('/bookings/event-types');
            setEventTypes(eventTypesResponse.data);
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to add event type.', severity: 'error' });
            console.error('Error adding event type:', error);
        }
    };

    const handleBookingAction = async (id, action) => {
        try {
            const response = await api.put(`/bookings/${action}/${id}`);
            setSnackbar({ open: true, message: response.data.message, severity: 'success' });

            const bookingsResponse = await api.get('/bookings');
            setBookings(bookingsResponse.data);
        } catch (error) {
            setSnackbar({ open: true, message: `Failed to ${action} booking.`, severity: 'error' });
            console.error(`Error ${action}ing booking:`, error);
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ open: false, message: '', severity: '' });

    return (
        <ThemeProvider theme={elegantTheme}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
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
                    Event Management
                </Typography>

                <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
                    <Card sx={{ flex: 1 }}>
                        <CardHeader 
                            title="Event Types" 
                            titleTypographyProps={{ 
                                variant: 'h6', 
                                color: 'primary',
                                sx: { fontWeight: 700 }
                            }}
                        />
                        <CardContent>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Event Type</TableCell>
                                            <TableCell align="right">Fee</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {eventTypes.map((event) => (
                                            <TableRow key={event.id} hover>
                                                <TableCell>{event.event_type}</TableCell>
                                                <TableCell align="right">Rwf {event.fee}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>

                    <Card sx={{ flex: 1 }}>
                        <CardHeader 
                            title="Add New Event Type" 
                            titleTypographyProps={{ 
                                variant: 'h6', 
                                color: 'primary',
                                sx: { fontWeight: 700 }
                            }}
                        />
                        <CardContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    name="event_type"
                                    label="Event Type"
                                    value={newEventType.event_type}
                                    onChange={handleEventTypeChange}
                                    fullWidth
                                    variant="outlined"
                                    required
                                />
                                <TextField
                                    name="fee"
                                    label="Fee"
                                    type="number"
                                    value={newEventType.fee}
                                    onChange={handleEventTypeChange}
                                    fullWidth
                                    variant="outlined"
                                    required
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddOrUpdateEventType}
                                    sx={{ alignSelf: 'flex-start' }}
                                >
                                    Add Event Type
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                <Card>
                    <CardHeader 
                        title="All Bookings" 
                        titleTypographyProps={{ 
                            variant: 'h6', 
                            color: 'primary',
                            sx: { fontWeight: 700 }
                        }}
                    />
                    <CardContent>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {['Name', 'Email', 'Phone', 'Event Type', 'Event Date', 
                                          'Event Time', 'Fee', 'Notes', 'Status', 'Actions'].map((header) => (
                                            <TableCell key={header}>{header}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {bookings.map((booking) => (
                                        <TableRow key={booking.id} hover>
                                            <TableCell>{booking.user_name}</TableCell>
                                            <TableCell>{booking.user_email}</TableCell>
                                            <TableCell>{booking.phone_number}</TableCell>
                                            <TableCell>{booking.event_type}</TableCell>
                                            <TableCell>{booking.event_date}</TableCell>
                                            <TableCell>{booking.event_time}</TableCell>
                                            <TableCell>Rwf {booking.fee}</TableCell>
                                            <TableCell>{booking.additional_notes}</TableCell>
                                            <TableCell>{booking.status || 'Pending'}</TableCell>
                                            <TableCell>
                                                {booking.status === 'pending' && (
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            size="small"
                                                            onClick={() => handleBookingAction(booking.id, 'approve')}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleBookingAction(booking.id, 'reject')}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </Box>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>

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
            </Container>
        </ThemeProvider>
    );
};

export default AdminBookings;