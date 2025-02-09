import React, { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import api from '../api';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        username: '',
        role: '',
        qualifications: '',
        password: ''
    });

    const roles = ['admin', 'trainer', 'user'];
    const qualifications = ['Beginner', 'Intermediate', 'Expert'];

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                if (Array.isArray(response.data)) {
                    setUsers(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleOpenDialog = (user = null) => {
        setSelectedUser(user);
        setNewUser(user ? { ...user, password: '' } : {
            name: '',
            email: '',
            username: '',
            role: '',
            qualifications: '',
            password: ''
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveUser = async () => {
        try {
            if (selectedUser) {
                await api.put(`/users/${selectedUser.id}`, newUser);
                setUsers(users.map((user) => (user.id === selectedUser.id ? { ...newUser, password: undefined } : user)));
            } else {
                const response = await api.post('/users', newUser);
                setUsers([...users, response.data]);
            }
            handleCloseDialog();
        } catch (error) {
            console.error('Failed to save user:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await api.delete(`/users/${userId}`);
            setUsers(users.filter((user) => user.id !== userId));
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#FEF8DF] p-8">
            <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-[#DAA520]">Manage Users</h1>
                        <button
                            onClick={() => handleOpenDialog()}
                            className="px-6 py-3 bg-[#DAA520] hover:bg-[#B8860B] text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Add New User
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl shadow-xl">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#FEF8DF]">
                                    <th className="px-6 py-4 text-left text-[#DAA520] font-bold text-lg">Name</th>
                                    <th className="px-6 py-4 text-left text-[#DAA520] font-bold text-lg">Email</th>
                                    <th className="px-6 py-4 text-left text-[#DAA520] font-bold text-lg">Username</th>
                                    <th className="px-6 py-4 text-left text-[#DAA520] font-bold text-lg">Role</th>
                                    <th className="px-6 py-4 text-left text-[#DAA520] font-bold text-lg">Qualifications</th>
                                    <th className="px-6 py-4 text-left text-[#DAA520] font-bold text-lg">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id} className="border-b border-[#FEF8DF] hover:bg-[#FEF8DF] transition-colors duration-200">
                                            <td className="px-6 py-4 text-gray-800">{user.name}</td>
                                            <td className="px-6 py-4 text-gray-800">{user.email}</td>
                                            <td className="px-6 py-4 text-gray-800">{user.username}</td>
                                            <td className="px-6 py-4 text-gray-800">{user.role}</td>
                                            <td className="px-6 py-4 text-gray-800">{user.qualifications}</td>
                                            <td className="px-6 py-4 space-x-2">
                                                <button
                                                    onClick={() => handleOpenDialog(user)}
                                                    className="p-2 text-[#DAA520] hover:text-[#B8860B] transition-colors duration-200 hover:bg-[#FEF8DF] rounded-lg"
                                                >
                                                    <Edit className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="p-2 text-red-500 hover:text-red-700 transition-colors duration-200 hover:bg-[#FEF8DF] rounded-lg"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500 italic bg-white">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {openDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 transform transition-all">
                        <h2 className="text-2xl font-bold text-[#DAA520] mb-6">
                            {selectedUser ? 'Edit User' : 'Add New User'}
                        </h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={newUser.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#DAA520] focus:border-transparent bg-[#FEF8DF] placeholder-gray-400"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={newUser.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#DAA520] focus:border-transparent bg-[#FEF8DF] placeholder-gray-400"
                            />
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={newUser.username}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#DAA520] focus:border-transparent bg-[#FEF8DF] placeholder-gray-400"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={newUser.password}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#DAA520] focus:border-transparent bg-[#FEF8DF] placeholder-gray-400"
                            />
                            <select
                                name="role"
                                value={newUser.role}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#DAA520] focus:border-transparent bg-[#FEF8DF] text-gray-700"
                            >
                                <option value="" disabled>Select Role</option>
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="qualifications"
                                value={newUser.qualifications}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#DAA520] focus:border-transparent bg-[#FEF8DF] text-gray-700"
                            >
                                <option value="" disabled>Select Qualifications</option>
                                {qualifications.map((qual) => (
                                    <option key={qual} value={qual}>
                                        {qual}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-8 flex justify-end space-x-4">
                            <button
                                onClick={handleCloseDialog}
                                className="px-6 py-3 text-gray-600 font-bold hover:text-gray-800 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveUser}
                                className="px-6 py-3 bg-[#DAA520] hover:bg-[#B8860B] text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                {selectedUser ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;