import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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
    uploadedBy: localStorage.getItem('userId') || '',
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
    const userIds = [...new Set(trainings.map((training) => training.uploaded_by))];
    const userNamesMap = {};

    await Promise.all(
      userIds.map(async (userId) => {
        const response = await api.get(`/users/${userId}`);
        userNamesMap[userId] = response.data.name; // Assume the response has a `name` field
      })
    );

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
            uploadedBy: training.uploaded_by,
          }
        : {
            title: '',
            description: '',
            file: null,
            fileType: '',
            uploadedBy: localStorage.getItem('userId') || '',
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
    <Box sx={{ p: 4 }}>
      <Container>
        <Header>
          <Typography variant="h4" sx={{ color: '#000000', fontWeight: 'bold' }}>Manage Trainings</Typography>
          <Button
            variant="contained"
            onClick={() => handleOpenDialog()}
            sx={{ mb: 2, backgroundColor: '#DAA520', color: '#FFFFFF', fontWeight: 'bold', '&:hover': { backgroundColor: '#B8860B' } }}
          >
            Add New Training
          </Button>
        </Header>

        <TableContainer component={Paper} sx={{ boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.7)', borderRadius: '16px', backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell>File Type</StyledTableCell>
                <StyledTableCell>Uploaded By</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trainings.length > 0 ? (
                trainings.map((training) => (
                  <StyledTableRow key={training.id}>
                    <StyledTableCell>{training.title}</StyledTableCell>
                    <StyledTableCell>{training.description}</StyledTableCell>
                    <StyledTableCell>{training.file_type}</StyledTableCell>
                    <StyledTableCell>{userNames[training.uploaded_by] || training.uploaded_by}</StyledTableCell>
                    <StyledTableCell>
                      <IconButton onClick={() => handleViewTraining(training)} sx={{ color: '#DAA520', '&:hover': { color: '#d4af37' } }}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => handleOpenDialog(training)} sx={{ color: '#DAA520', '&:hover': { color: '#d4af37' } }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteTraining(training.id)} sx={{ color: '#ff4c4c', '&:hover': { color: '#ff0000' } }}>
                        <DeleteIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={5} align="center" sx={{ color: '#000000', fontStyle: 'italic' }}>
                    No trainings found
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Training Dialog */}
        <StyledDialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: '#000000' }}>{selectedTraining ? 'Edit Training' : 'Add New Training'}</DialogTitle>
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
              sx={{ mb: 2, backgroundColor: '#FFFFFF', borderRadius: '8px', input: { color: '#000000', fontSize: '1.1rem' } }}
            />
            <TextField
              margin="dense"
              label="Description"
              name="description"
              value={newTraining.description}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              sx={{ mb: 2, backgroundColor: '#FFFFFF', borderRadius: '8px', input: { color: '#000000', fontSize: '1.1rem' } }}
            />
            <Select
              label="File Type"
              name="fileType"
              value={newTraining.fileType}
              onChange={handleInputChange}
              fullWidth
              displayEmpty
              variant="outlined"
              sx={{ mt: 2, mb: 2, backgroundColor: '#FFFFFF', borderRadius: '8px', color: '#000000', fontSize: '1.1rem' }}
            >
              <MenuItem value="" disabled>
                Select File Type
              </MenuItem>
              {fileTypes.map((type) => (
                <MenuItem key={type} value={type} sx={{ color: '#000000' }}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </Select>
            <Button variant="outlined" component="label" sx={{ mt: 2, color: '#DAA520', borderColor: '#DAA520', fontWeight: 'bold', '&:hover': { backgroundColor: '#B8860B', color: '#FFFFFF' } }}>
              Upload File
              <input type="file" accept="application/pdf, video/mp4" hidden onChange={handleFileChange} />
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} sx={{ color: '#ff4c4c', fontWeight: 'bold', fontSize: '1rem' }}>
              Cancel
            </Button>
            <Button onClick={handleSaveTraining} sx={{ backgroundColor: '#DAA520', color: '#FFFFFF', fontWeight: 'bold', fontSize: '1rem', '&:hover': { backgroundColor: '#B8860B' } }}>
              {selectedTraining ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </StyledDialog>

        {/* View Training Dialog */}
        <StyledDialog open={openViewer} onClose={handleCloseViewer} maxWidth="md" fullWidth>
          <DialogTitle sx={{ color: '#000000' }}>View Training</DialogTitle>
          <DialogContent>
            {selectedTraining && selectedTraining.file_type === 'video' && (
              <VideoContainer>
                <video controls width="100%">
                  <source src={`data:video/mp4;base64,${selectedTraining.file_data}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </VideoContainer>
            )}
            {selectedTraining && selectedTraining.file_type === 'pdf' && (
              <Button
                variant="contained"
                sx={{ mt: 2, backgroundColor: '#DAA520', color: '#FFFFFF', fontWeight: 'bold', fontSize: '1rem', '&:hover': { backgroundColor: '#B8860B' } }}
                onClick={() => {
                  // Create a Blob for the PDF file and generate a temporary Object URL
                  const byteCharacters = atob(selectedTraining.file_data); // Decode base64
                  const byteNumbers = new Array(byteCharacters.length);
                  for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                  }
                  const byteArray = new Uint8Array(byteNumbers);
                  const blob = new Blob([byteArray], { type: 'application/pdf' });
                  const pdfUrl = URL.createObjectURL(blob);

                  // Open PDF in a new tab
                  window.open(pdfUrl, '_blank');

                  // Clean up the Object URL after the PDF is opened
                  setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
                }}
              >
                View PDF
              </Button>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseViewer} sx={{ color: '#DAA520', fontWeight: 'bold', fontSize: '1rem' }}>
              Close
            </Button>
          </DialogActions>
        </StyledDialog>
      </Container>
    </Box>
  );
};

export default Trainings;

const Container = styled(Box)`
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.7);
  color: #000000;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
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

const VideoContainer = styled.div`
  width: 100%;
  max-height: 500px;
  overflow: auto;
  border: 3px solid #DAA520;
  border-radius: 12px;
  padding: 8px;
  background-color: #FFFFFF;
`;
