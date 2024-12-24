import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TextField, Button, Paper, Typography, Container, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import './Login.css';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
}));

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // For demo purposes, accept any non-empty username/password
      if (username && password) {
        sessionStorage.setItem('username', username);
        navigate('/dealers');
      } else {
        setError('Please enter both username and password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0061ff 0%, #60efff 100%)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StyledPaper elevation={6}>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                mb: 4,
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #0061ff, #60efff)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome to Dealership Reviews
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: '#666' }}>
              Your trusted platform for authentic car dealership reviews
            </Typography>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
              />

              {error && (
                <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mb: 2,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #0061ff, #60efff)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #0052d6, #50d6ff)',
                  },
                }}
              >
                Sign In
              </Button>

              <Button
                fullWidth
                variant="text"
                onClick={() => navigate('/register')}
                sx={{
                  color: '#666',
                  '&:hover': {
                    color: '#0061ff',
                  },
                }}
              >
                Don't have an account? Sign Up
              </Button>
            </form>
          </StyledPaper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Login;
