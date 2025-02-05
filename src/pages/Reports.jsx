import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Download, 
  FileText, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  FilterIcon // Changed from Filter to FilterIcon
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import apiService from '../api';

const AdminReportPage = () => {
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
      // Fetch all data initially without date range
      fetchReportData();
  }, []);

  const fetchReportData = async (withDateRange = false) => {
    try {
        setLoading(true);
        const params = withDateRange ? {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
        } : {};

        const response = await apiService.get('/reports', { params });
        console.log('Response Data:', response.data); // Add this log
        setReportData(response.data);
    } catch (error) {
        console.error('Error fetching report data:', error);
    } finally {
        setLoading(false);
    }
};

  const handleFilter = () => {
      if (dateRange.startDate && dateRange.endDate) {
          fetchReportData(true);
      }
  };

  const clearFilter = () => {
      setDateRange({ startDate: '', endDate: '' });
      fetchReportData(false);
      setIsFilterVisible(false);
  };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const generatePDF = () => {
      const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
      });
  
      // Set up color scheme
      const colors = {
          primary: [120, 53, 15],     // Dark brown
          secondary: [217, 119, 6],   // Amber
          text: [0, 0, 0],            // Black
          background: [255, 251, 235] // Light cream
      };
  
      // Add custom header
      const addHeader = () => {
          // Background
          doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
          doc.rect(0, 0, 297, 210, 'F');
  
          // Logo or Organization Name (placeholder)
          doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
          doc.setFontSize(20);
          doc.setFont('helvetica', 'bold');
          doc.text('Inyamibwa System Report', 148, 15, { align: 'center' });
  
          // Date Range Filter (if applied)
          if (dateRange.startDate && dateRange.endDate) {
              doc.setFontSize(10);
              doc.setFont('helvetica', 'normal');
              doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
              doc.text(`Filtered from ${formatDate(dateRange.startDate)} to ${formatDate(dateRange.endDate)}`, 148, 22, { align: 'center' });
          }
  
          // Separator line
          doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
          doc.setLineWidth(0.5);
          doc.line(30, 25, 267, 25);
      };
  
      // Function to add a section to PDF
      const addSection = (title, columns, data, startY) => {
          if (!data || data.length === 0) return startY;
  
          doc.setFontSize(14);
          doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
          doc.text(title, 15, startY);
  
          // Prepare table data
          const tableData = data.map(item => 
              columns.map(col => {
                  // Special formatting for specific columns
                  if (col.key === 'event_date' || col.key === 'attendance_date') {
                      return formatDate(item[col.key]);
                  }
                  return item[col.key] || 'N/A';
              })
          );
  
          // Generate table
          autoTable(doc, {
              startY: startY + 5,
              head: [columns.map(col => col.label)],
              body: tableData,
              theme: 'striped',
              headStyles: {
                  fillColor: [colors.secondary[0], colors.secondary[1], colors.secondary[2]],
                  textColor: [255, 255, 255],
                  fontSize: 10
              },
              bodyStyles: {
                  fontSize: 9,
                  textColor: colors.text
              },
              alternateRowStyles: {
                  fillColor: [245, 245, 245]
              },
              tableWidth: 'auto',
              styles: {
                  cellPadding: 2
              }
          });
  
          // Return the Y position after the table
          return doc.lastAutoTable.finalY + 10;
      };
  
      // Add summary section
      const addSummary = (startY) => {
          doc.setFontSize(14);
          doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
          doc.text('Summary', 15, startY);
  
          const summaryData = [
              { label: 'Total Schedule', value: reportData.events ? (Array.isArray(reportData.events) ? reportData.events.length : 1) : 0 },
              { label: 'Total Bookings', value: reportData.bookings ? (Array.isArray(reportData.bookings) ? reportData.bookings.length : 1) : 0 },
              { label: 'Total Attendance Records', value: reportData.attendance ? (Array.isArray(reportData.attendance) ? reportData.attendance.length : 1) : 0 },
              { label: 'Total Complaints', value: reportData.complaints ? (Array.isArray(reportData.complaints) ? reportData.complaints.length : 1) : 0 },
              { label: 'Total Trainings', value: reportData.trainings ? (Array.isArray(reportData.trainings) ? reportData.trainings.length : 1) : 0 }
          ];
  
          autoTable(doc, {
              startY: startY + 5,
              body: summaryData.map(item => [item.label, item.value]),
              theme: 'plain',
              styles: {
                  fontSize: 10
              },
              columnStyles: {
                  0: { fontStyle: 'bold' }
              }
          });
      };
  
      // Add footer
      const addFooter = () => {
          const pageCount = doc.internal.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
              doc.setPage(i);
              doc.setFontSize(8);
              doc.setTextColor(100);
              doc.text(`Page ${i} of ${pageCount}`, 285, 205, { align: 'right' });
              
              // Add timestamp
              doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 205);
          }
      };
  
      // Start PDF generation
      doc.setFont('helvetica');
      
      // Add header
      addHeader();
  
      // Track Y position for sections
      let yPos = 35;
  
      // Add sections
      const sections = [
          { 
              title: 'Trainings Schedule', 
              columns: [
                  { key: 'title', label: 'Title' },
                  { key: 'venue', label: 'Venue' },
                  { key: 'event_date', label: 'Date' },
                  { key: 'event_time', label: 'Time' }
              ],
              data: reportData.events
          },
          { 
              title: 'Bookings', 
              columns: [
                  { key: 'user_name', label: 'Name' },
                  { key: 'event_type', label: 'Event Type' },
                  { key: 'event_date', label: 'Date' },
                  { key: 'status', label: 'Status' }
              ],
              data: reportData.bookings
          },
          { 
              title: 'Attendance', 
              columns: [
                  { key: 'user_name', label: 'User' },
                  { key: 'status', label: 'Status' },
                  { key: 'attendance_date', label: 'Date' }
              ],
              data: reportData.attendance
          },
          { 
              title: 'Complaints', 
              columns: [
                  { key: 'user_id', label: 'User' },
                  { key: 'status', label: 'Status' },
                  { key: 'created_at', label: 'Date' }
              ],
              data: reportData.complaints
          },
          { 
              title: 'Trainings', 
              columns: [
                  { key: 'title', label: 'Title' },
                  { key: 'file_type', label: 'Type' },
                  { key: 'uploaded_at', label: 'Uploaded' }
              ],
              data: reportData.trainings
          }
      ];
  
      // Add each section
      sections.forEach(section => {
          // Only add section if data exists
          if (section.data && (Array.isArray(section.data) ? section.data.length > 0 : section.data)) {
              yPos = addSection(section.title, section.columns, 
                  Array.isArray(section.data) ? section.data : [section.data], 
                  yPos
              );
          }
      });
  
      // Add summary section
      addSummary(yPos);
  
      // Add footer
      addFooter();
  
      // Save the PDF
      doc.save('Inyamibwa-Comprehensive-Report.pdf');
  };
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-8">
          <div className="max-w-7xl mx-auto">
              {/* Header with Filter Toggle */}
              <div className="flex justify-between items-center mb-8">
                  <div>
                      <h1 className="text-4xl font-bold text-amber-900 mb-2">
                          System Reports
                      </h1>
                      <div className="w-24 h-1 bg-amber-600"></div>
                  </div>
                  <div className="flex gap-4">
                      <button
                          onClick={() => setIsFilterVisible(!isFilterVisible)}
                          className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-900 rounded-lg hover:bg-amber-200 transition-all duration-200"
                      >
                          <FilterIcon className="w-5 h-5" />
                          {isFilterVisible ? 'Hide Filter' : 'Show Filter'}
                      </button>
                      <button
                          onClick={generatePDF}
                          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200"
                      >
                          <Download className="w-5 h-5" />
                          Download PDF
                      </button>
                  </div>
              </div>

              {/* Date Filter Section */}
              {isFilterVisible && (
                  <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Start Date
                              </label>
                              <div className="relative">
                                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
                                  <input
                                      type="date"
                                      value={dateRange.startDate}
                                      onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                      className="w-full pl-12 pr-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                  />
                              </div>
                          </div>
                          
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                  End Date
                              </label>
                              <div className="relative">
                                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
                                  <input
                                      type="date"
                                      value={dateRange.endDate}
                                      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                      className="w-full pl-12 pr-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                  />
                              </div>
                          </div>

                          <div className="flex items-end gap-4">
                              <button
                                  onClick={handleFilter}
                                  disabled={!dateRange.startDate || !dateRange.endDate}
                                  className="flex-1 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                  Apply Filter
                              </button>
                              <button
                                  onClick={clearFilter}
                                  className="flex-1 border border-amber-600 text-amber-600 px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors duration-200"
                              >
                                  Clear
                              </button>
                          </div>
                      </div>
                  </div>
              )}

                {/* Report Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bookings Section */}
                {reportData.bookings && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-amber-100">
                            <h2 className="text-xl font-semibold text-amber-900 flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Bookings
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-amber-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-amber-900">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-amber-900">Event</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-amber-900">Date</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-amber-900">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-amber-100">
                                    {Array.isArray(reportData.bookings) 
                                        ? reportData.bookings.map((booking) => (
                                            <tr key={booking.id} className="hover:bg-amber-50 transition-colors duration-150">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                                                            <span className="text-amber-700 font-medium">{booking.user_name[0]}</span>
                                                        </div>
                                                        <span className="ml-2 text-sm font-medium text-gray-900">{booking.user_name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{booking.event_type}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(booking.event_date)}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                        ${booking.status === 'approved' && 'bg-green-100 text-green-800'}
                                                        ${booking.status === 'rejected' && 'bg-red-100 text-red-800'}
                                                        ${(!booking.status || booking.status === 'pending') && 'bg-yellow-100 text-yellow-800'}
                                                    `}>
                                                        {booking.status || 'Pending'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                        : (
                                            <tr className="hover:bg-amber-50 transition-colors duration-150">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                                                            <span className="text-amber-700 font-medium">{reportData.bookings.user_name[0]}</span>
                                                        </div>
                                                        <span className="ml-2 text-sm font-medium text-gray-900">{reportData.bookings.user_name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{reportData.bookings.event_type}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(reportData.bookings.event_date)}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                        ${reportData.bookings.status === 'approved' && 'bg-green-100 text-green-800'}
                                                        ${reportData.bookings.status === 'rejected' && 'bg-red-100 text-red-800'}
                                                        ${(!reportData.bookings.status || reportData.bookings.status === 'pending') && 'bg-yellow-100 text-yellow-800'}
                                                    `}>
                                                        {reportData.bookings.status || 'Pending'}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

{/* Events Section */}
{reportData.events && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-amber-100">
                            <h2 className="text-xl font-semibold text-amber-900 flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                               Trainings Schedule 
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-amber-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-amber-900">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-amber-900">Venue</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-amber-900">Date</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-amber-900">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-amber-100">
                                    {Array.isArray(reportData.events)
                                        ? reportData.events.map((event) => (
                                            <tr key={event.id} className="hover:bg-amber-50 transition-colors duration-150">
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-medium text-gray-900">{event.title}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{event.venue}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(event.event_date)}</td>
                                                <td className="px-6 py-4 text-right text-sm text-gray-600">{event.event_time}</td>
                                            </tr>
                                        ))
                                        : (
                                            <tr className="hover:bg-amber-50 transition-colors duration-150">
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-medium text-gray-900">{reportData.events.title}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{reportData.events.venue}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(reportData.events.event_date)}</td>
                                                <td className="px-6 py-4 text-right text-sm text-gray-600">{reportData.events.event_time}</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}


{reportData.trainings && (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-amber-100">
            <h2 className="text-xl font-semibold text-amber-900 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Trainings
            </h2>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-amber-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-amber-900">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-amber-900">Type</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-amber-900">Uploaded</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                    {Array.isArray(reportData.trainings)
                        ? reportData.trainings.map((training) => (
                            <tr key={training.id} className="hover:bg-amber-50 transition-colors duration-150">
                                <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-gray-900">{training.title}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{training.file_type}</td>
                                <td className="px-6 py-4 text-right text-sm text-gray-600">
                                    {new Date(training.uploaded_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))
                        : (
                            <tr className="hover:bg-amber-50 transition-colors duration-150">
                                <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-gray-900">{reportData.trainings.title}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{reportData.trainings.file_type}</td>
                                <td className="px-6 py-4 text-right text-sm text-gray-600">
                                    {new Date(reportData.trainings.uploaded_at).toLocaleDateString()}
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    </div>
)}

{/* Complaints Section */}
{reportData.complaints && (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-amber-100">
            <h2 className="text-xl font-semibold text-amber-900 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Complaints
            </h2>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-amber-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-amber-900">User</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-amber-900">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-amber-900">Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                    {Array.isArray(reportData.complaints)
                        ? reportData.complaints.map((complaint) => (
                            <tr key={complaint.id} className="hover:bg-amber-50 transition-colors duration-150">
                                <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-gray-900">{complaint.user_id}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${complaint.status === 'resolved' && 'bg-green-100 text-green-800'}
                                        ${complaint.status === 'pending' && 'bg-yellow-100 text-yellow-800'}
                                        ${complaint.status === 'in-progress' && 'bg-blue-100 text-blue-800'}
                                    `}>
                                        {complaint.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-sm text-gray-600">
                                    {new Date(complaint.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))
                        : (
                            <tr className="hover:bg-amber-50 transition-colors duration-150">
                                <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-gray-900">{reportData.complaints.user_id}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${reportData.complaints.status === 'resolved' && 'bg-green-100 text-green-800'}
                                        ${reportData.complaints.status === 'pending' && 'bg-yellow-100 text-yellow-800'}
                                        ${reportData.complaints.status === 'in-progress' && 'bg-blue-100 text-blue-800'}
                                    `}>
                                        {reportData.complaints.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-sm text-gray-600">
                                    {new Date(reportData.complaints.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    </div>
)}

                    {/* Attendance Section */}
                   {/* Attendance Section */}
{(Array.isArray(reportData.attendance) ? reportData.attendance.length > 0 : reportData.attendance) && (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-amber-100">
            <h2 className="text-xl font-semibold text-amber-900 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Attendance
            </h2>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-amber-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-amber-900">User</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-amber-900">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-amber-900">Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                    {Array.isArray(reportData.attendance)
                        ? reportData.attendance.map((record) => (
                            <tr key={record.id} className="hover:bg-amber-50 transition-colors duration-150">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                                            <span className="text-amber-700 font-medium">
                                                {record.user_name[0]}
                                            </span>
                                        </div>
                                        <span className="ml-2 text-sm font-medium text-gray-900">
                                            {record.user_name}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                    `}>
                                        {record.status === 'present' ? (
                                            <CheckCircle className="w-3 h-3" />
                                        ) : (
                                            <XCircle className="w-3 h-3" />
                                        )}
                                        {record.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-sm text-gray-600">
                                    {formatDate(record.attendance_date)}
                                </td>
                            </tr>
                        ))
                        : (
                            <tr className="hover:bg-amber-50 transition-colors duration-150">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                                            <span className="text-amber-700 font-medium">
                                                {reportData.attendance.user_name[0]}
                                            </span>
                                        </div>
                                        <span className="ml-2 text-sm font-medium text-gray-900">
                                            {reportData.attendance.user_name}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${reportData.attendance.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                    `}>
                                        {reportData.attendance.status === 'present' ? (
                                            <CheckCircle className="w-3 h-3" />
                                        ) : (
                                            <XCircle className="w-3 h-3" />
                                        )}
                                        {reportData.attendance.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-sm text-gray-600">
                                    {formatDate(reportData.attendance.attendance_date)}
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    </div>
)}
                </div>

                {/* Empty State */}
                {Object.keys(reportData).length === 0 && !loading && (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <FileText className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reports Available</h3>
                        <p className="text-gray-600">
                            Select a date range and click 'Filter' to view reports.
                        </p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent mx-auto mb-4" />
                        <p className="text-gray-600">Loading reports...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReportPage;