import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Button, TextField, Paper, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import apiService from '../api';

const themeColors = {
  primary: '#00447b',
  secondary: '#f5f5f5',
  accent: '#ffd700',
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 68, 123, 0.1)',
  backgroundColor: '#ffffff',
  marginBottom: theme.spacing(4),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.spacing(5),
  fontWeight: 'bold',
  textTransform: 'none',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 68, 123, 0.2)',
  },
}));

const AdminReportPage = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReportData(); // Fetch overall report data on initial load
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(`/reports`, {
        params: {
          startDate: dateRange[0]?.format('YYYY-MM-DD'),
          endDate: dateRange[1]?.format('YYYY-MM-DD'),
        },
      });
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(24);
    doc.setTextColor(themeColors.primary);
    doc.text('Detailed System Report', pageWidth / 2, 20, { align: 'center' });

    // Complaints Section
    if (reportData.complaints) {
      autoTable(doc, {
        startY: 30,
        head: [['Status', 'Count']],
        body: [[reportData.complaints.status, reportData.complaints.count]],
        theme: 'grid',
      });
    }

    // Bookings Section
    if (reportData.bookings) {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Event Type', 'Status', 'Count']],
        body: [[reportData.bookings.event_type, reportData.bookings.status, reportData.bookings.count]],
        theme: 'grid',
      });
    }

    // Trainings Section
    if (reportData.trainings) {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['File Type', 'Count']],
        body: [[reportData.trainings.file_type, reportData.trainings.count]],
        theme: 'grid',
      });
    }

    // Events Section
    if (reportData.events) {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Title', 'Description', 'Venue', 'Date', 'Time']],
        body: [[
          reportData.events.title,
          reportData.events.description,
          reportData.events.venue,
          reportData.events.date,
          reportData.events.time
        ]],
        theme: 'grid',
      });
    }

    // Attendance Section
    if (reportData.attendance) {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Date', 'Status', 'User Name']],
        body: [[
          reportData.attendance.date,
          reportData.attendance.status,
          reportData.attendance.user_name
        ]],
        theme: 'grid',
      });
    }

    doc.save('System-Report.pdf');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" sx={{ mb: 4, color: themeColors.primary, fontWeight: 'bold', textAlign: 'center' }}>
        System Report Generation
      </Typography>
      <StyledPaper elevation={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Start Date"
                value={dateRange[0]}
                onChange={(newValue) => setDateRange([newValue, dateRange[1]])}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <Box sx={{ my: 2 }} />
              <DatePicker
                label="End Date"
                value={dateRange[1]}
                onChange={(newValue) => setDateRange([dateRange[0], newValue])}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledButton
                variant="contained"
                sx={{ backgroundColor: themeColors.primary }}
                onClick={fetchReportData}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Fetch Report Data'}
              </StyledButton>
              <StyledButton
                variant="outlined"
                sx={{ color: themeColors.primary, borderColor: themeColors.primary }}
                onClick={generatePDF}
                disabled={!reportData.complaints}
              >
                Download Report
              </StyledButton>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </StyledPaper>

      <Box sx={{ mt: 4 }}>
        {reportData.complaints && (
          <StyledPaper elevation={3}>
            <Typography variant="h5" sx={{ mb: 3, color: themeColors.primary, fontWeight: 'bold' }}>
              Complaints Summary
            </Typography>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{reportData.complaints.status}</td>
                  <td>{reportData.complaints.count}</td>
                </tr>
              </tbody>
            </table>
          </StyledPaper>
        )}

        {reportData.trainings && (
          <StyledPaper elevation={3}>
            <Typography variant="h5" sx={{ mb: 3, color: themeColors.primary, fontWeight: 'bold' }}>
              Trainings Summary
            </Typography>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>File Type</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{reportData.trainings.file_type}</td>
                  <td>{reportData.trainings.count}</td>
                </tr>
              </tbody>
            </table>
          </StyledPaper>
        )}

        {reportData.bookings && (
          <StyledPaper elevation={3}>
            <Typography variant="h5" sx={{ mb: 3, color: themeColors.primary, fontWeight: 'bold' }}>
              Bookings Summary
            </Typography>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Event Type</th>
                  <th>Status</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{reportData.bookings.event_type}</td>
                  <td>{reportData.bookings.status}</td>
                  <td>{reportData.bookings.count}</td>
                </tr>
              </tbody>
            </table>
          </StyledPaper>
        )}

        {reportData.events && (
          <StyledPaper elevation={3}>
            <Typography variant="h5" sx={{ mb: 3, color: themeColors.primary, fontWeight: 'bold' }}>
              Schedule Summary
            </Typography>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Venue</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{reportData.events.title}</td>
                  <td>{reportData.events.description}</td>
                  <td>{reportData.events.venue}</td>
                  <td>{reportData.events.date}</td>
                  <td>{reportData.events.time}</td>
                </tr>
              </tbody>
            </table>
          </StyledPaper>
        )}

        {reportData.attendance && (
          <StyledPaper elevation={3}>
            <Typography variant="h5" sx={{ mb: 3, color: themeColors.primary, fontWeight: 'bold' }}>
              Attendance Summary
            </Typography>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>User Name</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{reportData.attendance.date}</td>
                  <td>{reportData.attendance.status}</td>
                  <td>{reportData.attendance.user_name}</td>
                </tr>
              </tbody>
            </table>
          </StyledPaper>
        )}
      </Box>
    </Container>
  );
};

export default AdminReportPage;
