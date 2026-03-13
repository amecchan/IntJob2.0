import React from 'react';
import slide1 from '../../assets/slide1.png';
import slide2 from '../../assets/slide2.png';
import slide3 from '../../assets/slide3.png';

const Hero = ({ onSignupClick }) => {
  return (
    <section className="hero" id="home">
      <div className="hero-slider">
        <div className="slider-track">
          <img src={slide1} alt="Slide 1" />
          <img src={slide2} alt="Slide 2" />
          <img src={slide3} alt="Slide 3" />
          <img src={slide1} alt="Slide 1 Clone" />
        </div>
      </div>
      <div className="hero-content">
        <div className="badge">For graduating students & fresh graduates</div>
        <h1>Find your first job faster with smart, skills-based matching.</h1>
        <p className="lead">
          IntJob connects your academics, talents, and interests to real job openings—clearly showing if roles require experience.
        </p>
        <div className="actions">
          <button type="button" className="btn btn-primary" onClick={onSignupClick}>
            Explore Features
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
