import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PostReview.css';

const PostReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState({
    rating: 5,
    comment: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add your review submission logic here
      // For now, just navigate back to dealer page
      navigate(`/dealer/${id}`);
    } catch (error) {
      console.error('Failed to post review:', error);
    }
  };

  return (
    <div className="post-review-container">
      <div className="review-box">
        <h2>Write a Review</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Rating</label>
            <select
              value={review.rating}
              onChange={(e) => setReview({ ...review, rating: e.target.value })}
            >
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
          <div className="form-group">
            <label>Comment</label>
            <textarea
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
              required
              rows="4"
            />
          </div>
          <div className="button-group">
            <button type="submit">Submit Review</button>
            <button type="button" onClick={() => navigate(`/dealer/${id}`)} className="cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostReview;
