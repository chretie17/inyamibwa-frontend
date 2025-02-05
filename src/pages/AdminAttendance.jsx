import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Users, Calendar, CheckCheck, X, Download, FileText } from 'lucide-react';
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

    useEffect(() => {
        fetchAttendanceRecords();
    }, []);

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

    const generatePDF = async () => {
        setIsGeneratingPdf(true);
        try {
            const element = document.getElementById('attendance-table');
            const canvas = await html2canvas(element);
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            // Add title
            pdf.setFontSize(20);
            pdf.setTextColor(40);
            pdf.text('Attendance Records', 105, 15, { align: 'center' });
            
            // Add date
            pdf.setFontSize(10);
            pdf.setTextColor(100);
            pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });
            
            // Add table
            pdf.addImage(imgData, 'PNG', 0, 30, pdfWidth, pdfHeight);
            
            pdf.save('attendance-records.pdf');
            showNotification('PDF downloaded successfully!', 'success');
        } catch (error) {
            console.error('Error generating PDF:', error);
            showNotification('Failed to generate PDF.', 'error');
        }
        setIsGeneratingPdf(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-8">
            <div className="max-w-6xl mx-auto">
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
                        onClick={generatePDF}
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
                                                    <span className="text-sm font-medium text-gray-900">
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