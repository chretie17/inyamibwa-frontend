import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Music, 
  Users, 
  Theater, 
  ArrowRight, 
  Drum, 
  HeartHandshake, 
  Sparkles 
} from 'lucide-react';

// Assume these images are imported from your assets folder
import SlideImage1 from '../assets/inyam.jpg';
import SlideImage2 from '../assets/inyamibwa.jpg';
import SlideImage3 from '../assets/inyam.jpg';

const ImageSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [SlideImage1, SlideImage2, SlideImage3];

  React.useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-2xl shadow-2xl mb-16">
      {images.map((image, index) => (
        <div
          key={index}
          className={`
            absolute inset-0 transition-opacity duration-1000 ease-in-out
            ${currentSlide === index ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <img 
            src={image} 
            alt={`Performance ${index + 1}`} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#5B3F00] opacity-20 mix-blend-multiply"></div>
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`
              w-3 h-3 rounded-full 
              ${currentSlide === index ? 'bg-[#5B3F00]' : 'bg-[#5B3F00]/30'}
              transition-colors duration-300
            `}
          />
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E6D3] to-[#E0D0B0] flex flex-col overflow-hidden relative">
      {/* Subtle Background Patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-[#8B6B4F] rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[#5B3F00] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Container for main content */}
      <div className="container mx-auto px-6 flex-grow flex flex-col">
        {/* Hero Section with Enhanced Typography */}
        <header className="text-center relative z-10 pt-16 mb-12">
          <div className="animate-fade-in-down">
            <h1 className="text-6xl font-extrabold text-[#5B3F00] mb-6 leading-tight">
              Inyamibwa <span className="text-[#8B6B4F] drop-shadow-md">Cultural</span> Ensemble
            </h1>
            <p className="text-2xl text-[#5B3F00]/80 max-w-3xl mx-auto mb-12 leading-relaxed">
              Preserving and Celebrating Cultural Heritage Through Vibrant Performances
            </p>
          </div>
        </header>

        {/* Slideshow Section */}
        <section className="container mx-auto px-6 relative z-10 mb-16">
          <ImageSlideshow />
        </section>

        {/* Features Section with Enhanced Interactivity */}
        <section className="container mx-auto px-6 grid md:grid-cols-3 gap-8 mb-16 relative z-10">
          {[
            {
              icon: Music,
              title: "Traditional Performances",
              description: "Authentic rhythms and narratives that celebrate our cultural legacy",
              color: "text-[#5B3F00]",
              bgHover: "hover:bg-[#5B3F00]/10"
            },
            {
              icon: Users,
              title: "Community Engagement",
              description: "Fostering cultural understanding through dynamic artistic expressions",
              color: "text-[#8B6B4F]",
              bgHover: "hover:bg-[#8B6B4F]/10"
            },
            {
              icon: Theater,
              title: "Cultural Preservation",
              description: "Dedicated to maintaining and honoring our rich cultural traditions",
              color: "text-[#A47551]",
              bgHover: "hover:bg-[#A47551]/10"
            }
          ].map(({ icon: Icon, title, description, color, bgHover }, index) => (
            <div 
              key={title}
              className={`
                bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-2xl text-center 
                hover:scale-105 hover:rotate-1 transition-transform duration-300 
                group cursor-pointer ${bgHover}
                ${index % 2 === 0 ? 'translate-y-0 hover:-translate-y-2' : 'translate-y-0 hover:translate-y-2'}
              `}
            >
              <Icon 
                className={`mx-auto mb-4 ${color} group-hover:animate-pulse`} 
                size={64} 
                strokeWidth={1.5} 
              />
              <h3 className={`text-2xl font-bold mb-3 ${color} group-hover:text-opacity-80 transition-colors`}>
                {title}
              </h3>
              <p className="text-[#5B3F00]/70 text-base leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </section>

        {/* Enhanced Call to Action */}
        <section className="container mx-auto px-6 text-center relative z-10 mb-16">
          <div className="bg-white/30 backdrop-blur-sm rounded-3xl p-8 inline-block shadow-2xl">
            <Link
              to="/login"
              className="
                bg-gradient-to-r from-[#5B3F00] to-[#8B6B4F]
                text-white px-10 py-4 rounded-full text-xl font-bold
                hover:from-[#5B3F00]/90 hover:to-[#8B6B4F]/90
                transition-all duration-300 
                inline-flex items-center gap-4 
                group relative overflow-hidden
              "
            >
              <span className="relative z-10 flex items-center">
                Access Member Portal
                <ArrowRight 
                  className="ml-3 group-hover:translate-x-2 transition-transform" 
                  size={24} 
                />
              </span>
              <span 
                className="
                  absolute inset-0 bg-white/20 
                  opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300 
                  rounded-full
                "
              ></span>
            </Link>
          </div>
        </section>
      </div>

      {/* Footer with Cultural Essence */}
      <footer className="py-8 text-center text-[#5B3F00]/70 relative z-10">
        <div className="container mx-auto px-6">
          <p className="mb-2 text-sm">
            Bridging Generations Through Artistry and Tradition
          </p>
          <p className="font-semibold">&copy; 2024 Inyamibwa Cultural Ensemble. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;