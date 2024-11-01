import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Users, Theater, ArrowRight } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex flex-col">
      {/* Hero Section */}
      <header className="container mx-auto px-6 pt-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Inyamibwa <span className="text-purple-600">Traditional</span> Troupe
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-12">
          Preserving and Celebrating Cultural Heritage Through Vibrant Performances
        </p>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-6 grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:scale-105 transition-transform">
          <Music className="mx-auto mb-4 text-purple-600" size={64} />
          <h3 className="text-2xl font-semibold mb-3">Traditional Music</h3>
          <p className="text-gray-600">
            Authentic rhythms and melodies that tell stories of our rich cultural heritage
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:scale-105 transition-transform">
          <Users className="mx-auto mb-4 text-purple-600" size={64} />
          <h3 className="text-2xl font-semibold mb-3">Community Connection</h3>
          <p className="text-gray-600">
            Bringing people together through the power of traditional performing arts
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:scale-105 transition-transform">
          <Theater className="mx-auto mb-4 text-purple-600" size={64} />
          <h3 className="text-2xl font-semibold mb-3">Cultural Preservation</h3>
          <p className="text-gray-600">
            Keeping our traditions alive through passionate performances
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-6 text-center">
        <Link 
          to="/login" 
          className="bg-purple-600 text-white px-8 py-4 rounded-full text-xl font-semibold 
          hover:bg-purple-700 transition-colors inline-flex items-center gap-3 group"
        >
          Join Our Journey 
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-gray-600">
        <p>&copy; 2024 Inyamibwa Traditional Troupe. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;