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
    styled,
} from '@mui/material';
import { motion } from 'framer-motion';
import api from '../api';

// Styled Components with updated styling for white theme
const StyledBox = styled(Box)(({ theme }) => ({
    background: '#ffffff',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    border: '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.23)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.5)',
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(0, 0, 0, 0.7)',
    },
    '& .MuiInputBase-input': {
        color: 'rgba(0, 0, 0, 0.87)',
    },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.23)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.5)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
    },
    '& .MuiSelect-select': {
        color: 'rgba(0, 0, 0, 0.87)',
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        background: `linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.main} 90%)`,
        transform: 'scale(1.02)',
    },
}));

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
            const response = await api.post('/bookings/book', formData);
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

    // Get current date for date input min attribute
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ width: '100%', maxWidth: '800px' }}
            >
                <StyledBox>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Typography 
                            variant="h4" 
                            gutterBottom 
                            sx={{ 
                                textAlign: 'center',
                                color: 'primary.main',
                                fontWeight: 'bold',
                                mb: 4
                            }}
                        >
                            Book an Event
                        </Typography>
                    </motion.div>

                    <form onSubmit={handleSubmit}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <StyledTextField
                                name="user_name"
                                label="Name"
                                value={formData.user_name}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <StyledTextField
                                name="user_email"
                                label="Email"
                                type="email"
                                value={formData.user_email}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <StyledTextField
                                name="phone_number"
                                label="Phone Number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <StyledSelect
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
                                        {event.event_type} - RWF{event.fee}
                                    </MenuItem>
                                ))}
                            </StyledSelect>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <StyledTextField
                                name="event_date"
                                label="Event Date"
                                type="date"
                                value={formData.event_date}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ min: getCurrentDate() }}
                                required
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                        >
                            <StyledTextField
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
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.0 }}
                        >
                            <StyledTextField
                                name="additional_notes"
                                label="Additional Notes"
                                value={formData.additional_notes}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                multiline
                                rows={3}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <StyledButton 
                                type="submit" 
                                variant="contained" 
                                fullWidth 
                                sx={{ mt: 3 }}
                            >
                                Submit Booking
                            </StyledButton>
                        </motion.div>
                    </form>
                </StyledBox>
            </motion.div>

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={4000} 
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity} 
                    sx={{ 
                        width: '100%',
                        backgroundColor: snackbar.severity === 'success' ? '#ffffff' : undefined,
                        color: snackbar.severity === 'success' ? 'primary.main' : undefined,
                        border: snackbar.severity === 'success' ? '1px solid rgba(0, 0, 0, 0.1)' : undefined,
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PublicBooking;