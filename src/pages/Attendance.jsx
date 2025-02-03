import React, { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import api from '../api';

const Attendance = () => {
    const [users, setUsers] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            const filteredUsers = response.data.filter(user => user.role === 'user');
            setUsers(filteredUsers);
            setAttendance(filteredUsers.reduce((acc, user) => ({ ...acc, [user.id]: false }), {}));
        } catch (error) {
            showNotification('Failed to fetch users.', 'error');
            console.error('Failed to fetch users:', error);
        }
    };

    const handleAttendanceToggle = (userId) => {
        setAttendance(prev => ({ ...prev, [userId]: !prev[userId] }));
    };

    const handleSubmitAttendance = async () => {
        const attendanceData = Object.keys(attendance).map(userId => ({
            user_id: userId,
            status: attendance[userId] ? 'present' : 'absent',
        }));
        try {
            const response = await api.post('/attendance/mark', attendanceData);
            showNotification(response.data.message, 'success');
            setIsAttendanceMarked(response.data.message.includes('already recorded'));
        } catch (error) {
            const message = error.response?.data?.message || 'Error marking attendance.';
            showNotification(message, 'error');
            console.error('Error marking attendance:', error);
        }
    };

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-amber-900">
                        Attendance Management
                    </h1>
                    <p className="mt-2 text-amber-700">
                        Mark attendance for today's session
                    </p>
                </div>

                {/* Attendance Table */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-amber-200">
                            <thead className="bg-amber-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-amber-900">
                                        User
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-amber-900">
                                        Attendance
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-amber-100">
                                {users.map(user => (
                                    <tr 
                                        key={user.id}
                                        className="hover:bg-amber-50 transition-colors duration-150"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-amber-200 flex items-center justify-center">
                                                        <span className="text-amber-700 font-semibold">
                                                            {user.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => handleAttendanceToggle(user.id)}
                                                disabled={isAttendanceMarked}
                                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                                                    attendance[user.id] 
                                                        ? 'bg-amber-600' 
                                                        : 'bg-gray-200'
                                                } ${isAttendanceMarked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <span
                                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                        attendance[user.id] ? 'translate-x-5' : 'translate-x-0'
                                                    }`}
                                                >
                                                    {attendance[user.id] ? (
                                                        <Check className="h-3 w-3 text-amber-600 m-1" />
                                                    ) : (
                                                        <X className="h-3 w-3 text-gray-400 m-1" />
                                                    )}
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleSubmitAttendance}
                        disabled={isAttendanceMarked}
                        className={`
                            px-8 py-3 rounded-xl text-white font-semibold
                            transform transition-all duration-200
                            ${isAttendanceMarked
                                ? 'bg-amber-300 cursor-not-allowed'
                                : 'bg-amber-600 hover:bg-amber-700 hover:-translate-y-0.5 hover:shadow-lg'
                            }
                        `}
                    >
                        {isAttendanceMarked ? 'Attendance Marked' : 'Submit Attendance'}
                    </button>
                </div>

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

export default Attendance;