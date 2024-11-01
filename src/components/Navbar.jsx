// src/components/UserNavbar.js
import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  useScrollTrigger,
  Slide
} from '@mui/material';
import { 
  Link, 
  useNavigate, 
  useLocation 
} from 'react-router-dom';
import { 
  Home, 
  Person, 
  School, 
  Report, 
  Logout, 
  Login, 
  Menu as MenuIcon 
} from '@mui/icons-material';

const UserNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Custom scroll trigger for hiding navbar on scroll
  const trigger = useScrollTrigger();

  // Navigation menu items
  const menuItems = [
    { 
      text: 'Home', 
      path: '/', 
      icon: <Home />,
      visible: true // Always visible on homepage
    },
    { 
      text: 'Profile', 
      path: '/profile', 
      icon: <Person />,
      visible: userRole === 'user' // Visible only if role is "user"
    },
    { 
      text: 'Trainings', 
      path: '/user-trainings', 
      icon: <School />,
      visible: userRole === 'user' // Visible only if role is "user"
    },
    { 
      text: 'File Complaint', 
      path: '/complaint', 
      icon: <Report />,
      visible: userRole === 'user' // Visible only if role is "user"
    },
    { 
      text: userRole ? 'Logout' : 'Login', 
      path: userRole ? null : '/login', 
      icon: userRole ? <Logout /> : <Login />, 
      onClick: userRole ? handleLogout : null,
      visible: true 
    }
  ];

  // Mobile drawer content
  const drawer = (
    <List>
      {menuItems
        .filter(item => item.visible)
        .map((item) => (
          <ListItem 
            key={item.text}
            disablePadding
            sx={{ 
              color: location.pathname === item.path ? 'gold' : 'inherit',
              '&:hover': { backgroundColor: 'rgba(255,215,0,0.1)' }
            }}
          >
            {item.path ? (
              <Button
                fullWidth
                startIcon={item.icon}
                component={Link}
                to={item.path}
                onClick={() => {
                  handleDrawerToggle();
                }}
                sx={{ 
                  justifyContent: 'flex-start',
                  color: location.pathname === item.path ? 'gold' : 'inherit'
                }}
              >
                {item.text}
              </Button>
            ) : (
              <Button
                fullWidth
                startIcon={item.icon}
                onClick={() => {
                  handleDrawerToggle();
                  item.onClick && item.onClick();
                }}
                sx={{ justifyContent: 'flex-start' }}
              >
                {item.text}
              </Button>
            )}
          </ListItem>
        ))}
    </List>
  );

  return (
    userRole === 'user' && (
      <>
        <Slide appear={false} direction="down" in={!trigger}>
          <AppBar 
            position="fixed"
            sx={{
              background: 'linear-gradient(135deg, #DAA520, #FFD700)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            <Toolbar>
              {/* Mobile Menu Toggle */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>

              {/* Logo/Title */}
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  flexGrow: 1,
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                Inyamibwa Platform
              </Typography>

              {/* Desktop Navigation */}
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                {menuItems
                  .filter(item => item.visible)
                  .map((item) => (
                    item.path ? (
                      <Button
                        key={item.text}
                        color="inherit"
                        component={Link}
                        to={item.path}
                        startIcon={item.icon}
                        sx={{
                          color: location.pathname === item.path ? 'black' : 'white',
                          fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                          '&:hover': { 
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'black'
                          }
                        }}
                      >
                        {item.text}
                      </Button>
                    ) : (
                      <Button
                        key={item.text}
                        color="inherit"
                        onClick={item.onClick}
                        startIcon={item.icon}
                        sx={{
                          '&:hover': { 
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'black'
                          }
                        }}
                      >
                        {item.text}
                      </Button>
                    )
                  ))}
              </Box>
            </Toolbar>
          </AppBar>
        </Slide>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 240,
              backgroundColor: '#FFF8DC' // Soft gold background
            }
          }}
        >
          {drawer}
        </Drawer>
      </>
    )
  );
};

export default UserNavbar;
