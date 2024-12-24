import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaCommentAlt } from 'react-icons/fa';
import './Dealers.css';

const Dealer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchDealer = async () => {
      try {
        const response = await fetch(`/djangoapp/get_dealer/${id}`);
        const data = await response.json();
        if (data.status === 200) {
          setDealer(data.dealer);
          setReviews(data.reviews || []);
        }
      } catch (error) {
        console.error('Error fetching dealer:', error);
      }
    };

    fetchDealer();
  }, [id]);

  if (!dealer) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dealer-detail-container">
      <div className="dealer-header">
        <button onClick={() => navigate('/dealers')} className="back-button">
          Back to Dealers
        </button>
        <h2>{dealer.full_name}</h2>
      </div>

      <div className="dealer-info">
        <p>{dealer.address}</p>
        <p>{dealer.city}, {dealer.state} {dealer.zip}</p>
      </div>

      <div className="reviews-section">
        <div className="reviews-header">
          <h3>Reviews</h3>
          <button 
            onClick={() => navigate(`/postreview/${id}`)}
            className="add-review-button"
          >
            <FaCommentAlt /> Add Review
          </button>
        </div>

        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((review, index) => (
              <div key={index} className="review-card">
                <div className="review-header">
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i}
                        className={i < review.rating ? 'star-filled' : 'star-empty'}
                      />
                    ))}
                  </div>
                  <span className="review-date">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="review-text">{review.comment}</p>
                <p className="reviewer">- {review.reviewer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dealer;
