import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaCommentAlt } from 'react-icons/fa';
import "./Dealers.css";
import "../../assets/style.css";
import Header from '../Header/Header';

const Dealers = () => {
  const navigate = useNavigate();
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use absolute path for API endpoints
  const dealer_url = "/api/dealers";
  
  const filterDealers = async (state) => {
    try {
      setLoading(true);
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
  }, []);

  const isLoggedIn = sessionStorage.getItem("username") != null;

  if (loading) return <div className="loading">Loading dealers...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="dealers-container">
      <Header />
      <div className="content">
        <div className="filters">
          <select onChange={(e) => filterDealers(e.target.value)}>
            {states.map((state, index) => (
              <option key={index} value={state}>{state}</option>
            ))}
          </select>
        </div>
        <div className="dealers-grid">
          {dealersList.map((dealer) => (
            <div key={dealer.id} className="dealer-card">
              <h3>{dealer.full_name}</h3>
              <p>{dealer.address}</p>
              <p>{dealer.city}, {dealer.state} {dealer.zip}</p>
              <div className="dealer-stats">
                <span className="rating">
                  <FaStar /> {dealer.avg_rating.toFixed(1)}
                </span>
                <span className="reviews">
                  <FaCommentAlt /> {dealer.review_count}
                </span>
              </div>
              {isLoggedIn && (
                <button 
                  onClick={() => navigate(`/dealer/${dealer.id}`)}
                  className="view-details-btn"
                >
                  View Details
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dealers;
