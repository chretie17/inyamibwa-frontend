import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Award } from 'lucide-react';
import api from '../api';

const AdminQualifications = () => {
    const [qualifications, setQualifications] = useState([]);
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: ''
    });

    useEffect(() => {
        fetchQualifications();
    }, []);

    const fetchQualifications = async () => {
        try {
            const response = await api.get('/qualifications');
            const sortedQualifications = response.data.sort((a, b) => 
                a.user_name.localeCompare(b.user_name)
            );
            setQualifications(sortedQualifications);
        } catch (error) {
            showNotification('Failed to fetch qualifications.', 'error');
            console.error('Error fetching qualifications:', error);
        }
    };

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    };

    const getQualificationColor = (qualification) => {
        switch(qualification) {
            case 'Expert':
                return 'bg-green-100 text-green-800';
            case 'Intermediate':
                return 'bg-amber-100 text-amber-800';
            case 'Beginner':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Award className="w-8 h-8 text-amber-600" />
                        <h1 className="text-3xl font-bold text-amber-900">
                            User Qualifications Overview
                        </h1>
                    </div>
                    <p className="text-amber-700 ml-11">
                        View and monitor user qualification levels
                    </p>
                </div>

                {/* Qualifications Table */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-amber-50">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-amber-900">
                                        User
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-amber-900">
                                        Qualification Level
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-amber-100">
                                {qualifications.map(({ user_id, user_name, qualification }) => (
                                    <tr 
                                        key={user_id}
                                        className="hover:bg-amber-50 transition-colors duration-150"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                                                    <span className="text-amber-700 font-semibold">
                                                        {user_name.charAt(0)}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {user_name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                                                ${getQualificationColor(qualification)}`}
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                {qualification || 'Not Set'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
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

export default AdminQualifications;