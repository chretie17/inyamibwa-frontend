import React, { useEffect, useState } from 'react';
import { 
  FileText as PdfIcon, 
  Play as PlayIcon 
} from 'lucide-react';
import api from '../api';

const Trainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await api.get('/trainings');
        setTrainings(response.data);
      } catch (error) {
        console.error('Error fetching trainings:', error);
      }
    };
    fetchTrainings();
  }, []);

  const handleViewTraining = (training) => {
    if (training.file_type === 'pdf') {
      const byteCharacters = atob(training.file_data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, '_blank');
    } else if (training.file_type === 'video') {
      setSelectedTraining(training);
      setOpenDialog(true);
    }
  };

  const generateVideoThumbnail = (videoBase64) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.src = `data:video/mp4;base64,${videoBase64}`;
      video.addEventListener('loadedmetadata', () => {
        video.currentTime = Math.min(video.duration / 2, 2); // Seek to mid-point or 2 seconds
      });
      video.addEventListener('timeupdate', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg'));
      });
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTraining(null);
  };

  return (
    <div className="bg-gradient-to-br from-[#FAF0E6] to-[#F5E6D3] min-h-screen py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-[#5B3F00] mb-12 
          tracking-tight drop-shadow-md bg-clip-text 
          bg-gradient-to-r from-[#5B3F00] to-[#8B6B4F] text-transparent">
          Inyamibwa Trainings
        </h2>
        
        {trainings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainings.map((training) => (
              <TrainingCard 
                key={training.id} 
                training={training}
                onView={handleViewTraining}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-[50vh]">
            <p className="text-2xl text-[#5B3F00]/50 font-semibold animate-pulse">
              No trainings available at the moment
            </p>
          </div>
        )}

        {/* Video Dialog */}
        {selectedTraining && openDialog && (
          <VideoDialog 
            training={selectedTraining} 
            onClose={handleCloseDialog} 
          />
        )}
      </div>
    </div>
  );
};

// Separate component for training cards
const TrainingCard = React.memo(({ training, onView }) => {
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    const loadThumbnail = async () => {
      if (training.file_type === 'video' && training.file_data) {
        try {
          const thumbDataUrl = await generateVideoThumbnail(training.file_data);
          setThumbnail(thumbDataUrl);
        } catch (error) {
          console.error('Thumbnail generation error:', error);
        }
      }
    };

    loadThumbnail();
  }, [training]);

  return (
    <div 
      onClick={() => onView(training)}
      className="group bg-white rounded-3xl shadow-xl overflow-hidden 
        transition-all duration-300 ease-in-out transform 
        hover:scale-105 hover:shadow-2xl hover:rotate-1 
        cursor-pointer border-2 border-transparent 
        hover:border-[#5B3F00]/20"
    >
      <div className="relative overflow-hidden h-64">
        {training.file_type === 'video' ? (
          thumbnail ? (
            <div className="relative w-full h-full">
              <img 
                src={thumbnail} 
                alt={`${training.title} thumbnail`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <PlayIcon 
                  className="w-24 h-24 text-white/80 
                  group-hover:text-white group-hover:scale-110 transition-all" 
                />
              </div>
            </div>
          ) : (
            <div className="h-full bg-[#5B3F00]/5 flex items-center justify-center 
              group-hover:bg-[#5B3F00]/10 transition-all duration-300">
              <PlayIcon 
                className="w-24 h-24 text-[#5B3F00] opacity-70 
                group-hover:opacity-100 group-hover:scale-110 transition-all" 
              />
            </div>
          )
        ) : (
          <div className="h-full bg-[#5B3F00]/5 flex items-center justify-center 
            group-hover:bg-[#5B3F00]/10 transition-all duration-300">
            <PdfIcon 
              className="w-24 h-24 text-[#5B3F00] opacity-70 
              group-hover:opacity-100 group-hover:scale-110 transition-all" 
            />
          </div>
        )}
      </div>
      
      <div className="p-6 text-center">
        <h3 className="text-2xl font-bold text-[#5B3F00] mb-3 
          group-hover:text-[#8B6B4F] transition-colors duration-300">
          {training.title}
        </h3>
        <p className="text-[#8B6B4F]/80 line-clamp-3 
          group-hover:text-opacity-100 transition-all">
          {training.description}
        </p>
      </div>
    </div>
  );
});

// Separate component for video dialog
const VideoDialog = React.memo(({ training, onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center 
        bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl 
          overflow-hidden transform transition-all duration-300 
          scale-100 hover:scale-[1.02]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-[#5B3F00] to-[#8B6B4F] 
          text-white p-6 flex items-center justify-between">
          <h4 className="text-2xl font-bold tracking-tight">
            {training.title}
          </h4>
          <button 
            onClick={onClose}
            className="text-white hover:text-white/70 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="bg-black">
          <video
            controls
            src={`data:video/mp4;base64,${training.file_data}`}
            className="w-full max-h-[70vh] object-contain"
            poster="/api/placeholder/800/450"
            autoPlay
          />
        </div>
      </div>
    </div>
  );
});

// Utility function to generate thumbnail
const generateVideoThumbnail = (videoBase64) => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.src = `data:video/mp4;base64,${videoBase64}`;
    video.addEventListener('loadedmetadata', () => {
      video.currentTime = Math.min(video.duration / 2, 2); // Seek to mid-point or 2 seconds
    });
    video.addEventListener('timeupdate', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg'));
    });
  });
};

export default Trainings;