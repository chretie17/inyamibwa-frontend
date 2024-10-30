import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import api from '../api';

const Trainings = () => {
    const [trainings, setTrainings] = useState([]);
    const [userNames, setUserNames] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [openViewer, setOpenViewer] = useState(false);
    const [selectedTraining, setSelectedTraining] = useState(null);
    const [newTraining, setNewTraining] = useState({
        title: '',
        description: '',
        file: null,
        fileType: '',
        uploadedBy: localStorage.getItem('userId') || ''
    });

    const fileTypes = ['video', 'pdf'];

    // Fetch all trainings
    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const response = await api.get('/trainings');
                setTrainings(response.data);
                fetchUserNames(response.data); // Fetch names for uploadedBy
            } catch (error) {
                console.error('Failed to fetch trainings:', error);
            }
        };
        fetchTrainings();
    }, []);

    // Fetch usernames based on uploadedBy ID
    const fetchUserNames = async (trainings) => {
        const userIds = [...new Set(trainings.map(training => training.uploaded_by))];
        const userNamesMap = {};

        await Promise.all(userIds.map(async userId => {
            const response = await api.get(`/users/${userId}`);
            userNamesMap[userId] = response.data.name; // Assume the response has a `name` field
        }));

        setUserNames(userNamesMap);
    };

    // Open dialog for adding or editing a training
    const handleOpenDialog = (training = null) => {
        setSelectedTraining(training);
        setNewTraining(
            training
                ? {
                    title: training.title,
                    description: training.description,
                    fileType: training.file_type,
                    uploadedBy: training.uploaded_by
                }
                : {
                    title: '',
                    description: '',
                    file: null,
                    fileType: '',
                    uploadedBy: localStorage.getItem('userId') || ''
                }
        );
        setOpenDialog(true);
    };

    // Close dialog
    const handleCloseDialog = () => setOpenDialog(false);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTraining((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file upload
    const handleFileChange = (e) => {
        setNewTraining((prev) => ({ ...prev, file: e.target.files[0] }));
    };

    // Save a new or edited training
    const handleSaveTraining = async () => {
        try {
            const formData = new FormData();
            formData.append('title', newTraining.title);
            formData.append('description', newTraining.description);
            formData.append('fileType', newTraining.fileType);
            formData.append('uploadedBy', newTraining.uploadedBy);
            if (newTraining.file) formData.append('file', newTraining.file);

            if (selectedTraining) {
                await api.put(`/trainings/${selectedTraining.id}`, formData);
            } else {
                await api.post('/trainings', formData);
            }

            handleCloseDialog();
        } catch (error) {
            console.error('Failed to save training:', error);
        }
    };

    // Delete a training
    const handleDeleteTraining = async (id) => {
        try {
            await api.delete(`/trainings/${id}`);
            setTrainings(trainings.filter((training) => training.id !== id));
        } catch (error) {
            console.error('Failed to delete training:', error);
        }
    };

    // Open the viewer dialog with selected training
    const handleViewTraining = (training) => {
        setSelectedTraining(training);
        setOpenViewer(true);
    };

    // Close the viewer dialog
    const handleCloseViewer = () => setOpenViewer(false);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Manage Trainings
            </Typography>
            <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>
                Add New Training
            </Button>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>File Type</TableCell>
                            <TableCell>Uploaded By</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trainings.length > 0 ? (
                            trainings.map((training) => (
                                <TableRow key={training.id}>
                                    <TableCell>{training.title}</TableCell>
                                    <TableCell>{training.description}</TableCell>
                                    <TableCell>{training.file_type}</TableCell>
                                    <TableCell>{userNames[training.uploaded_by] || training.uploaded_by}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleViewTraining(training)} color="primary">
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleOpenDialog(training)} color="primary">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteTraining(training.id)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No trainings found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Training Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{selectedTraining ? 'Edit Training' : 'Add New Training'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        name="title"
                        value={newTraining.title}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        name="description"
                        value={newTraining.description}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                    />
                    <Select
                        label="File Type"
                        name="fileType"
                        value={newTraining.fileType}
                        onChange={handleInputChange}
                        fullWidth
                        displayEmpty
                        variant="outlined"
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="" disabled>
                            Select File Type
                        </MenuItem>
                        {fileTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button variant="outlined" component="label" sx={{ mt: 2 }}>
                        Upload File
                        <input
                            type="file"
                            accept="application/pdf, video/mp4"
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveTraining} color="primary">
                        {selectedTraining ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Training Dialog */}
            <Dialog open={openViewer} onClose={handleCloseViewer} maxWidth="md" fullWidth>
                <DialogTitle>View Training</DialogTitle>
                <DialogContent>
    {selectedTraining && selectedTraining.file_type === 'video' && (
        <video controls width="100%">
            <source src={`data:video/mp4;base64,${selectedTraining.file_data}`} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    )}
    {selectedTraining && selectedTraining.file_type === 'pdf' && (
        <Button
            variant="contained"
            color="primary"
            onClick={() => {
                // Create a Blob for the PDF file and generate a temporary Object URL
                const byteCharacters = atob(selectedTraining.file_data); // Decode base64
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: "application/pdf" });
                const pdfUrl = URL.createObjectURL(blob);

                // Open PDF in a new tab
                window.open(pdfUrl, "_blank");

                // Clean up the Object URL after the PDF is opened
                setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
            }}
            sx={{ mt: 2 }}
        >
            View PDF
        </Button>
    )}
</DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseViewer} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Trainings;
