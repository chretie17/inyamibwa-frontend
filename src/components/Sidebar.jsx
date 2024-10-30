import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, Box, Typography, Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyledDrawer = styled(Drawer)`
  width: 240px;
  flex-shrink: 0;

  .MuiDrawer-paper {
    width: 240px;
    box-sizing: border-box;
    background-color: #121212;
    color: #f4f4f4;
    border-right: 4px solid #8b6914;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
  }
`;

const StyledHeader = styled(Box)`
  text-align: center;
  padding: 24px;
  background-color: #8b6914;
  color: #f4f4f4;

  h6 {
    font-weight: bold;
    font-size: 1.5rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }

  p {
    color: #f4f4f4;
    font-size: 1.1rem;
    font-style: italic;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
`;

const StyledListItem = styled(ListItem)`
  &:hover {
    background-color: #2e2e2e;
  }

  .MuiListItemIcon-root {
    color: #8b6914;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }

  .MuiListItemText-primary {
    color: #f4f4f4;
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
`;

const StyledLogoutButton = styled(Button)`
  background-color: #c83232;
  color: #f4f4f4;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);

  &:hover {
    background-color: #af2626;
  }
`;

const Sidebar = () => {
  const userRole = localStorage.getItem('userRole');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <StyledDrawer variant="permanent">
      <StyledHeader>
        <Typography variant="h6">{username}</Typography>
        <Typography variant="subtitle2">
          Role: {userRole}
        </Typography>
      </StyledHeader>
      <Divider />
      <List>
        <StyledListItem button onClick={() => navigate('/dashboard')}>
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
          
        </StyledListItem>
        {userRole === 'admin' && (
          <>
            <StyledListItem button onClick={() => navigate('/users')}>
              <ListItemIcon><PeopleIcon /></ListItemIcon>
              <ListItemText primary="Users" />
            </StyledListItem>
            <StyledListItem button onClick={() => navigate('/adminbookings')}>
              <ListItemIcon><PeopleIcon /></ListItemIcon>
              <ListItemText primary="Bookings" />
            </StyledListItem>
            <StyledListItem button onClick={() => navigate('/complaints')}>
              <ListItemIcon><ReportProblemIcon /></ListItemIcon>
              <ListItemText primary="Complaints" />
            </StyledListItem>
            <StyledListItem button onClick={() => navigate('/adminattendance')}>
              <ListItemIcon><ReportProblemIcon /></ListItemIcon>
              <ListItemText primary="Attendances" />
            </StyledListItem>
            <StyledListItem button onClick={() => navigate('/adminqualifications')}>
              <ListItemIcon><ReportProblemIcon /></ListItemIcon>
              <ListItemText primary="Qualifications" />
            </StyledListItem>
          </>
        )}
        {userRole === 'trainer' && (
          <StyledListItem button onClick={() => navigate('/attendance')}>
            <ListItemIcon><SchoolIcon /></ListItemIcon>
            <ListItemText primary="Attendance" />
          </StyledListItem>
        )}
        <StyledListItem button onClick={() => navigate('/trainings')}>
          <ListItemIcon><AssignmentIcon /></ListItemIcon>
          <ListItemText primary="Trainings" />
        </StyledListItem>
        <StyledListItem button onClick={() => navigate('/Qualifications')}>
          <ListItemIcon><AssignmentIcon /></ListItemIcon>
          <ListItemText primary="Qualifications" />
        </StyledListItem>
        <StyledListItem button onClick={() => navigate('/schedule')}>
          <ListItemIcon><AssignmentIcon /></ListItemIcon>
          <ListItemText primary="Schedule" />
        </StyledListItem>
        <StyledListItem button onClick={() => navigate('/attendance')}>
          <ListItemIcon><AssignmentIcon /></ListItemIcon>
          <ListItemText primary="Attendance" />
        </StyledListItem>
       
      </List>
      <Divider />
      <Box sx={{ textAlign: 'center', mt: 'auto', mb: 2, px: 2 }}>
        <StyledLogoutButton
          variant="contained"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          fullWidth
        >
          Logout
        </StyledLogoutButton>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar;