// src/pages/Trainings.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import api from '../api';

const Trainings = () => {
    const [trainings, setTrainings] = useState([]);

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const response = await api.get('/trainings');
                setTrainings(response.data);
            } catch (error) {
                console.error('Error fetching trainings:', error);
            }
        };
        fetchTrainings();
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4">Available Trainings</Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>File Type</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trainings.map(training => (
                            <TableRow key={training.id}>
                                <TableCell>{training.title}</TableCell>
                                <TableCell>{training.description}</TableCell>
                                <TableCell>{training.file_type}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Trainings;
