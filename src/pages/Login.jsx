import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import styled from 'styled-components';
import iyamibwaBackground from '../assets/inyamibwa.jpg';

const IyamibwaLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(${iyamibwaBackground});
  background-size: cover;
  background-position: center;
`;

const IyamibwaLoginCard = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 32px;
  width: 100%;
  max-width: 400px;
`;

const IyamibwaLoginTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #5B3F00;
  text-align: center;
  margin-bottom: 24px;
`;

const IyamibwaLoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const IyamibwaLoginInput = styled.input`
  padding: 12px 16px;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  font-size: 16px;
  background-color: #F8F8F8;
`;

const IyamibwaLoginButton = styled.button`
  background-color: #5B3F00;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: bold;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #7C5400;
  }
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username, password });
      const { userId, userRole, token } = response.data;

      localStorage.setItem('userId', userId);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('token', token);

      if (userRole === 'admin' || userRole === 'trainer') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      alert('Login failed!');
    }
  };

  return (
    <IyamibwaLoginContainer>
      <IyamibwaLoginCard>
        <IyamibwaLoginTitle>Inyamibwa Login</IyamibwaLoginTitle>
        <IyamibwaLoginForm onSubmit={handleLogin}>
          <IyamibwaLoginInput
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <IyamibwaLoginInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <IyamibwaLoginButton type="submit">Inyamibwa Login</IyamibwaLoginButton>
        </IyamibwaLoginForm>
      </IyamibwaLoginCard>
    </IyamibwaLoginContainer>
  );
};

export default Login;