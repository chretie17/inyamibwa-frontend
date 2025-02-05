import React, { useEffect, useState } from 'react';
import { Check, X, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import apiService from '../api';

const ComplaintsManagement = () => {
    const [complaints, setComplaints] = useState([]);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [responseText, setResponseText] = useState('');

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const response = await apiService.get('/complaints');
            setComplaints(response.data);
        } catch (error) {
            showNotification('Failed to fetch complaints.', 'error');
            console.error('Failed to fetch complaints:', error);
        }
    };

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    };

    const handleOpenResponseDialog = (complaint) => {
        setSelectedComplaint(complaint);
        setResponseText('');
    };

    const handleUpdateComplaint = async (status) => {
        if (!selectedComplaint) return;

        try {
            await apiService.put(`/complaints/${selectedComplaint.id}`, { 
                status, 
                response: responseText 
            });

            // Update local state
            setComplaints(prev => 
                prev.map(complaint => 
                    complaint.id === selectedComplaint.id 
                        ? { ...complaint, status, response: responseText } 
                        : complaint
                )
            );

            showNotification(`Complaint ${status} successfully`, 'success');
            setSelectedComplaint(null);
        } catch (error) {
            showNotification('Failed to update complaint.', 'error');
            console.error('Error updating complaint:', error);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
            case 'resolved': return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'rejected': return <XCircle className="h-5 w-5 text-red-600" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-amber-900">
                        Complaints Management
                    </h1>
                    <p className="mt-2 text-amber-700">
                        Manage and respond to user complaints
                    </p>
                </div>

                {/* Complaints Table */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-amber-200">
                            <thead className="bg-amber-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-amber-900">
                                        User
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-amber-900">
                                        Complaint
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-amber-900">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-amber-900">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-amber-100">
                                {complaints.length > 0 ? (
                                    complaints.map(complaint => (
                                        <tr 
                                            key={complaint.id}
                                            className="hover:bg-amber-50 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <div className="h-10 w-10 rounded-full bg-amber-200 flex items-center justify-center">
                                                            <span className="text-amber-700 font-semibold">
                                                                {complaint.user_name.charAt(0)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {complaint.user_name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {complaint.complaint_text}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex items-center">
                                                    {getStatusIcon(complaint.status)}
                                                    <span className={`ml-2 text-sm font-medium 
                                                        ${complaint.status === 'pending' ? 'text-yellow-600' : 
                                                          complaint.status === 'resolved' ? 'text-green-600' : 
                                                          'text-red-600'}`}
                                                    >
                                                        {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                {(complaint.status === 'pending' || complaint.status === 'reappealed') ? (
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleOpenResponseDialog({ ...complaint, status: 'resolved' })}
                                                            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                                                        >
                                                            Resolve
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenResponseDialog({ ...complaint, status: 'rejected' })}
                                                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 text-sm">No Actions</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-gray-500">
                                            No complaints found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Response Dialog */}
                {selectedComplaint && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                            <h2 className="text-2xl font-bold text-amber-900 mb-4">
                                Add Response to Complaint
                            </h2>
                            <textarea
                                className="w-full h-32 p-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                                placeholder="Enter your response..."
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                            />
                            <div className="mt-4 flex justify-end space-x-3">
                                <button
                                    onClick={() => setSelectedComplaint(null)}
                                    className="px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleUpdateComplaint(selectedComplaint.status)}
                                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                                >
                                    {selectedComplaint.status === 'resolved' ? 'Resolve' : 'Reject'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notification */}
                {notification.show && (
                    <div className="fixed bottom-4 right-4 flex items-center">
                        <div className={`
                            px-6 py-3 rounded-lg shadow-lg
                            ${notification.type === 'success' 
                                ? 'bg-green-500' 
                                : 'bg-red-500'
                            }
                            text-white font-medium
                            transform transition-all duration-500 ease-out
                            animate-slide-in
                        `}>
                            {notification.message}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplaintsManagement;