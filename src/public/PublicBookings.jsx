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
    Container,
    Paper,
    useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
    CoffeeOutlined as CoffeeIcon, 
    SendOutlined as SendIcon 
} from '@mui/icons-material';
import api from '../api';

// Chocolate Color Palette
const chocolateTheme = {
    primary: '#6F4E37',      // Rich Coffee Brown
    secondary: '#D2691E',    // Chocolate Depth
    background: '#F5DEB3',   // Wheat/Cream
    text: '#3E2723',         // Dark Chocolate
    accent: '#8B4513'        // Saddle Brown
};

const PublicBooking = () => {
    const theme = useTheme();
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
    const [snackbar, setSnackbar] = useState({ 
        open: false, 
        message: '', 
        severity: 'success' 
    });

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
            setSnackbar({ 
                open: true, 
                message: response.data.message, 
                severity: 'success' 
            });
            // Reset form
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
            setSnackbar({ 
                open: true, 
                message: 'Failed to create booking', 
                severity: 'error' 
            });
        }
    };

    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                type: "spring", 
                stiffness: 50,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                type: "spring", 
                stiffness: 100 
            }
        }
    };

    return (
        <Box 
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${chocolateTheme.background} 0%, #FFF3E0 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: theme.spacing(4),
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Decorative Coffee Bean Background */}
            <Box 
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.05,
                    backgroundImage: `
                        radial-gradient(${chocolateTheme.primary} 10%, transparent 11%),
                        radial-gradient(${chocolateTheme.primary} 10%, transparent 11%)
                    `,
                    backgroundSize: '30px 30px',
                    backgroundPosition: '0 0, 15px 15px'
                }}
            />

            <Container maxWidth="sm">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={formVariants}
                >
                    <Paper 
                        elevation={12}
                        sx={{
                            borderRadius: theme.spacing(3),
                            background: 'rgba(255,255,255,0.9)',
                            padding: theme.spacing(4),
                            boxShadow: `0 16px 32px rgba(${chocolateTheme.text}, 0.2)`,
                            border: `2px solid ${chocolateTheme.primary}`
                        }}
                    >
                        <motion.div variants={itemVariants}>
                            <Typography 
                                variant="h4" 
                                align="center" 
                                gutterBottom
                                sx={{
                                    color: chocolateTheme.primary,
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: theme.spacing(3)
                                }}
                            >
                                <CoffeeIcon 
                                    sx={{ 
                                        marginRight: theme.spacing(2), 
                                        color: chocolateTheme.secondary 
                                    }} 
                                />
                                Book Your Event
                            </Typography>
                        </motion.div>

                        <form onSubmit={handleSubmit}>
                            {[
                                { name: 'user_name', label: 'Name', type: 'text' },
                                { name: 'user_email', label: 'Email', type: 'email' },
                                { name: 'phone_number', label: 'Phone Number', type: 'tel' }
                            ].map((field) => (
                                <motion.div 
                                    key={field.name} 
                                    variants={itemVariants}
                                >
                                    <TextField
                                        name={field.name}
                                        label={field.label}
                                        type={field.type}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        required
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: chocolateTheme.primary,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: chocolateTheme.secondary,
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: chocolateTheme.accent,
                                                },
                                            },
                                        }}
                                    />
                                </motion.div>
                            ))}

                            <motion.div variants={itemVariants}>
                                <Select
                                    name="event_type_id"
                                    value={formData.event_type_id}
                                    onChange={handleChange}
                                    fullWidth
                                    displayEmpty
                                    required
                                    variant="outlined"
                                    sx={{
                                        marginTop: theme.spacing(2),
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: chocolateTheme.primary,
                                        },
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        Select Event Type
                                    </MenuItem>
                                    {eventTypes.map((event) => (
                                        <MenuItem key={event.id} value={event.id}>
                                            {event.event_type} - RWF{event.fee}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </motion.div>

                            {[
                                { name: 'event_date', label: 'Event Date', type: 'date' },
                                { name: 'event_time', label: 'Event Time', type: 'time' }
                            ].map((field) => (
                                <motion.div 
                                    key={field.name} 
                                    variants={itemVariants}
                                >
                                    <TextField
                                        name={field.name}
                                        label={field.label}
                                        type={field.type}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        required
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: chocolateTheme.primary,
                                                },
                                            },
                                        }}
                                    />
                                </motion.div>
                            ))}

                            <motion.div variants={itemVariants}>
                                <TextField
                                    name="additional_notes"
                                    label="Additional Notes"
                                    value={formData.additional_notes}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: chocolateTheme.primary,
                                            },
                                        },
                                    }}
                                />
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    endIcon={<SendIcon />}
                                    sx={{
                                        marginTop: theme.spacing(2),
                                        background: `linear-gradient(45deg, ${chocolateTheme.primary} 30%, ${chocolateTheme.secondary} 90%)`,
                                        color: 'white',
                                        padding: theme.spacing(1.5),
                                        borderRadius: theme.spacing(2),
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                            boxShadow: `0 8px 16px rgba(${chocolateTheme.text}, 0.3)`
                                        }
                                    }}
                                >
                                    Submit Booking
                                </Button>
                            </motion.div>
                        </form>
                    </Paper>
                </motion.div>
            </Container>

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={4000} 
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity}
                    sx={{
                        backgroundColor: snackbar.severity === 'success' 
                            ? chocolateTheme.background 
                            : chocolateTheme.secondary,
                        color: snackbar.severity === 'success' 
                            ? chocolateTheme.text 
                            : 'white'
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PublicBooking;