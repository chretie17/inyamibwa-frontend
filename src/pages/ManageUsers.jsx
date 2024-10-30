import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    IconButton,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import styled from 'styled-components';
import api from '../api';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        username: '',
        role: '',
        qualifications: '',
        password: ''
    });

    const roles = ['admin', 'trainer', 'user'];
    const qualifications = ['Beginner', 'Intermediate', 'Expert'];

    // Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                if (Array.isArray(response.data)) {
                    setUsers(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };
        fetchUsers();
    }, []);

    // Open dialog for adding or editing a user
    const handleOpenDialog = (user = null) => {
        setSelectedUser(user);
        setNewUser(user ? { ...user, password: '' } : {
            name: '',
            email: '',
            username: '',
            role: '',
            qualifications: '',
            password: ''
        });
        setOpenDialog(true);
    };

    // Close dialog
    const handleCloseDialog = () => setOpenDialog(false);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({ ...prev, [name]: value }));
    };

    // Save a new or edited user
    const handleSaveUser = async () => {
        try {
            if (selectedUser) {
                await api.put(`/users/${selectedUser.id}`, newUser);
                setUsers(users.map((user) => (user.id === selectedUser.id ? { ...newUser, password: undefined } : user)));
            } else {
                const response = await api.post('/users', newUser);
                setUsers([...users, response.data]);
            }
            handleCloseDialog();
        } catch (error) {
            console.error('Failed to save user:', error);
        }
    };

    // Delete a user
    const handleDeleteUser = async (userId) => {
        try {
            await api.delete(`/users/${userId}`);
            setUsers(users.filter((user) => user.id !== userId));
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Container>
                <Typography variant="h4" sx={{ color: '#000000', fontWeight: 'bold' }} gutterBottom>
                    Manage Users
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenDialog()}
                    sx={{ mb: 2, backgroundColor: '#DAA520', color: '#FFFFFF', fontWeight: 'bold', '&:hover': { backgroundColor: '#B8860B' } }}
                >
                    Add New User
                </Button>

                <TableContainer component={Paper} sx={{ boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.7)', borderRadius: '16px', backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell>Email</StyledTableCell>
                                <StyledTableCell>Username</StyledTableCell>
                                <StyledTableCell>Role</StyledTableCell>
                                <StyledTableCell>Qualifications</StyledTableCell>
                                <StyledTableCell>Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <StyledTableRow key={user.id}>
                                        <StyledTableCell>{user.name}</StyledTableCell>
                                        <StyledTableCell>{user.email}</StyledTableCell>
                                        <StyledTableCell>{user.username}</StyledTableCell>
                                        <StyledTableCell>{user.role}</StyledTableCell>
                                        <StyledTableCell>{user.qualifications}</StyledTableCell>
                                        <StyledTableCell>
                                            <IconButton
                                                onClick={() => handleOpenDialog(user)}
                                                sx={{ color: '#DAA520', '&:hover': { color: '#B8860B' } }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleDeleteUser(user.id)}
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
                                        No users found
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Add/Edit User Dialog */}
                <StyledDialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ color: '#000000' }}>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Name"
                            name="name"
                            value={newUser.name}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 2, backgroundColor: '#FFFFFF', borderRadius: '8px', input: { color: '#000000', fontSize: '1.1rem' } }}
                        />
                        <TextField
                            margin="dense"
                            label="Email"
                            name="email"
                            value={newUser.email}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 2, backgroundColor: '#FFFFFF', borderRadius: '8px', input: { color: '#000000', fontSize: '1.1rem' } }}
                        />
                        <TextField
                            margin="dense"
                            label="Username"
                            name="username"
                            value={newUser.username}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 2, backgroundColor: '#FFFFFF', borderRadius: '8px', input: { color: '#000000', fontSize: '1.1rem' } }}
                        />
                        <TextField
                            margin="dense"
                            label="Password"
                            name="password"
                            type="password"
                            value={newUser.password}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 2, backgroundColor: '#FFFFFF', borderRadius: '8px', input: { color: '#000000', fontSize: '1.1rem' } }}
                        />
                        <Select
                            label="Role"
                            name="role"
                            value={newUser.role}
                            onChange={handleInputChange}
                            fullWidth
                            displayEmpty
                            variant="outlined"
                            sx={{ mt: 2, mb: 2, backgroundColor: '#FFFFFF', borderRadius: '8px', color: '#000000', fontSize: '1.1rem' }}
                        >
                            <MenuItem value="" disabled>
                                Select Role
                            </MenuItem>
                            {roles.map((role) => (
                                <MenuItem key={role} value={role} sx={{ color: '#000000' }}>
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                        <Select
                            label="Qualifications"
                            name="qualifications"
                            value={newUser.qualifications}
                            onChange={handleInputChange}
                            fullWidth
                            displayEmpty
                            variant="outlined"
                            sx={{ mt: 2, mb: 2, backgroundColor: '#FFFFFF', borderRadius: '8px', color: '#000000', fontSize: '1.1rem' }}
                        >
                            <MenuItem value="" disabled>
                                Select Qualifications
                            </MenuItem>
                            {qualifications.map((qual) => (
                                <MenuItem key={qual} value={qual} sx={{ color: '#000000' }}>
                                    {qual}
                                </MenuItem>
                            ))}
                        </Select>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} sx={{ color: '#ff4c4c', fontWeight: 'bold', fontSize: '1rem' }}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveUser} sx={{ backgroundColor: '#DAA520', color: '#FFFFFF', fontWeight: 'bold', fontSize: '1rem', '&:hover': { backgroundColor: '#B8860B' } }}>
                            {selectedUser ? 'Update' : 'Save'}
                        </Button>
                    </DialogActions>
                </StyledDialog>
            </Container>
        </Box>
    );
};

export default ManageUsers;

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
