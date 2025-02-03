import React, { useState, useEffect } from 'react';
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Users, ClipboardCheck, BookOpen, CalendarDays, ArrowUp, ArrowDown } from 'lucide-react';
import apiService from '../api';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    totalBookings: 0,
    approvedBookings: 0,
    totalTrainings: 0,
    totalEvents: 0,
    complaintsTrends: [],
    bookingsByEventType: [],
    trainingsUploadsOverTime: [],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTooltipDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fetchDashboardData = async () => {
    try {
      const response = await apiService.get('/admin/dashboard');
      // Format dates in the response data
      const formattedData = {
        ...response.data,
        complaintsTrends: response.data.complaintsTrends.map(item => ({
          ...item,
          date: formatDate(item.date)
        })),
        trainingsUploadsOverTime: response.data.trainingsUploadsOverTime.map(item => ({
          ...item,
          date: formatDate(item.date)
        }))
      };
      setDashboardData(formattedData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch dashboard data');
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 p-4 rounded-lg shadow-lg border border-amber-100">
          <p className="text-sm font-medium text-amber-900">{formatTooltipDate(label)}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-gray-600">
              <span className="font-medium">{entry.name}: </span>
              {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <span className="text-gray-600 text-sm font-medium">{title}</span>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            {trend && (
              <span className={`flex items-center text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trend > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {Math.abs(trend)}%
              </span>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-amber-900">Admin Dashboard</h1>
          <p className="mt-2 text-amber-700">Overview of system activities and metrics</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Complaints"
            value={dashboardData.totalComplaints}
            icon={ClipboardCheck}
            trend={2.5}
            color="bg-amber-900"
          />
          <StatCard
            title="Resolved Complaints"
            value={dashboardData.resolvedComplaints}
            icon={ClipboardCheck}
            trend={5.2}
            color="bg-green-600"
          />
          <StatCard
            title="Total Bookings"
            value={dashboardData.totalBookings}
            icon={CalendarDays}
            trend={-1.5}
            color="bg-blue-600"
          />
          <StatCard
            title="Total Trainings"
            value={dashboardData.totalTrainings}
            icon={BookOpen}
            trend={3.8}
            color="bg-purple-600"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Complaints Trends */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaints Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.complaintsTrends}>
                <defs>
                  <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#78350F" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#78350F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#78350F"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#78350F' }}
                  activeDot={{ r: 6 }}
                  fill="url(#colorComplaints)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bookings by Event Type */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bookings by Event Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.bookingsByEventType}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#78350F" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#78350F" stopOpacity={0.4}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="event_type" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="count" 
                  fill="url(#colorBookings)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Training Uploads Over Time */}
          <div className="bg-white p-6 rounded-2xl shadow-lg lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Uploads Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.trainingsUploadsOverTime}>
                <defs>
                  <linearGradient id="colorTrainings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#78350F" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#78350F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#78350F"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#78350F' }}
                  activeDot={{ r: 6 }}
                  fill="url(#colorTrainings)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;