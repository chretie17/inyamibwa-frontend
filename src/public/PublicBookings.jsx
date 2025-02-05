import React, { useState, useEffect } from 'react';
import { Coffee, Send, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../api';

const PublicBooking = () => {
    const [eventTypes, setEventTypes] = useState([]);
    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        phone_number: '',
        event_type_id: '',
        event_date: '',
        event_time: '',
        additional_notes: '',
    });
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: ''
    });

    useEffect(() => {
        fetchEventTypes();
    }, []);

    const fetchEventTypes = async () => {
        try {
            const response = await api.get('/bookings/event-types');
            setEventTypes(response.data);
        } catch (error) {
            showNotification('Failed to fetch event types', 'error');
            console.error('Failed to fetch event types:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/bookings/book', formData);
            showNotification(response.data.message, 'success');
            setFormData({
                user_name: '',
                user_email: '',
                phone_number: '',
                event_type_id: '',
                event_date: '',
                event_time: '',
                additional_notes: '',
            });
        } catch (error) {
            showNotification('Failed to create booking', 'error');
            console.error('Error creating booking:', error);
        }
    };

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-RW', {
            style: 'currency',
            currency: 'RWF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-8">
            {/* Background Pattern */}
            <div className="fixed inset-0 opacity-5 pattern-dots pattern-amber-900 pattern-bg-white pattern-size-4 pattern-opacity-20" />

            <div className="max-w-2xl mx-auto">
                {/* Booking Form Card */}
                <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-200 p-8 
                    animate-fade-in transform hover:shadow-2xl transition-all duration-300">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="p-4 bg-amber-100 rounded-xl">
                                <Coffee className="w-8 h-8 text-amber-600" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-amber-900 mb-2">Book Your Event</h1>
                        <p className="text-amber-700">Fill in the details below to schedule your event</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="user_name"
                                    value={formData.user_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-amber-200 
                                        focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                                        transition-all duration-200"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="user_email"
                                        value={formData.user_email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-amber-200 
                                            focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                                            transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-amber-200 
                                            focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                                            transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Event Details */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Event Type
                                </label>
                                <select
                                    name="event_type_id"
                                    value={formData.event_type_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-amber-200 
                                        focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                                        transition-all duration-200"
                                    required
                                >
                                    <option value="">Select an event type</option>
                                    {eventTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.event_type} - {formatCurrency(type.fee)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Event Date
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
                                        <input
                                            type="date"
                                            name="event_date"
                                            value={formData.event_date}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-amber-200 
                                                focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                                                transition-all duration-200"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Event Time
                                    </label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
                                        <input
                                            type="time"
                                            name="event_time"
                                            value={formData.event_time}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-amber-200 
                                                focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                                                transition-all duration-200"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Additional Notes
                                </label>
                                <textarea
                                    name="additional_notes"
                                    value={formData.additional_notes}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-lg border border-amber-200 
                                        focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                                        transition-all duration-200"
                                    placeholder="Any special requests or additional information..."
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 px-6 rounded-xl
                                flex items-center justify-center gap-2 transform hover:-translate-y-0.5 transition-all duration-200
                                hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                        >
                            <Send className="w-5 h-5" />
                            <span>Submit Booking</span>
                        </button>
                    </form>
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

export default PublicBooking;