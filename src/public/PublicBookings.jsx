// src/pages/PublicBooking.js

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    Snackbar,
    Alert,
} from '@mui/material';
import api from '../api';

const PublicBooking = () => {
    const [eventTypes, setEventTypes] = useState([]);
    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        phone_number: '',
        event_type_id: '',
        event_date: '',
        event_time: '',
        additional_notes: '',
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    useEffect(() => {
        const fetchEventTypes = async () => {
            try {
                const response = await api.get('/bookings/event-types');
                setEventTypes(response.data);
            } catch (error) {
                console.error('Failed to fetch event types:', error);
            }
        };
        fetchEventTypes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/book', formData);
            setSnackbar({ open: true, message: response.data.message, severity: 'success' });
            setFormData({
                user_name: '',
                user_email: '',
                phone_number: '',
                event_type_id: '',
                event_date: '',
                event_time: '',
                additional_notes: '',
            });
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to create booking', severity: 'error' });
            console.error('Booking error:', error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Book an Event</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    name="user_name"
                    label="Name"
                    value={formData.user_name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    name="user_email"
                    label="Email"
                    type="email"
                    value={formData.user_email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    name="phone_number"
                    label="Phone Number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <Select
                    name="event_type_id"
                    value={formData.event_type_id}
                    onChange={handleChange}
                    fullWidth
                    displayEmpty
                    required
                    margin="normal"
                >
                    <MenuItem value="" disabled>Select Event Type</MenuItem>
                    {eventTypes.map((event) => (
                        <MenuItem key={event.id} value={event.id}>
                            {event.event_type} - ${event.fee}
                        </MenuItem>
                    ))}
                </Select>
                <TextField
                    name="event_date"
                    label="Event Date"
                    type="date"
                    value={formData.event_date}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    required
                />
                <TextField
                    name="event_time"
                    label="Event Time"
                    type="time"
                    value={formData.event_time}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    required
                />
                <TextField
                    name="additional_notes"
                    label="Additional Notes"
                    value={formData.additional_notes}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Submit Booking
                </Button>
            </form>
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PublicBooking;
