import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit2, Trash2, Calendar, Clock, MapPin, X } from 'lucide-react';
import api from '../api';

const Schedule = () => {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        venue: '',
        date: '',
        time: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await api.get('/schedule');
            setEvents(response.data);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        }
    };

    const handleOpenModal = (event = null) => {
        setSelectedEvent(event);
        setNewEvent(
            event
                ? { ...event }
                : {
                    title: '',
                    description: '',
                    venue: '',
                    date: '',
                    time: ''
                }
        );
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveEvent = async () => {
        try {
            const eventData = {
                ...newEvent,
                created_by: localStorage.getItem('userId') || ''
            };

            if (selectedEvent) {
                await api.put(`/schedule/${selectedEvent.id}`, eventData);
            } else {
                await api.post('/schedule', eventData);
            }
            fetchEvents();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save event:', error);
        }
    };

    const handleDeleteEvent = async (id) => {
        try {
            await api.delete(`/schedule/${id}`);
            setEvents(events.filter((event) => event.id !== id));
        } catch (error) {
            console.error('Failed to delete event:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-amber-900">
                        Dance Troupe Schedule
                    </h1>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl
                            hover:bg-amber-700 transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        <PlusCircle size={20} />
                        <span>Add New Event</span>
                    </button>
                </div>

                {/* Events Table */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-amber-50">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-amber-900">Event</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-amber-900">Details</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-amber-900">Date & Time</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-amber-900">Venue</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-amber-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-amber-100">
                                {events.length > 0 ? (
                                    events.map((event) => (
                                        <tr 
                                            key={event.id}
                                            className="hover:bg-amber-50 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">{event.description}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={16} className="text-amber-600" />
                                                        {new Date(event.date).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={16} className="text-amber-600" />
                                                        {event.time}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <MapPin size={16} className="text-amber-600" />
                                                    {event.venue}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(event)}
                                                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors duration-200"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEvent(event.id)}
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
                                            No events scheduled
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all">
                            <div className="flex justify-between items-center p-6 border-b border-amber-100">
                                <h2 className="text-xl font-semibold text-amber-900">
                                    {selectedEvent ? 'Edit Event' : 'Add New Event'}
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
                                        value={newEvent.title}
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
                                        value={newEvent.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Venue
                                    </label>
                                    <input
                                        type="text"
                                        name="venue"
                                        value={newEvent.venue}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={newEvent.date}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Time
                                        </label>
                                        <input
                                            type="time"
                                            name="time"
                                            value={newEvent.time}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        />
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
                                    onClick={handleSaveEvent}
                                    className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transform hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    {selectedEvent ? 'Update Event' : 'Create Event'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Schedule;