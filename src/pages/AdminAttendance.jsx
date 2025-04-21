import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Users, Calendar, CheckCheck, X, Download, FileText, User, ArrowLeft } from 'lucide-react';
import api from '../api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const AdminAttendance = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: ''
    });
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userAttendance, setUserAttendance] = useState([]);
    const [uniqueUsers, setUniqueUsers] = useState([]);

    useEffect(() => {
        fetchAttendanceRecords();
    }, []);

    useEffect(() => {
        if (attendanceRecords.length > 0) {
            // Extract unique users from records
            const users = [...new Set(attendanceRecords.map(record => record.user_name))];
            setUniqueUsers(users);
        }
    }, [attendanceRecords]);

    useEffect(() => {
        if (selectedUser) {
            // Filter attendance records for selected user
            const userRecords = attendanceRecords.filter(
                record => record.user_name === selectedUser
            );
            setUserAttendance(userRecords);
        }
    }, [selectedUser, attendanceRecords]);

    const fetchAttendanceRecords = async () => {
        try {
            const response = await api.get('/attendance/all');
            const sortedRecords = response.data.sort((a, b) => 
                new Date(b.date) - new Date(a.date)
            );
            setAttendanceRecords(sortedRecords);
        } catch (error) {
            showNotification('Failed to fetch attendance records.', 'error');
            console.error('Error fetching attendance:', error);
        }
    };

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const generatePDF = async (isUserReport = false) => {
        setIsGeneratingPdf(true);
        try {
            const elementId = isUserReport ? 'user-attendance-table' : 'attendance-table';
            const element = document.getElementById(elementId);
            const canvas = await html2canvas(element);
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            // Add title
            pdf.setFontSize(20);
            pdf.setTextColor(40);
            const title = isUserReport 
                ? `Attendance Records: ${selectedUser}`
                : 'Attendance Records';
            pdf.text(title, 105, 15, { align: 'center' });
            
            // Add date
            pdf.setFontSize(10);
            pdf.setTextColor(100);
            pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });
            
            // Add table
            pdf.addImage(imgData, 'PNG', 0, 30, pdfWidth, pdfHeight);
            
            const filename = isUserReport 
                ? `attendance-records-${selectedUser.toLowerCase().replace(/\s+/g, '-')}.pdf`
                : 'attendance-records.pdf';
            pdf.save(filename);
            showNotification('PDF downloaded successfully!', 'success');
        } catch (error) {
            console.error('Error generating PDF:', error);
            showNotification('Failed to generate PDF.', 'error');
        }
        setIsGeneratingPdf(false);
    };

    const viewUserAttendance = (userName) => {
        setSelectedUser(userName);
    };

    const backToAllRecords = () => {
        setSelectedUser(null);
    };

    // Calculate attendance statistics for a user
    const calculateUserStats = (userName) => {
        const userRecords = attendanceRecords.filter(record => record.user_name === userName);
        const totalRecords = userRecords.length;
        const presentRecords = userRecords.filter(record => record.status === 'present').length;
        const attendanceRate = totalRecords > 0 ? (presentRecords / totalRecords * 100).toFixed(1) : 0;
        
        return {
            total: totalRecords,
            present: presentRecords,
            absent: totalRecords - presentRecords,
            attendanceRate: attendanceRate
        };
    };

    // For individual user attendance view
    const renderUserAttendanceView = () => {
        const stats = calculateUserStats(selectedUser);
        
        return (
            <>
                {/* Header with back button */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <User className="w-8 h-8 text-amber-600" />
                            <h1 className="text-3xl font-bold text-amber-900">
                                {selectedUser}'s Attendance
                            </h1>
                        </div>
                        <p className="text-amber-700 ml-11">
                            Individual attendance history and statistics
                        </p>
                    </div>
                    
                    <div className="flex gap-3">
                        <button
                            onClick={backToAllRecords}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-amber-700 border border-amber-300 
                                bg-amber-50 hover:bg-amber-100 transform hover:-translate-y-0.5
                                transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to All Records</span>
                        </button>
                        
                        <button
                            onClick={() => generatePDF(true)}
                            disabled={isGeneratingPdf}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white
                                ${isGeneratingPdf 
                                    ? 'bg-amber-400 cursor-wait' 
                                    : 'bg-amber-600 hover:bg-amber-700 transform hover:-translate-y-0.5'}
                                transition-all duration-200 shadow-lg hover:shadow-xl`}
                        >
                            {isGeneratingPdf ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                    <span>Generating PDF...</span>
                                </>
                            ) : (
                                <>
                                    <FileText className="w-5 h-5" />
                                    <span>Download as PDF</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="text-sm font-medium text-amber-700 mb-1">Total Sessions</div>
                        <div className="text-3xl font-bold text-amber-900">{stats.total}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="text-sm font-medium text-green-700 mb-1">Present</div>
                        <div className="text-3xl font-bold text-green-600">{stats.present}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="text-sm font-medium text-red-700 mb-1">Absent</div>
                        <div className="text-3xl font-bold text-red-600">{stats.absent}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="text-sm font-medium text-indigo-700 mb-1">Attendance Rate</div>
                        <div className="text-3xl font-bold text-indigo-600">{stats.attendanceRate}%</div>
                    </div>
                </div>

                {/* User Attendance Table */}
                <div id="user-attendance-table" className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-amber-50">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-amber-900">
                                        Date
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-amber-900">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-amber-100">
                                {userAttendance.length > 0 ? (
                                    userAttendance.map((record) => (
                                        <tr 
                                            key={record.id}
                                            className="hover:bg-amber-50 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4 text-amber-600" />
                                                    {formatDate(record.date)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`
                                                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                                                    ${record.status === 'present' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'}
                                                `}>
                                                    {record.status === 'present' ? (
                                                        <CheckCheck className="w-3 h-3" />
                                                    ) : (
                                                        <X className="w-3 h-3" />
                                                    )}
                                                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-8 text-center text-gray-500 italic">
                                            No attendance records found for this user
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        );
    };

    // Main view with all user records
    const renderAllAttendanceView = () => {
        return (
            <>
                {/* Header with Download Button */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="w-8 h-8 text-amber-600" />
                            <h1 className="text-3xl font-bold text-amber-900">
                                Attendance Records
                            </h1>
                        </div>
                        <p className="text-amber-700 ml-11">
                            Track and monitor user attendance history
                        </p>
                    </div>
                    
                    <button
                        onClick={() => generatePDF(false)}
                        disabled={isGeneratingPdf}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white
                            ${isGeneratingPdf 
                                ? 'bg-amber-400 cursor-wait' 
                                : 'bg-amber-600 hover:bg-amber-700 transform hover:-translate-y-0.5'}
                            transition-all duration-200 shadow-lg hover:shadow-xl`}
                    >
                        {isGeneratingPdf ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                <span>Generating PDF...</span>
                            </>
                        ) : (
                            <>
                                <FileText className="w-5 h-5" />
                                <span>Download as PDF</span>
                            </>
                        )}
                    </button>
                </div>

                {/* User Selection Cards */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-amber-900 mb-4">User Reports</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {uniqueUsers.map(userName => {
                            const stats = calculateUserStats(userName);
                            return (
                                <div 
                                    key={userName}
                                    onClick={() => viewUserAttendance(userName)}
                                    className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow cursor-pointer"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                                            <span className="text-amber-700 font-semibold">
                                                {userName.charAt(0)}
                                            </span>
                                        </div>
                                        <span className="font-medium text-gray-900">
                                            {userName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <div>
                                            <span className="text-gray-500">Attendance:</span>
                                            <span className="ml-1 font-medium text-indigo-600">{stats.attendanceRate}%</span>
                                        </div>
                                        <div>
                                            <span className="px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                                View Details
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Attendance Table */}
                <div id="attendance-table" className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-amber-50">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-amber-900">
                                        User
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-amber-900">
                                        Date
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-amber-900">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-amber-100">
                                {attendanceRecords.length > 0 ? (
                                    attendanceRecords.map((record) => (
                                        <tr 
                                            key={record.id}
                                            className="hover:bg-amber-50 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                                                        <span className="text-amber-700 font-semibold">
                                                            {record.user_name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <span 
                                                        className="text-sm font-medium text-gray-900 hover:text-amber-700 cursor-pointer"
                                                        onClick={() => viewUserAttendance(record.user_name)}
                                                    >
                                                        {record.user_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4 text-amber-600" />
                                                    {formatDate(record.date)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`
                                                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                                                    ${record.status === 'present' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'}
                                                `}>
                                                    {record.status === 'present' ? (
                                                        <CheckCheck className="w-3 h-3" />
                                                    ) : (
                                                        <X className="w-3 h-3" />
                                                    )}
                                                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500 italic">
                                            No attendance records found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-8">
            <div className="max-w-6xl mx-auto">
                {selectedUser ? renderUserAttendanceView() : renderAllAttendanceView()}

                {/* Notification */}
                {notification.show && (
                    <div className="fixed bottom-4 right-4 flex items-center">
                        <div className={`
                            px-6 py-3 rounded-lg shadow-lg flex items-center gap-2
                            ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}
                            text-white font-medium
                            transform transition-all duration-500 ease-out
                            animate-slide-in
                        `}>
                            {notification.type === 'success' ? (
                                <CheckCircle className="w-5 h-5" />
                            ) : (
                                <AlertCircle className="w-5 h-5" />
                            )}
                            {notification.message}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAttendance;