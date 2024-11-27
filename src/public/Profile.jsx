import React, { useEffect, useState } from 'react';
import { 
  User as PersonIcon, 
  Mail as EmailIcon, 
  Briefcase as WorkIcon,
  Star,
  Award,
  Rocket
} from 'lucide-react';
import api from '../api';

// Qualification Mapping Configuration
const QUALIFICATION_CONFIGS = {
  'Beginner': {
    icon: <Star className="w-12 h-12 text-green-500" />,
    color: 'bg-green-50',
    borderColor: 'border-green-300',
    title: 'Learning Journey Begins',
    message: 'You are taking your first steps in skill development. Keep exploring and growing!',
    progressWidth: 'w-1/3'
  },
  'Intermediate': {
    icon: <Award className="w-12 h-12 text-blue-500" />,
    color: 'bg-blue-50',
    borderColor: 'border-blue-300',
    title: 'Developing Expertise',
    message: 'You are building solid skills and gaining deeper understanding. Continue practicing!',
    progressWidth: 'w-2/3'
  },
  'Expert': {
    icon: <Rocket className="w-12 h-12 text-purple-500" />,
    color: 'bg-purple-50',
    borderColor: 'border-purple-300',
    title: 'Mastery Achieved',
    message: 'You have reached an advanced level of proficiency. Congratulations on your expertise!',
    progressWidth: 'w-full'
  }
};

// Elegant Avatar Component
const ElegantAvatar = ({ name, profileImage }) => {
  const getInitials = (fullName) => {
    return fullName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  if (profileImage && profileImage !== '/default-avatar.png') {
    return (
      <img 
        src={profileImage} 
        alt={`${name}'s profile`}
        className="w-36 h-36 rounded-full object-cover border-4 border-[#5B3F00]/20 shadow-lg 
        transition-transform duration-300 hover:scale-105"
      />
    );
  }

  return (
    <div 
      className={`w-36 h-36 rounded-full flex items-center justify-center 
                  bg-[#5B3F00] text-white font-bold text-3xl 
                  shadow-lg border-4 border-[#5B3F00]/20 
                  transition-transform duration-300 hover:scale-105`}
    >
      {getInitials(name)}
    </div>
  );
};

// Qualification Badge Component
const QualificationBadge = ({ level }) => {
  const config = QUALIFICATION_CONFIGS[level] || QUALIFICATION_CONFIGS['Beginner'];

  return (
    <div 
      className={`rounded-2xl ${config.color} p-6 shadow-md flex items-center space-x-6
                  border-2 ${config.borderColor} 
                  transition-all duration-300 hover:scale-[1.02]`}
    >
      <div className="flex-shrink-0">
        {config.icon}
      </div>
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{config.title}</h3>
        <p className="text-gray-600 mb-3">{config.message}</p>
        {/* Progress Indicator */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className={`${config.progressWidth} h-2.5 rounded-full 
                        ${level === 'Beginner' ? 'bg-green-500' : 
                          level === 'Intermediate' ? 'bg-blue-500' : 
                          'bg-purple-500'}`}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Profile Component
const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: '',
    qualifications: '',
    qualificationLevel: 'Beginner',
    profileImage: '/default-avatar.png'
  });
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/public/profile', { params: { userId } });
        const { name, email, role, qualifications } = response.data;
        
        // Map the qualification from the API to the level
        const qualificationLevel = qualifications || 'Beginner';

        setUser({ 
          name, 
          email, 
          role, 
          qualifications, 
          qualificationLevel,
          profileImage: response.data.profileImage || '/default-avatar.png' 
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#FAF0E6] to-[#E6D5BA]">
        <div className="animate-pulse text-[#5B3F00] text-2xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF0E6] to-[#E6D5BA] flex justify-center items-center p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border-2 border-[#5B3F00]/10 overflow-hidden">
        <div className="p-8 space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <ElegantAvatar 
                name={user.name} 
                profileImage={user.profileImage} 
              />
            </div>
            <h1 className="text-3xl font-extrabold text-[#5B3F00] uppercase tracking-wider mt-4">
              {user.name}
            </h1>
          </div>

          {/* Divider */}
          <hr className="border-t-2 border-[#5B3F00]" />

          {/* Qualification Badge */}
          <QualificationBadge level={user.qualificationLevel} />

          {/* Basic Profile Details */}
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { 
                icon: PersonIcon, 
                label: 'Name', 
                value: user.name 
              },
              { 
                icon: EmailIcon, 
                label: 'Email', 
                value: user.email 
              },
              { 
                icon: WorkIcon, 
                label: 'Role', 
                value: user.role 
              },
              { 
                icon: Award, 
                label: 'Qualification', 
                value: user.qualifications 
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-[#5B3F00]/5 rounded-xl p-4 flex items-center space-x-4 
                          transition-all duration-300 hover:bg-[#5B3F00]/10 
                          hover:shadow-md hover:-translate-y-2 group"
              >
                <item.icon 
                  className="w-10 h-10 text-[#5B3F00] group-hover:scale-110 transition-transform"
                />
                <div>
                  <p className="text-xs uppercase font-semibold text-[#8B6B4F] mb-1">
                    {item.label}
                  </p>
                  <p className="text-lg font-medium text-[#5B3F00] group-hover:text-[#8B6B4F] transition-colors">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
