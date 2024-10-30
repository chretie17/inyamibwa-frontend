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
import api from '../api'; // Ensure api is correctly configured

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
    const qualifications = ['Beginner', 'Intermediate', 'Advanced'];

    // Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                console.log("Fetched users from API:", response.data); // Confirm the array structure
                if (Array.isArray(response.data)) {
                    setUsers(response.data); // Ensure data is an array
                } else {
                    console.warn("Expected an array but received:", response.data);
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
            <Typography variant="h4" gutterBottom>
                Manage Users
            </Typography>
            <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>
                Add New User
            </Button>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Qualifications</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{user.qualifications}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleOpenDialog(user)} color="primary">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteUser(user.id)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No users found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit User Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
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
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        name="email"
                        value={newUser.email}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        margin="dense"
                        label="Username"
                        name="username"
                        value={newUser.username}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
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
                    />
                    <Select
                        label="Role"
                        name="role"
                        value={newUser.role}
                        onChange={handleInputChange}
                        fullWidth
                        displayEmpty
                        variant="outlined"
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="" disabled>
                            Select Role
                        </MenuItem>
                        {roles.map((role) => (
                            <MenuItem key={role} value={role}>
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
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="" disabled>
                            Select Qualifications
                        </MenuItem>
                        {qualifications.map((qual) => (
                            <MenuItem key={qual} value={qual}>
                                {qual}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveUser} color="primary">
                        {selectedUser ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManageUsers;
