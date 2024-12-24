import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1>Dealership Reviews</h1>
        <nav>
          <button onClick={() => navigate('/dealers')} className="nav-button">
            Dealers
          </button>
          <button onClick={handleLogout} className="nav-button logout">
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
