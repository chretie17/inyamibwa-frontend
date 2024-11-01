// src/components/PublicNavbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const PublicNavbar = () => (
    <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Inyamibwa Platform
            </Typography>
            <Box>
                <Button color="inherit" component={Link} to="/">Home</Button>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/book-now">Book Now</Button>
            </Box>
        </Toolbar>
    </AppBar>
);

export default PublicNavbar;
