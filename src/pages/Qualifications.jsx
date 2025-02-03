import React, { useState, useEffect } from 'react';
import { BookmarkPlus, Medal, Trophy, GraduationCap, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../api';

const Qualifications = () => {
    const [qualifications, setQualifications] = useState([]);
    const [loading, setLoading] = useState(true);
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
            setLoading(true);
            const response = await api.get('/qualifications');
            setQualifications(response.data);
        } catch (error) {
            showNotification('Failed to fetch qualifications.', 'error');
            console.error('Error fetching qualifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleQualificationChange = (userId, newQualification) => {
        setQualifications(prevQualifications =>
            prevQualifications.map(q =>
                q.user_id === userId ? { ...q, qualification: newQualification } : q
            )
        );
    };

    const handleUpdateQualification = async (userId, qualification) => {
        try {
            await api.post('/qualifications', { user_id: userId, qualification });
            showNotification('Qualification updated successfully!', 'success');
        } catch (error) {
            showNotification('Failed to update qualification.', 'error');
            console.error('Error updating qualification:', error);
        }
    };

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    };

    const qualificationLevels = [
        { value: 'Beginner', icon: Medal, color: 'text-blue-500' },
        { value: 'Intermediate', icon: Trophy, color: 'text-amber-500' },
        { value: 'Expert', icon: GraduationCap, color: 'text-green-500' }
    ];

    const QualificationIcon = ({ level }) => {
        const qualification = qualificationLevels.find(q => q.value === level);
        if (!qualification) return null;
        const Icon = qualification.icon;
        return <Icon className={`${qualification.color} w-5 h-5`} />;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-amber-900">
                        Qualifications Management
                    </h1>
                    <p className="mt-2 text-amber-700">
                        Manage and update user qualification levels
                    </p>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader className="w-8 h-8 text-amber-600 animate-spin" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-amber-50">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-amber-900">
                                            User
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-amber-900">
                                            Qualification Level
                                        </th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-amber-900">
                                            Actions
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
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user_name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="relative">
                                                    <select
                                                        value={qualification || ''}
                                                        onChange={(e) => handleQualificationChange(user_id, e.target.value)}
                                                        className="w-full px-4 py-2 pr-8 border border-amber-200 rounded-lg 
                                                            appearance-none bg-white
                                                            focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                                    >
                                                        {qualificationLevels.map(level => (
                                                            <option key={level.value} value={level.value}>
                                                                {level.value}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                        <QualificationIcon level={qualification} />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleUpdateQualification(user_id, qualification)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white 
                                                        rounded-lg hover:bg-amber-700 transform hover:-translate-y-0.5 
                                                        transition-all duration-200"
                                                >
                                                    <BookmarkPlus className="w-4 h-4" />
                                                    <span>Update</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Notification */}
                {notification.show && (
                    <div className="fixed bottom-4 right-4 flex items-center">
                        <div className={`
                            px-6 py-3 rounded-lg shadow-lg
                            ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}
                            text-white font-medium
                            transform transition-all duration-500 ease-out
                            animate-slide-in
                        `}>
                            <div className="flex items-center gap-2">
                                {notification.type === 'success' ? (
                                    <CheckCircle className="w-5 h-5" />
                                ) : (
                                    <AlertCircle className="w-5 h-5" />
                                )}
                                {notification.message}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Qualifications;