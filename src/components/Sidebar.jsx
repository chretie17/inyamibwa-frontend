import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  ChartPieIcon, 
  UsersIcon, 
  CalendarIcon, 
  ClipboardIcon, 
  FlagIcon, 
  ExclamationTriangleIcon,
  AcademicCapIcon,
  ClockIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const username = localStorage.getItem('username');

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    // Clear local storage and redirect to login
    localStorage.clear();
    navigate('/login');
  };

  const MenuItemLink = ({ icon: Icon, text, to, isActive }) => (
    <NavLink 
      to={to}
      className={`
        group flex items-center p-3 rounded-lg transition-all duration-300 
        ${isActive 
          ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-white' 
          : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
        }
      `}
    >
      <Icon 
        className={`
          w-6 h-6 mr-3 transition-all duration-300 
          ${isActive 
            ? 'text-amber-400 group-hover:scale-110' 
            : 'text-gray-400 group-hover:text-amber-300 group-hover:scale-105'
          }
        `} 
      />
      <AnimatePresence>
        {isOpen && (
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-sm font-medium truncate"
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );

  const adminMenuItems = [
    { icon: UsersIcon, text: 'Users', path: '/users' },
    { icon: ClipboardIcon, text: 'Bookings', path: '/adminbookings' },
    { icon: ExclamationTriangleIcon, text: 'Complaints', path: '/complaints' },
    { icon: ClockIcon, text: 'Attendances', path: '/adminattendance' },
    { icon: AcademicCapIcon, text: 'Qualifications', path: '/adminqualifications' },
    { icon: FlagIcon, text: 'Reports', path: '/reports' }
  ];

  const trainingMenuItems = [
    { icon: CalendarIcon, text: 'Schedule', path: '/schedule' },
    { icon: AcademicCapIcon, text: 'Qualifications', path: '/qualifications' },
    { icon: ClipboardIcon, text: 'Trainings', path: '/manage-trainings' }
  ];

  return (
    <motion.div 
      initial={{ width: isOpen ? '16rem' : '5rem' }}
      animate={{ width: isOpen ? '16rem' : '5rem' }}
      transition={{ type: 'tween' }}
      className={`
        fixed left-0 top-0 h-full bg-gray-900 
        transition-all duration-300 shadow-2xl 
        flex flex-col overflow-hidden
      `}
    >
      {/* Sidebar Toggle */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleSidebar}
        className="absolute top-4 right-4 text-gray-300 hover:text-white z-50"
      >
        <Bars3Icon className="w-6 h-6" />
      </motion.button>

      {/* Logo */}
      <div className="p-6 text-center">
        <motion.h1 
          initial={{ opacity: isOpen ? 1 : 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold text-amber-500"
        >
          INYAMIBWA
        </motion.h1>
      </div>

      {/* Profile Section */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center py-6"
          >
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-1 rounded-full mb-3">
              <UserCircleIcon className="w-16 h-16 text-gray-900 rounded-full" />
            </div>
            <h2 className="text-white font-semibold">{username}</h2>
            <p className="text-xs text-amber-400 uppercase">
              {userRole?.toUpperCase()}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {/* Main Menu */}
        <MenuItemLink 
          icon={ChartPieIcon} 
          text="Dashboard" 
          to="/dashboard" 
          isActive={location.pathname === '/dashboard'}
        />

        {/* Admin Section */}
        {userRole === 'admin' && (
          <>
            {isOpen && (
              <h3 className="text-xs text-gray-500 uppercase mt-4 mb-2 pl-3">
                Administration
              </h3>
            )}
            {adminMenuItems.map((item, index) => (
              <MenuItemLink 
                key={index}
                icon={item.icon} 
                text={item.text} 
                to={item.path} 
                isActive={location.pathname === item.path}
              />
            ))}
          </>
        )}

        {/* Training Section */}
        {isOpen && (
          <h3 className="text-xs text-gray-500 uppercase mt-4 mb-2 pl-3">
            Training
          </h3>
        )}
        {userRole === 'trainer' && (
          <MenuItemLink 
            icon={ClockIcon} 
            text="Attendance" 
            to="/attendance" 
            isActive={location.pathname === '/attendance'}
          />
        )}
        {trainingMenuItems.map((item, index) => (
          <MenuItemLink 
            key={index}
            icon={item.icon} 
            text={item.text} 
            to={item.path} 
            isActive={location.pathname === item.path}
          />
        ))}
      </nav>

      {/* Logout Section */}
      <div className="p-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className={`
            w-full flex items-center justify-center 
            bg-gradient-to-r from-amber-500 to-amber-600 
            text-gray-900 font-semibold 
            py-3 rounded-lg 
            transition-all duration-300 
            hover:from-amber-600 hover:to-amber-700
          `}
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" />
          {isOpen && 'Logout'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;