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
  Slide,
  createTheme,
  ThemeProvider
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

// Custom theme with brown color palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#5B3F00', // Rich brown
      light: '#8B6B4F',
      dark: '#3B2900'
    },
    background: {
      default: '#FAF0E6', // Soft cream
      paper: '#FFFFFF'
    },
    text: {
      primary: '#5B3F00',
      secondary: '#8B6B4F'
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  }
});

const UserNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
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
      visible: true
    },
    { 
      text: 'Profile', 
      path: '/profile', 
      icon: <Person />,
      visible: userRole === 'user'
    },
    { 
      text: 'Trainings', 
      path: '/user-trainings', 
      icon: <School />,
      visible: userRole === 'user'
    },
    { 
      text: 'File Complaint', 
      path: '/complaint', 
      icon: <Report />,
      visible: userRole === 'user'
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
              my: 0.5,
              '& .MuiButton-root': {
                justifyContent: 'flex-start',
                borderRadius: 2,
                px: 2,
                color: location.pathname === item.path ? '#5B3F00' : 'inherit',
                fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                '&:hover': { 
                  backgroundColor: 'rgba(91,63,0,0.1)',
                  color: '#5B3F00'
                }
              }
            }}
          >
            {item.path ? (
              <Button
                fullWidth
                startIcon={item.icon}
                component={Link}
                to={item.path}
                onClick={handleDrawerToggle}
                sx={{ 
                  backgroundColor: location.pathname === item.path 
                    ? 'rgba(91,63,0,0.1)' 
                    : 'transparent'
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
      <ThemeProvider theme={theme}>
        <>
          <Slide appear={false} direction="down" in={!trigger}>
            <AppBar 
              position="fixed"
              sx={{
                background: 'linear-gradient(135deg, #8B6B4F, #5B3F00)',
                boxShadow: '0 6px 12px rgba(91,63,0,0.2)',
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(91,63,0,0.8)'
              }}
            >
              <Toolbar>
                {/* Mobile Menu Toggle */}
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ 
                    mr: 2, 
                    display: { sm: 'none' },
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)'
                    }
                  }}
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
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    letterSpacing: 1
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
                            color: 'white',
                            fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                            backgroundColor: location.pathname === item.path 
                              ? 'rgba(255,255,255,0.2)' 
                              : 'transparent',
                            '&:hover': { 
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              color: 'white'
                            },
                            mx: 0.5,
                            px: 2,
                            borderRadius: 2
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
                            color: 'white',
                            '&:hover': { 
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              color: 'white'
                            },
                            mx: 0.5,
                            px: 2,
                            borderRadius: 2
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
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: 240,
                backgroundColor: '#FAF0E6', // Soft cream background
                borderRight: '3px solid #5B3F00'
              }
            }}
          >
            {drawer}
          </Drawer>
        </>
      </ThemeProvider>
    )
  );
};

export default UserNavbar;