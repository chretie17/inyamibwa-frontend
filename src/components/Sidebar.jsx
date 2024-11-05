import React from 'react';
import { NavLink } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, Box, Typography, Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import styled from 'styled-components';
import CowImage from '../assets/inyam.jpg'; // Assuming the cow image is in the assets folder

const StyledDrawer = styled(Drawer)`
  width: 280px;
  flex-shrink: 0;

  .MuiDrawer-paper {
    width: 280px;
    box-sizing: border-box;
    background: linear-gradient(rgba(30, 30, 45, 0.9), rgba(30, 30, 45, 0.9)), url(${CowImage}) no-repeat center center;
    background-size: cover;
    color: #fff;
    border-right: none;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.25);
  }
`;

const BrandContainer = styled(Box)`
  background: linear-gradient(180deg, #2C2C40 0%, #1E1E2D 100%);
  padding: 2rem 1.5rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled(Typography)`
  font-size: 2.2rem;
  font-weight: 700;
  color: #C9B037;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-family: 'Montserrat', sans-serif;
`;

const ProfileSection = styled(Box)`
  background: linear-gradient(135deg, #2C2C40 0%, #252536 100%);
  padding: 1.5rem;
  text-align: center;
  position: relative;
`;

const UserAvatar = styled(Box)`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #C9B037 0%, #D4AF37 100%);
  border-radius: 50%;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(201, 176, 55, 0.3);

  svg {
    width: 40px;
    height: 40px;
    color: #1E1E2D;
  }
`;

const UserName = styled(Typography)`
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.25rem;
`;

const StyledListItem = styled(ListItem)`
  margin: 4px 8px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(90deg, rgba(201, 176, 55, 0.15), rgba(201, 176, 55, 0.05));
    transform: translateX(4px);
  }

  .MuiListItemIcon-root {
    color: #C9B037;
    min-width: 40px;
    transition: all 0.2s ease;
  }

  &:hover .MuiListItemIcon-root {
    color: #D4AF37;
    transform: scale(1.1);
  }

  .MuiListItemText-primary {
    color: #E0E0E0;
    font-size: 0.95rem;
    font-weight: 500;
    letter-spacing: 0.3px;
  }

  &:hover .MuiListItemText-primary {
    color: #fff;
  }
`;

const MenuSection = styled(Box)`
  padding: 1rem 0;
  position: relative;
`;

const SectionTitle = styled(Typography)`
  color: #8E8E9A;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0 1.5rem;
  margin: 1rem 0 0.5rem;
`;

const StyledLogoutButton = styled(Button)`
  margin: 1rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, #C9B037 0%, #D4AF37 100%);
  color: #1E1E2D;
  font-weight: 600;
  border-radius: 8px;
  text-transform: none;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(201, 176, 55, 0.2);

  &:hover {
    background: linear-gradient(135deg, #D4AF37 0%, #E5C547 100%);
    box-shadow: 0 6px 16px rgba(201, 176, 55, 0.3);
    transform: translateY(-1px);
  }

  .MuiButton-startIcon {
    transition: transform 0.3s ease;
  }

  &:hover .MuiButton-startIcon {
    transform: rotate(-180deg);
  }
`;

const Sidebar = () => {
  const userRole = localStorage.getItem('userRole');
  const username = localStorage.getItem('username');

  return (
    <StyledDrawer variant="permanent">
      <BrandContainer>
        <Logo>INYAMIBWA</Logo>
      </BrandContainer>
      
      <ProfileSection>
        <UserAvatar>
          <PersonIcon />
        </UserAvatar>
        <UserName>{username}</UserName>
      </ProfileSection>

      <MenuSection>
        <SectionTitle>Main Menu</SectionTitle>
        <List>
          <StyledListItem button component={NavLink} to="/dashboard">
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </StyledListItem>

          {userRole === 'admin' && (
            <>
              <SectionTitle>Administration</SectionTitle>
              <StyledListItem button component={NavLink} to="/users">
                <ListItemIcon><PeopleIcon /></ListItemIcon>
                <ListItemText primary="Users" />
              </StyledListItem>
              <StyledListItem button component={NavLink} to="/adminbookings">
                <ListItemIcon><AssignmentIcon /></ListItemIcon>
                <ListItemText primary="Bookings" />
              </StyledListItem>
              <StyledListItem button component={NavLink} to="/complaints">
                <ListItemIcon><ReportProblemIcon /></ListItemIcon>
                <ListItemText primary="Complaints" />
              </StyledListItem>
              <StyledListItem button component={NavLink} to="/adminattendance">
                <ListItemIcon><SchoolIcon /></ListItemIcon>
                <ListItemText primary="Attendances" />
              </StyledListItem>
              <StyledListItem button component={NavLink} to="/adminqualifications">
                <ListItemIcon><SchoolIcon /></ListItemIcon>
                <ListItemText primary="Qualifications" />
              </StyledListItem>
              <StyledListItem button component={NavLink} to="/reports">
                <ListItemIcon><SchoolIcon /></ListItemIcon>
                <ListItemText primary="Reports" />
              </StyledListItem>
            </>
          )}

          <SectionTitle>Training</SectionTitle>
          {userRole === 'trainer' && (
            <StyledListItem button component={NavLink} to="/attendance">
              <ListItemIcon><SchoolIcon /></ListItemIcon>
              <ListItemText primary="Attendance" />
            </StyledListItem>
          )}
          <StyledListItem button component={NavLink} to="/manage-trainings">
            <ListItemIcon><AssignmentIcon /></ListItemIcon>
            <ListItemText primary="Trainings" />
          </StyledListItem>
          <StyledListItem button component={NavLink} to="/qualifications">
            <ListItemIcon><AssignmentIcon /></ListItemIcon>
            <ListItemText primary="Qualifications" />
          </StyledListItem>
          <StyledListItem button component={NavLink} to="/schedule">
            <ListItemIcon><AssignmentIcon /></ListItemIcon>
            <ListItemText primary="Schedule" />
          </StyledListItem>
        </List>
      </MenuSection>

      <Box sx={{ marginTop: 'auto', mb: 2 }}>
        <SectionTitle>User Role</SectionTitle>
        <Typography sx={{ 
          color: '#C9B037', 
          textAlign: 'center', 
          fontSize: '0.9rem',
          fontWeight: '500',
          mb: 2
        }}>
          {userRole?.toUpperCase()}
        </Typography>
        <StyledLogoutButton
          variant="contained"
          startIcon={<LogoutIcon />}
          component={NavLink} to="/login"
          fullWidth
        >
          Logout
        </StyledLogoutButton>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar;
