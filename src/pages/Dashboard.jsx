import React, { useState, useEffect } from 'react';
import { FaUsers, FaClipboardCheck, FaBookOpen, FaCalendarAlt } from 'react-icons/fa';
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import styled from 'styled-components';
import scrollreveal from 'scrollreveal';
import apiService from '../api';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    totalBookings: 0,
    approvedBookings: 0,
    totalTrainings: 0,
    totalEvents: 0,
    complaintsTrends: [],
    bookingsByEventType: [],
    trainingsUploadsOverTime: [],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    scrollreveal().reveal('.dashboard', { duration: 2000 });
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await apiService.get('/admin/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch dashboard data');
    }
  };

  return (
    <DashboardSection className="dashboard">
      <h2>Admin Dashboard</h2>
      {error && <ErrorBox>{error}</ErrorBox>}
      <StatsRow>
        <StatCard title="Total Complaints" value={dashboardData.totalComplaints} icon={<FaClipboardCheck />} />
        <StatCard title="Resolved Complaints" value={dashboardData.resolvedComplaints} icon={<FaClipboardCheck />} />
        <StatCard title="Pending Complaints" value={dashboardData.pendingComplaints} icon={<FaClipboardCheck />} />
        <StatCard title="Total Bookings" value={dashboardData.totalBookings} icon={<FaCalendarAlt />} />
        <StatCard title="Approved Bookings" value={dashboardData.approvedBookings} icon={<FaCalendarAlt />} />
        <StatCard title="Total Trainings" value={dashboardData.totalTrainings} icon={<FaBookOpen />} />
        <StatCard title="Total Events" value={dashboardData.totalEvents} icon={<FaCalendarAlt />} />
      </StatsRow>
      <ChartsRow>
        <ComplaintsTrendsChart data={dashboardData.complaintsTrends} />
        <BookingsByEventTypeChart data={dashboardData.bookingsByEventType} />
        <TrainingUploadsOverTimeChart data={dashboardData.trainingsUploadsOverTime} />
      </ChartsRow>
    </DashboardSection>
  );
};

// Component for displaying statistics in a card layout
const StatCard = ({ title, value, icon }) => (
  <Card>
    <CardIcon>{icon}</CardIcon>
    <h3>{title}</h3>
    <p>{value}</p>
  </Card>
);

// Component for the Complaints Trends Chart
const ComplaintsTrendsChart = ({ data }) => {
  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-GB') // Formats to DD/MM/YYYY
  }));

  return (
    <Card>
      <h3>Complaints Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#5B3F00" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

// Component for Bookings by Event Type Chart
const BookingsByEventTypeChart = ({ data }) => (
  <Card>
    <h3>Bookings by Event Type</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="event_type" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#5B3F00" barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  </Card>
);

// Component for Trainings Uploads Over Time Chart
const TrainingUploadsOverTimeChart = ({ data }) => {
  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-GB') // Formats to DD/MM/YYYY
  }));

  return (
    <Card>
      <h3>Training Uploads Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#4A90E2" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

// Styled Components for styling the dashboard layout
const DashboardSection = styled.section`
  padding: 2rem;
  background-color: #f9fafb;
  h2 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 2rem;
    text-align: center;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ChartsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
  h3 {
    color: #5B3F00;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  p {
    font-size: 2rem;
    color: #333;
    font-weight: bold;
  }
`;

const CardIcon = styled.div`
  font-size: 2rem;
  color: #5B3F00;
  margin-bottom: 0.5rem;
`;

const ErrorBox = styled.div`
  color: #5B3F00;
  background-color: #5B3F00;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: bold;
`;

export default AdminDashboard;
