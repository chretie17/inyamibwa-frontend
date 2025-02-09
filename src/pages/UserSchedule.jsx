import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Search, Filter } from 'lucide-react';
import api from '../api';

const FilteredEvents = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        dateRange: 'all',
        venue: 'all'
    });
    const [venues, setVenues] = useState([]);
    
    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [events, filters]);

    const fetchEvents = async () => {
        try {
            const response = await api.get('/schedule');
            const eventsData = response.data;
            setEvents(eventsData);
            
            // Extract unique venues for filter
            const uniqueVenues = [...new Set(eventsData.map(event => event.venue))];
            setVenues(uniqueVenues);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        }
    };

    const applyFilters = () => {
        let filtered = [...events];

        // Apply search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(event =>
                event.title.toLowerCase().includes(searchLower) ||
                event.description.toLowerCase().includes(searchLower) ||
                event.venue.toLowerCase().includes(searchLower)
            );
        }

        // Apply venue filter
        if (filters.venue !== 'all') {
            filtered = filtered.filter(event => event.venue === filters.venue);
        }

        // Apply date range filter
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (filters.dateRange) {
            case 'today':
                filtered = filtered.filter(event => {
                    const eventDate = new Date(event.date);
                    return eventDate.toDateString() === today.toDateString();
                });
                break;
            case 'week':
                const nextWeek = new Date(today);
                nextWeek.setDate(today.getDate() + 7);
                filtered = filtered.filter(event => {
                    const eventDate = new Date(event.date);
                    return eventDate >= today && eventDate <= nextWeek;
                });
                break;
            case 'month':
                const nextMonth = new Date(today);
                nextMonth.setMonth(today.getMonth() + 1);
                filtered = filtered.filter(event => {
                    const eventDate = new Date(event.date);
                    return eventDate >= today && eventDate <= nextMonth;
                });
                break;
            default:
                break;
        }

        // Sort by date and time
        filtered.sort((a, b) => {
            const dateA = new Date(a.date + ' ' + a.time);
            const dateB = new Date(b.date + ' ' + b.time);
            return dateA - dateB;
        });

        setFilteredEvents(filtered);
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-[#FEF8DF] p-8">
            <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-[#DAA520]">Scheduled Events</h1>
                    </div>

                    {/* Filters Section */}
                    <div className="bg-[#FEF8DF] p-6 rounded-xl mb-8 space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Filter className="h-5 w-5 text-[#DAA520]" />
                            <h2 className="text-lg font-semibold text-[#DAA520]">Filters</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search Input */}
                            <div className="relative">
                                <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#DAA520] focus:border-transparent bg-white placeholder-gray-400"
                                />
                            </div>

                            {/* Date Range Filter */}
                            <select
                                value={filters.dateRange}
                                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#DAA520] focus:border-transparent bg-white"
                            >
                                <option value="all">All Dates</option>
                                <option value="today">Today</option>
                                <option value="week">Next 7 Days</option>
                                <option value="month">Next 30 Days</option>
                            </select>

                            {/* Venue Filter */}
                            <select
                                value={filters.venue}
                                onChange={(e) => handleFilterChange('venue', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#DAA520] focus:border-transparent bg-white"
                            >
                                <option value="all">All Venues</option>
                                {venues.map(venue => (
                                    <option key={venue} value={venue}>{venue}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Events Display */}
                    <div className="space-y-4">
                        {filteredEvents.map((event) => (
                            <div key={event.id} className="bg-[#FEF8DF] rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                    <div className="md:col-span-2">
                                        <h3 className="text-xl font-bold text-[#DAA520] mb-2">{event.title}</h3>
                                        <p className="text-gray-600 line-clamp-2">{event.description}</p>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar className="h-5 w-5" />
                                            <span>{formatDate(event.date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="h-5 w-5" />
                                            <span>{event.time}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin className="h-5 w-5" />
                                        <span>{event.venue}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredEvents.length === 0 && (
                            <div className="text-center py-12 text-gray-500 bg-[#FEF8DF] rounded-xl">
                                No events found matching your filters
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilteredEvents;