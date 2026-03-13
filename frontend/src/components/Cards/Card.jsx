import React from 'react';
const Card = ({ title, description }) => {
  return (
    <div className="card">
      <strong>{title}</strong>
      <p className="muted">{description}</p>
    </div>
  );
};
export default Card;