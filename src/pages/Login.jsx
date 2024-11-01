import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { TextField, IconButton, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import api from '../api';
import iyamibwaBackground from '../assets/inyamibwa.jpg';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const IyamibwaLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url(${iyamibwaBackground}) no-repeat center center fixed;
  background-size: cover;
  position: relative;
  padding: 20px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(91, 63, 0, 0.7) 0%,
      rgba(124, 84, 0, 0.5) 100%
    );
    backdrop-filter: blur(3px);
  }
`;

const IyamibwaLoginCard = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: 40px;
  width: 100%;
  max-width: 450px;
  animation: ${fadeIn} 0.8s ease-out, ${float} 6s ease-in-out infinite;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
    transition: all 0.3s ease;
  }
`;

const GlowEffect = styled.div`
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 70%
  );
  z-index: -1;
  border-radius: 25px;
  pointer-events: none;
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 30px;
  position: relative;
`;

const Logo = styled.div`
  font-size: 36px;
  font-weight: bold;
  background: linear-gradient(45deg, #5B3F00, #7C5400);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  font-family: 'Playfair Display', serif;
  letter-spacing: 2px;
  
  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #5B3F00, #7C5400);
    margin: 10px auto;
    border-radius: 2px;
  }
`;

const Subtitle = styled.p`
  color: #5B3F00;
  font-size: 16px;
  margin-bottom: 20px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;

  .MuiTextField-root {
    width: 100%;
    
    .MuiOutlinedInput-root {
      background: rgba(255, 255, 255, 0.9);
      border-radius: 10px;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 1);
      }
      
      &:hover fieldset {
        border-color: #5B3F00;
      }
      
      &.Mui-focused fieldset {
        border-color: #5B3F00;
        border-width: 2px;
      }
    }
    
    .MuiInputLabel-root {
      color: #5B3F00;
      
      &.Mui-focused {
        color: #5B3F00;
      }
    }
  }
`;

const LoginButton = styled.button`
  background: linear-gradient(45deg, #5B3F00, #7C5400);
  color: white;
  font-size: 16px;
  font-weight: 600;
  padding: 16px 32px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-top: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: all 0.5s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(91, 63, 0, 0.3);
    
    &::before {
      left: 100%;
      transition: all 0.5s ease;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff3d3d;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
  animation: ${fadeIn} 0.3s ease-out;
  background: rgba(255, 61, 61, 0.1);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 61, 61, 0.2);
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: white;

  .MuiCircularProgress-root {
    color: inherit;
  }
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

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
      setError('Invalid username or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IyamibwaLoginContainer>
      <IyamibwaLoginCard>
        <GlowEffect />
        <LogoContainer>
          <Logo>Inyamibwa AERG</Logo>
          <Subtitle>Welcome back! Please log in to continue.</Subtitle>
        </LogoContainer>

        <StyledForm onSubmit={handleLogin}>
          <InputWrapper>
            <TextField
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
          </InputWrapper>

          <InputWrapper>
            <TextField
              label="Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
          </InputWrapper>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <LoadingWrapper>
                <CircularProgress size={20} />
                <span>Signing In...</span>
              </LoadingWrapper>
            ) : (
              'Sign In'
            )}
          </LoginButton>
        </StyledForm>
      </IyamibwaLoginCard>
    </IyamibwaLoginContainer>
  );
};

export default Login;