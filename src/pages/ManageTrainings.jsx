import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, Upload, X, Video, FileText, AlertCircle } from 'lucide-react';
import api from '../api';

const Trainings = () => {
    const [trainings, setTrainings] = useState([]);
    const [userNames, setUserNames] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [isConfirmDelete, setIsConfirmDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [selectedTraining, setSelectedTraining] = useState(null);
    const [newTraining, setNewTraining] = useState({
        title: '',
        description: '',
        file: null,
        fileType: '',
        uploadedBy: localStorage.getItem('userId') || '',
    });

    const fileTypes = ['video', 'pdf'];

    useEffect(() => {
        fetchTrainings();
    }, []);

    const fetchTrainings = async () => {
        try {
            const response = await api.get('/trainings');
            setTrainings(response.data);
            fetchUserNames(response.data);
        } catch (error) {
            console.error('Failed to fetch trainings:', error);
        }
    };

    const fetchUserNames = async (trainings) => {
        const userIds = [...new Set(trainings.map((training) => training.uploaded_by))];
        const userNamesMap = {};

        await Promise.all(
            userIds.map(async (userId) => {
                const response = await api.get(`/users/${userId}`);
                userNamesMap[userId] = response.data.name;
            })
        );

        setUserNames(userNamesMap);
    };

    const handleOpenModal = (training = null) => {
        setSelectedTraining(training);
        setNewTraining(
            training
                ? {
                    title: training.title,
                    description: training.description,
                    fileType: training.file_type,
                    uploadedBy: training.uploaded_by,
                    file: null
                }
                : {
                    title: '',
                    description: '',
                    file: null,
                    fileType: '',
                    uploadedBy: localStorage.getItem('userId') || '',
                }
        );
        setIsModalOpen(true);
    };

    const handleViewTraining = (training) => {
        setSelectedTraining(training);
        setIsViewerOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTraining((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewTraining(prev => ({ 
                ...prev, 
                file,
                fileType: file.type.includes('video') ? 'video' : 'pdf'
            }));
        }
    };

    const handleSaveTraining = async () => {
        try {
            const formData = new FormData();
            formData.append('title', newTraining.title);
            formData.append('description', newTraining.description);
            formData.append('fileType', newTraining.fileType);
            formData.append('uploadedBy', newTraining.uploadedBy);
            if (newTraining.file) formData.append('file', newTraining.file);

            if (selectedTraining) {
                await api.put(`/trainings/${selectedTraining.id}`, formData);
            } else {
                await api.post('/trainings', formData);
            }
            
            fetchTrainings();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save training:', error);
        }
    };

    const handleDeletePrompt = (id) => {
        setDeleteId(id);
        setIsConfirmDelete(true);
    };

    const handleDeleteTraining = async () => {
        try {
            await api.delete(`/trainings/${deleteId}`);
            setTrainings(trainings.filter((training) => training.id !== deleteId));
            setIsConfirmDelete(false);
        } catch (error) {
            console.error('Failed to delete training:', error);
        }
    };

    const handleOpenPDF = (training) => {
        if (training.file_data) {
            const byteCharacters = atob(training.file_data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(blob);
            window.open(pdfUrl, '_blank');
            setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-amber-900">
                        Training Management
                    </h1>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl
                            hover:bg-amber-700 transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        <Plus size={20} />
                        <span>Add New Training</span>
                    </button>
                </div>

                {/* Training Table */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-amber-50">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-amber-900">Title</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-amber-900">Description</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-amber-900">Type</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-amber-900">Uploaded By</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-amber-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-amber-100">
                                {trainings.length > 0 ? (
                                    trainings.map((training) => (
                                        <tr 
                                            key={training.id}
                                            className="hover:bg-amber-50 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {training.file_type === 'video' ? (
                                                        <Video className="w-5 h-5 text-amber-600" />
                                                    ) : (
                                                        <FileText className="w-5 h-5 text-amber-600" />
                                                    )}
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {training.title}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">{training.description}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    bg-amber-100 text-amber-800">
                                                    {training.file_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">
                                                    {userNames[training.uploaded_by] || training.uploaded_by}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewTraining(training)}
                                                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors duration-200"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenModal(training)}
                                                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors duration-200"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeletePrompt(training.id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">
                                            No trainings found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add/Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all">
                            <div className="flex justify-between items-center p-6 border-b border-amber-100">
                                <h2 className="text-xl font-semibold text-amber-900">
                                    {selectedTraining ? 'Edit Training' : 'Add New Training'}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={newTraining.title}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={newTraining.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        File Type
                                    </label>
                                    <select
                                        name="fileType"
                                        value={newTraining.fileType}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    >
                                        <option value="">Select Type</option>
                                        {fileTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Upload File
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-amber-600 rounded-lg border-2 border-amber-200 border-dashed cursor-pointer hover:border-amber-300">
                                            <Upload className="w-8 h-8" />
                                            <span className="mt-2 text-sm text-gray-500">
                                                {newTraining.file ? newTraining.file.name : 'Click to upload or drag and drop'}
                                            </span>
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                onChange={handleFileChange}
                                                accept={newTraining.fileType === 'video' ? 'video/*' : 'application/pdf'}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 p-6 border-t border-amber-100">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveTraining}
                                    className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transform hover:-translate-y-0.5 transition-allduration-200"
                                >
                                    {selectedTraining ? 'Update Training' : 'Create Training'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* View Training Modal */}
                {isViewerOpen && selectedTraining && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl transform transition-all">
                            <div className="flex justify-between items-center p-6 border-b border-amber-100">
                                <h2 className="text-xl font-semibold text-amber-900">
                                    {selectedTraining.title}
                                </h2>
                                <button
                                    onClick={() => setIsViewerOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            
                            <div className="p-6">
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-700">Description</h3>
                                    <p className="mt-1 text-gray-600">{selectedTraining.description}</p>
                                </div>

                                {selectedTraining.file_type === 'video' ? (
                                    <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                                        <video 
                                            controls 
                                            className="w-full h-full"
                                            poster="/api/placeholder/640/360"
                                        >
                                            <source 
                                                src={`data:video/mp4;base64,${selectedTraining.file_data}`} 
                                                type="video/mp4" 
                                            />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                ) : (
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => handleOpenPDF(selectedTraining)}
                                            className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg
                                                hover:bg-amber-700 transform hover:-translate-y-0.5 transition-all duration-200"
                                        >
                                            <FileText size={20} />
                                            <span>View PDF Document</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end p-6 border-t border-amber-100">
                                <button
                                    onClick={() => setIsViewerOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {isConfirmDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
                            <div className="p-6">
                                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
                                    <AlertCircle className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                    Confirm Deletion
                                </h3>
                                <p className="text-center text-gray-600">
                                    Are you sure you want to delete this training? This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
                                <button
                                    onClick={() => setIsConfirmDelete(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteTraining}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                                        transform hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Trainings;