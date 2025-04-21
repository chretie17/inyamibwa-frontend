import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Phone, Mail, Plus, Check, X, AlertCircle, CalendarDays, Trash2 } from 'lucide-react';
import api from '../api';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [eventTypes, setEventTypes] = useState([]);
    const [newEventType, setNewEventType] = useState({ event_type: '', fee: '' });
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: ''
    });
    const [deleteModal, setDeleteModal] = useState({
        show: false,
        eventTypeId: null,
        eventTypeName: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [bookingsResponse, eventTypesResponse] = await Promise.all([
                api.get('/bookings'),
                api.get('/bookings/event-types')
            ]);
            setBookings(bookingsResponse.data);
            setEventTypes(eventTypesResponse.data);
        } catch (error) {
            showNotification('Failed to fetch data.', 'error');
            console.error('Error fetching data:', error);
        }
    };

    const handleEventTypeChange = (e) => {
        const { name, value } = e.target;
        setNewEventType((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddOrUpdateEventType = async () => {
        if (!newEventType.event_type || !newEventType.fee) {
            showNotification('Please fill out all fields.', 'error');
            return;
        }
        try {
            await api.post('/bookings/event-types', newEventType);
            showNotification('Event type added successfully!', 'success');
            setNewEventType({ event_type: '', fee: '' });
            const response = await api.get('/bookings/event-types');
            setEventTypes(response.data);
        } catch (error) {
            showNotification('Failed to add event type.', 'error');
            console.error('Error adding event type:', error);
        }
    };

    const handleDeleteEventType = async (id) => {
        try {
            await api.delete(`/bookings/${id}`);
            showNotification('Event type deleted successfully!', 'success');
            setEventTypes(eventTypes.filter(eventType => eventType.id !== id));
            setDeleteModal({ show: false, eventTypeId: null, eventTypeName: '' });
        } catch (error) {
            if (error.response && error.response.status === 400) {
                showNotification('Cannot delete event type with associated bookings.', 'error');
            } else {
                showNotification('Failed to delete event type.', 'error');
            }
            console.error('Error deleting event type:', error);
            setDeleteModal({ show: false, eventTypeId: null, eventTypeName: '' });
        }
    };

    const openDeleteModal = (id, name) => {
        setDeleteModal({
            show: true,
            eventTypeId: id,
            eventTypeName: name
        });
    };

    const handleBookingAction = async (id, action) => {
        try {
            const response = await api.put(`/bookings/${action}/${id}`);
            showNotification(response.data.message, 'success');
            const bookingsResponse = await api.get('/bookings');
            setBookings(bookingsResponse.data);
        } catch (error) {
            showNotification(`Failed to ${action} booking.`, 'error');
            console.error(`Error ${action}ing booking:`, error);
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-RW', {
            style: 'currency',
            currency: 'RWF'
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-amber-900 mb-4">
                        Event Management
                    </h1>
                    <div className="w-24 h-1 bg-amber-600 mx-auto"></div>
                </div>

                {/* Event Types Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Event Types List */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-amber-900">Event Types</h2>
                            <span className="text-sm text-amber-600">{eventTypes.length} Types</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-amber-50">
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-amber-900">
                                            Event Type
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-amber-900">
                                            Fee
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-amber-900">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-amber-100">
                                    {eventTypes.map((event) => (
                                        <tr key={event.id} className="hover:bg-amber-50 transition-colors duration-150">
                                            <td className="px-6 py-4 text-sm text-gray-900">{event.event_type}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 text-right">
                                                {formatCurrency(event.fee)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => openDeleteModal(event.id, event.event_type)}
                                                    className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                    title="Delete event type"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Add New Event Type */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h2 className="text-xl font-semibold text-amber-900 mb-6">Add New Event Type</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Event Type
                                </label>
                                <input
                                    type="text"
                                    name="event_type"
                                    value={newEventType.event_type}
                                    onChange={handleEventTypeChange}
                                    className="w-full px-4 py-2 border border-amber-200 rounded-lg 
                                        focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    placeholder="Enter event type"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fee (RWF)
                                </label>
                                <input
                                    type="number"
                                    name="fee"
                                    value={newEventType.fee}
                                    onChange={handleEventTypeChange}
                                    className="w-full px-4 py-2 border border-amber-200 rounded-lg 
                                        focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    placeholder="Enter fee amount"
                                />
                            </div>

                            <button
                                onClick={handleAddOrUpdateEventType}
                                className="flex items-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-lg
                                    hover:bg-amber-700 transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <Plus className="w-4 h-4" />
                                Add Event Type
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Bookings Table */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-amber-100">
                        <h2 className="text-xl font-semibold text-amber-900">All Bookings</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-amber-50">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-amber-900">Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-amber-900">Contact</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-amber-900">Event Details</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-amber-900">Notes</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-amber-900">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-amber-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-amber-100">
                                {bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-amber-50 transition-colors duration-150">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                                                    <span className="text-amber-700 font-semibold">
                                                        {booking.user_name.charAt(0)}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {booking.user_name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail className="w-4 h-4 text-amber-600" />
                                                    {booking.user_email}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone className="w-4 h-4 text-amber-600" />
                                                    {booking.phone_number}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {booking.event_type}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4 text-amber-600" />
                                                    {formatDate(booking.event_date)}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Clock className="w-4 h-4 text-amber-600" />
                                                    {booking.event_time}
                                                </div>
                                                <div className="text-sm font-medium text-amber-600">
                                                    {formatCurrency(booking.fee)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {booking.additional_notes || 'No notes provided'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`
                                                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${booking.status === 'approved' && 'bg-green-100 text-green-800'}
                                                ${booking.status === 'rejected' && 'bg-red-100 text-red-800'}
                                                ${(!booking.status || booking.status === 'pending') && 'bg-yellow-100 text-yellow-800'}
                                            `}>
                                                {booking.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {(!booking.status || booking.status === 'pending') && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleBookingAction(booking.id, 'approve')}
                                                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg
                                                            hover:bg-green-700 transition-colors duration-200"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleBookingAction(booking.id, 'reject')}
                                                        className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg
                                                            hover:bg-red-700 transition-colors duration-200"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
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
                                <Check className="w-5 h-5" />
                            ) : (
                                <AlertCircle className="w-5 h-5" />
                            )}
                            {notification.message}
                        </div>
                    </div>
                )}

                {/* No Bookings State */}
                {bookings.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <CalendarDays className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Yet</h3>
                        <p className="text-gray-600">
                            There are no event bookings to display at the moment.
                        </p>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteModal.show && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Delete Event Type
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete <span className="font-semibold">{deleteModal.eventTypeName}</span>? 
                                This action cannot be undone, and may fail if there are associated bookings.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setDeleteModal({ show: false, eventTypeId: null, eventTypeName: '' })}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeleteEventType(deleteModal.eventTypeId)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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

export default AdminBookings;