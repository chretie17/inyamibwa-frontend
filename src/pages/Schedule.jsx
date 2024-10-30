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
import styled from 'styled-components';
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
            <Container>
                <Typography variant="h4" sx={{ color: '#000000', fontWeight: 'bold' }} gutterBottom>
                    Dance Troupe Schedule Management
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenDialog()}
                    sx={{ mb: 2, backgroundColor: '#DAA520', color: '#FFFFFF', fontWeight: 'bold', '&:hover': { backgroundColor: '#B8860B' } }}
                >
                    Add New Event
                </Button>

                <TableContainer component={Paper} sx={{ boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.7)', borderRadius: '16px', backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Title</StyledTableCell>
                                <StyledTableCell>Description</StyledTableCell>
                                <StyledTableCell>Venue</StyledTableCell>
                                <StyledTableCell>Date</StyledTableCell>
                                <StyledTableCell>Time</StyledTableCell>
                                <StyledTableCell>Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {events.length > 0 ? (
                                events.map((event) => (
                                    <StyledTableRow key={event.id}>
                                        <StyledTableCell>{event.title}</StyledTableCell>
                                        <StyledTableCell>{event.description}</StyledTableCell>
                                        <StyledTableCell>{event.venue}</StyledTableCell>
                                        <StyledTableCell>{new Date(event.date).toLocaleDateString()}</StyledTableCell>
                                        <StyledTableCell>{event.time}</StyledTableCell>
                                        <StyledTableCell>
                                            <IconButton
                                                onClick={() => handleOpenDialog(event)}
                                                sx={{ color: '#DAA520', '&:hover': { color: '#B8860B' } }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleDeleteEvent(event.id)}
                                                sx={{ color: '#ff4c4c', '&:hover': { color: '#ff0000' } }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))
                            ) : (
                                <StyledTableRow>
                                    <StyledTableCell colSpan={6} align="center" sx={{ color: '#000000', fontStyle: 'italic' }}>
                                        No events found
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Add/Edit Event Dialog */}
                <StyledDialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ color: '#000000' }}>{selectedEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
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
                            sx={{ mb: 2, backgroundColor: '#FFFFFF', borderRadius: '8px', input: { color: '#000000', fontSize: '1.1rem' } }}
                        />
                        <TextField
                            margin="dense"
                            label="Description"
                            name="description"
                            value={newEvent.description}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 2, backgroundColor: '#FFFFFF', borderRadius: '8px', input: { color: '#000000', fontSize: '1.1rem' } }}
                        />
                        <TextField
                            margin="dense"
                            label="Venue"
                            name="venue"
                            value={newEvent.venue}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 2, backgroundColor: '#FFFFFF', borderRadius: '8px', input: { color: '#000000', fontSize: '1.1rem' } }}
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
                            sx={{ mb: 2, backgroundColor: '#FFFFFF', borderRadius: '8px', input: { color: '#000000', fontSize: '1.1rem' } }}
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
                            sx={{ mb: 2, backgroundColor: '#FFFFFF', borderRadius: '8px', input: { color: '#000000', fontSize: '1.1rem' } }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} sx={{ color: '#ff4c4c', fontWeight: 'bold', fontSize: '1rem' }}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEvent} sx={{ backgroundColor: '#DAA520', color: '#FFFFFF', fontWeight: 'bold', fontSize: '1rem', '&:hover': { backgroundColor: '#B8860B' } }}>
                            {selectedEvent ? 'Update' : 'Save'}
                        </Button>
                    </DialogActions>
                </StyledDialog>
            </Container>
        </Box>
    );
};

export default Schedule;

const Container = styled(Box)`
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.7);
  color: #000000;
`;

const StyledTableCell = styled(TableCell)`
  color: #000000;
  font-weight: bold;
  font-size: 1.2rem;
  border-bottom: 2px solid #4a4a4a;
  padding: 24px;
  background-color: #f5f5f5;
`;

const StyledTableRow = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: #f9f9f9;
  }
  &:nth-of-type(even) {
    background-color: #ffffff;
  }
  &:hover {
    background-color: #e6e6e6;
  }
`;

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background-color: #FFFFFF;
    color: #000000;
    border-radius: 16px;
    box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.9);
  }
`;
