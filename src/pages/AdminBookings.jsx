// src/pages/AdminBookings.js

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
} from '@mui/material';
import api from '../api';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [eventTypes, setEventTypes] = useState([]);
    const [newEventType, setNewEventType] = useState({ event_type: '', fee: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    // Fetch all bookings and event types on page load
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

    // Handle input change for new event type
    const handleEventTypeChange = (e) => {
        const { name, value } = e.target;
        setNewEventType((prev) => ({ ...prev, [name]: value }));
    };

    // Handle submission of a new or updated event type
    const handleAddOrUpdateEventType = async () => {
        if (!newEventType.event_type || !newEventType.fee) {
            setSnackbar({ open: true, message: 'Please fill out all fields.', severity: 'warning' });
            return;
        }
        try {
            await api.post('/bookings/event-types', newEventType);
            setSnackbar({ open: true, message: 'Event type added successfully!', severity: 'success' });
            setNewEventType({ event_type: '', fee: '' });

            // Refresh event types list
            const eventTypesResponse = await api.get('/bookings/event-types');
            setEventTypes(eventTypesResponse.data);
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to add event type.', severity: 'error' });
            console.error('Error adding event type:', error);
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ open: false, message: '', severity: '' });

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Admin - Manage Bookings and Event Types</Typography>

            {/* Section to view and add event types */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Event Types</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Event Type</TableCell>
                                <TableCell>Fee</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {eventTypes.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell>{event.event_type}</TableCell>
                                    <TableCell>${event.fee}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6">Add New Event Type</Typography>
                    <TextField
                        name="event_type"
                        label="Event Type"
                        value={newEventType.event_type}
                        onChange={handleEventTypeChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="fee"
                        label="Fee"
                        type="number"
                        value={newEventType.fee}
                        onChange={handleEventTypeChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddOrUpdateEventType}
                        sx={{ mt: 2 }}
                    >
                        Add Event Type
                    </Button>
                </Box>
            </Box>

            {/* Section to view all bookings */}
            <Typography variant="h6" gutterBottom>All Bookings</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Event Type</TableCell>
                            <TableCell>Event Date</TableCell>
                            <TableCell>Event Time</TableCell>
                            <TableCell>Fee</TableCell>
                            <TableCell>Notes</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell>{booking.user_name}</TableCell>
                                <TableCell>{booking.user_email}</TableCell>
                                <TableCell>{booking.phone_number}</TableCell>
                                <TableCell>{booking.event_type}</TableCell>
                                <TableCell>{booking.event_date}</TableCell>
                                <TableCell>{booking.event_time}</TableCell>
                                <TableCell>${booking.fee}</TableCell>
                                <TableCell>{booking.additional_notes}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminBookings;
