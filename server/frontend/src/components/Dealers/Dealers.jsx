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
  const dealer_url = "/djangoapp/get_dealers";
  
  const filterDealers = async (state) => {
    const url = state === "All" ? dealer_url : `${dealer_url}/${state}`;
    const res = await fetch(url, {
      method: "GET"
    });
    const retobj = await res.json();
    if (retobj.status === 200) {
      setDealersList(retobj.dealers);
    }
  };

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const response = await fetch(dealer_url);
        const data = await response.json();
        if (data.status === 200) {
          setDealersList(data.dealers);
          const uniqueStates = [...new Set(data.dealers.map(dealer => dealer.state))];
          setStates(['All', ...uniqueStates]);
        }
      } catch (error) {
        console.error('Error fetching dealers:', error);
      }
    };

    fetchDealers();
  }, []);

  const isLoggedIn = sessionStorage.getItem("username") != null;

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
        <div className="dealers-list">
          {dealersList.map((dealer, index) => (
            <div key={index} className="dealer-card">
              <h3>{dealer.full_name}</h3>
              <p>{dealer.address}</p>
              <p>{dealer.city}, {dealer.state}</p>
              <div className="dealer-actions">
                <button 
                  onClick={() => navigate(`/dealer/${dealer.id}`)}
                  className="view-reviews"
                >
                  <FaStar /> View Reviews
                </button>
                {isLoggedIn && (
                  <button 
                    onClick={() => navigate(`/postreview/${dealer.id}`)}
                    className="post-review"
                  >
                    <FaCommentAlt /> Post Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dealers;
