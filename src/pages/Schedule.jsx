import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../api';

const Schedule = () => {
    const [events, setEvents] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        venue: '',
        date: '',
        time: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    // Fetch all events
    const fetchEvents = async () => {
        try {
            const response = await api.get('/schedule');
            setEvents(response.data);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        }
    };

    // Open dialog for adding or editing an event
    const handleOpenDialog = (event = null) => {
        setSelectedEvent(event);
        setNewEvent(
            event
                ? {
                    title: event.title,
                    description: event.description,
                    venue: event.venue,
                    date: event.date,
                    time: event.time
                }
                : {
                    title: '',
                    description: '',
                    venue: '',
                    date: '',
                    time: ''
                }
        );
        setOpenDialog(true);
    };

    // Close dialog
    const handleCloseDialog = () => setOpenDialog(false);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent((prev) => ({ ...prev, [name]: value }));
    };

    // Save a new or edited event
    // Frontend: Schedule.js (inside handleSaveEvent function)

const handleSaveEvent = async () => {
    try {
        const eventData = {
            ...newEvent,
            created_by: localStorage.getItem('userId') || ''  // Ensure created_by is set
        };

        if (selectedEvent) {
            await api.put(`/schedule/${selectedEvent.id}`, eventData);
        } else {
            await api.post('/schedule', eventData);
        }
        fetchEvents();
        handleCloseDialog();
    } catch (error) {
        console.error('Failed to save event:', error);
    }
};


    // Delete an event
    const handleDeleteEvent = async (id) => {
        try {
            await api.delete(`/schedule/${id}`);
            setEvents(events.filter((event) => event.id !== id));
        } catch (error) {
            console.error('Failed to delete event:', error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Dance Troupe Schedule Management
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenDialog()}
                sx={{ mb: 2 }}
            >
                Add New Event
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Venue</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {events.length > 0 ? (
                            events.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell>{event.title}</TableCell>
                                    <TableCell>{event.description}</TableCell>
                                    <TableCell>{event.venue}</TableCell>
                                    <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{event.time}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleOpenDialog(event)}
                                            color="primary"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDeleteEvent(event.id)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No events found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Event Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{selectedEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        name="title"
                        value={newEvent.title}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        name="description"
                        value={newEvent.description}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        margin="dense"
                        label="Venue"
                        name="venue"
                        value={newEvent.venue}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        margin="dense"
                        label="Date"
                        name="date"
                        type="date"
                        value={newEvent.date}
                        onChange={handleInputChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                    />
                    <TextField
                        margin="dense"
                        label="Time"
                        name="time"
                        type="time"
                        value={newEvent.time}
                        onChange={handleInputChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveEvent} color="primary">
                        {selectedEvent ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Schedule;
