import React, { useState, useEffect } from 'react';
import { 
    AlertCircle, 
    CheckCircle, 
    XCircle, 
    RefreshCw, 
    FileText 
} from 'lucide-react';
import apiService from '../api';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [newComplaint, setNewComplaint] = useState('');
    const [notification, setNotification] = useState({ 
        show: false, 
        message: '', 
        type: '' 
    });
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchComplaints();
    }, [userId]);

    const fetchComplaints = async () => {
        try {
            const response = await apiService.get(`/complaints/user/${userId}`);
            setComplaints(response.data);
        } catch (error) {
            showNotification('Failed to fetch complaints', 'error');
        }
    };

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    const handleSubmitComplaint = async () => {
        if (!newComplaint.trim()) {
            showNotification('Please enter a complaint message', 'warning');
            return;
        }

        try {
            await apiService.post('/complaints/file', { 
                user_id: userId, 
                complaint_text: newComplaint 
            });

            showNotification('Complaint submitted successfully', 'success');
            setNewComplaint('');
            
            // Optimistically update the list
            setComplaints(prev => [...prev, { 
                complaint_text: newComplaint, 
                status: 'Pending', 
                response: '',
                created_at: new Date().toISOString()
            }]);
        } catch (error) {
            showNotification('Failed to submit complaint', 'error');
        }
    };

    const handleReappeal = async (id) => {
        try {
            await apiService.post(`/complaints/reappeal/${id}`);
            showNotification('Reappeal submitted', 'success');
            
            setComplaints(prev => 
                prev.map(comp => 
                    comp.id === id ? { ...comp, status: 'Reappealed' } : comp
                )
            );
        } catch (error) {
            showNotification('Failed to reappeal complaint', 'error');
        }
    };

    const handleCloseCase = async (id) => {
        try {
            await apiService.put(`/complaints/${id}`, { status: 'closed' });
            showNotification('Case closed successfully', 'success');
            
            setComplaints(prev => 
                prev.map(comp => 
                    comp.id === id ? { ...comp, status: 'closed' } : comp
                )
            );
        } catch (error) {
            showNotification('Failed to close case', 'error');
        }
    };

    const getStatusDetails = (status) => {
        switch(status) {
            case 'pending': 
                return { 
                    icon: <AlertCircle className="w-5 h-5 text-yellow-500" />, 
                    color: 'bg-yellow-100 text-yellow-800' 
                };
            case 'resolved': 
                return { 
                    icon: <CheckCircle className="w-5 h-5 text-green-500" />, 
                    color: 'bg-green-100 text-green-800' 
                };
            case 'rejected': 
                return { 
                    icon: <XCircle className="w-5 h-5 text-red-500" />, 
                    color: 'bg-red-100 text-red-800' 
                };
            case 'reappealed': 
                return { 
                    icon: <RefreshCw className="w-5 h-5 text-purple-500" />, 
                    color: 'bg-purple-100 text-purple-800' 
                };
            case 'closed':
                  return { 
                      icon: <XCircle className="w-5 h-5 text-gray-500" />, 
                      color: 'bg-gray-100 text-gray-800' 
                  };   
            default: 
                return { 
                    icon: <FileText className="w-5 h-5 text-gray-500" />, 
                    color: 'bg-gray-100 text-gray-800' 
                };
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-amber-900 mb-4">
                        Complaint Management
                    </h1>
                    <div className="h-1 w-24 bg-amber-600 mx-auto"></div>
                </div>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {/* New Complaint Section */}
                    <div className="md:col-span-1 bg-white rounded-2xl shadow-xl p-6">
                        <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center">
                            <FileText className="mr-3 text-amber-600" />
                            File a Complaint
                        </h2>
                        <textarea
                            className="w-full h-40 p-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                            placeholder="Describe your complaint..."
                            value={newComplaint}
                            onChange={(e) => setNewComplaint(e.target.value)}
                        />
                        <button
                            onClick={handleSubmitComplaint}
                            className="w-full mt-4 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors"
                        >
                            Submit Complaint
                        </button>
                    </div>

                    {/* Complaints List */}
                    <div className="md:col-span-2 bg-white rounded-2xl shadow-xl">
                        <div className="p-6 border-b border-amber-100">
                            <h2 className="text-2xl font-bold text-amber-900">
                                Previous Complaints
                            </h2>
                        </div>

                        {complaints.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="mx-auto w-16 h-16 text-amber-300 mb-4" />
                                <p className="text-gray-500">
                                    No complaints found. Your filed complaints will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-amber-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-amber-900">
                                                Complaint
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-amber-900">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-amber-900">
                                                Response
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-amber-900">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-amber-100">
                                        {complaints.map((complaint) => {
                                            const { icon, color } = getStatusDetails(complaint.status);
                                            return (
                                                <tr 
                                                    key={complaint.id} 
                                                    className="hover:bg-amber-50 transition-colors duration-150"
                                                >
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {complaint.complaint_text}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`
                                                            inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium
                                                            ${color}
                                                        `}>
                                                            {icon}
                                                            {complaint.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {complaint.response || 'No response yet'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {(complaint.status === 'resolved' || 
                                                          complaint.status === 'rejected') && (
                                                            <div className="flex justify-end space-x-2">
                                                                <button
                                                                    onClick={() => handleReappeal(complaint.id)}
                                                                    className="px-3 py-1 bg-purple-500 text-white rounded-md text-xs hover:bg-purple-600 transition-colors"
                                                                >
                                                                    Reappeal
                                                                </button>
                                                                <button
                                                                    onClick={() => handleCloseCase(complaint.id)}
                                                                    className="px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600 transition-colors"
                                                                >
                                                                    Close
                                                                </button>
                                                            </div>
                                                        )}
                                                        {(complaint.status === 'pending' || 
                                                          complaint.status === 'reappealed') && (
                                                            <button
                                                                onClick={() => handleCloseCase(complaint.id)}
                                                                className="px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600 transition-colors"
                                                            >
                                                                Close
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Notification */}
            {notification.show && (
                <div className="fixed bottom-4 right-4 flex items-center">
                    <div className={`
                        px-6 py-3 rounded-lg shadow-lg
                        ${notification.type === 'success' 
                            ? 'bg-green-500' 
                            : notification.type === 'error'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
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
    );
};

export default Complaints;