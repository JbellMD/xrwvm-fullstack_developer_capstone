import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  AppBar,
  Toolbar,
  Rating,
  Chip,
  IconButton,
} from '@mui/material';
import {
  LocationOn,
  Star,
  Comment,
  Logout,
  Store,
  ArrowDropDown,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import "./Dealers.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
}));

const StyledAppBar = styled(AppBar)({
  background: 'linear-gradient(90deg, #0061ff 0%, #60efff 100%)',
  boxShadow: 'none',
});

const Dealers = () => {
  const navigate = useNavigate();
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedState, setSelectedState] = useState('All');

  const dealer_url = `${API_BASE_URL}/api/dealers`;

  const handleLogout = () => {
    sessionStorage.removeItem('username');
    navigate('/');
  };

  const filterDealers = async (state) => {
    try {
      setLoading(true);
      setSelectedState(state);
      const url = state === "All" ? dealer_url : `${dealer_url}/${state}`;
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data.status === 200) {
        setDealersList(data.dealers);
      } else {
        throw new Error(data.error || 'Failed to fetch dealers');
      }
    } catch (error) {
      console.error('Error filtering dealers:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        setLoading(true);
        const response = await fetch(dealer_url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.status === 200) {
          setDealersList(data.dealers);
          const uniqueStates = [...new Set(data.dealers.map(dealer => dealer.state))];
          setStates(['All', ...uniqueStates.sort()]);
        } else {
          throw new Error(data.error || 'Failed to fetch dealers');
        }
      } catch (error) {
        console.error('Error fetching dealers:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDealers();
  }, [dealer_url]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  if (loading) return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <Typography variant="h5">Loading dealers...</Typography>
    </Box>
  );

  if (error) return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <Typography variant="h5" color="error">Error: {error}</Typography>
    </Box>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    }}>
      <StyledAppBar position="sticky">
        <Toolbar>
          <Store sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dealership Reviews
          </Typography>
          <FormControl 
            variant="outlined" 
            sx={{ 
              m: 1, 
              minWidth: 120,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
            }}
          >
            <Select
              value={selectedState}
              onChange={(e) => filterDealers(e.target.value)}
              displayEmpty
              sx={{ color: 'white' }}
              IconComponent={ArrowDropDown}
            >
              {states.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </StyledAppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3}>
            {dealersList.map((dealer) => (
              <Grid item xs={12} sm={6} md={4} key={dealer.id}>
                <motion.div variants={itemVariants}>
                  <StyledCard>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {dealer.full_name}
                      </Typography>
                      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <LocationOn sx={{ mr: 1, color: '#666' }} />
                        <Typography variant="body2" color="text.secondary">
                          {dealer.address}<br />
                          {dealer.city}, {dealer.state} {dealer.zip}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Rating
                          value={dealer.avg_rating || 0}
                          precision={0.1}
                          readOnly
                          sx={{ color: '#0061ff' }}
                        />
                        <Chip
                          icon={<Comment />}
                          label={`${dealer.review_count || 0} reviews`}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => navigate(`/dealer/${dealer.id}`)}
                        sx={{
                          mt: 2,
                          background: 'linear-gradient(45deg, #0061ff, #60efff)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #0052d6, #50d6ff)',
                          },
                        }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </StyledCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Dealers;
