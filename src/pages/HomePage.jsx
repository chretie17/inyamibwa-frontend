// src/pages/HomePage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to login after 3 seconds
        const timer = setTimeout(() => {
            navigate('/login');
        }, 3000);

        // Cleanup the timer on component unmount
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '20%' }}>
            <h1>Welcome to the Inyamibwa Traditional Troupe Platform</h1>
            <p>You will be redirected to the login page shortly...</p>
        </div>
    );
};

export default HomePage;
