'use client';
import React, { memo } from 'react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { AiOutlineStar } from 'react-icons/ai';

interface StarsProps {
  averageRating: number;
}

const Stars: React.FC<StarsProps> = memo(({ averageRating }) => {
  const stars = [];
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={i} style={{ color: '#ff9800' }} />);
  }
  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key={fullStars} style={{ color: '#ff9800' }} />);
  }
  for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
    stars.push(<AiOutlineStar key={i} style={{ color: '#e0e0e0' }} />);
  }

  return (
    <div style={{ display: 'flex' }}>
      {stars}
    </div>
  );
});

Stars.displayName = 'Stars';

export default Stars;
