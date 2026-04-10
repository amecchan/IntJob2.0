import React from 'react';

const Footer = ({ onLegalClick }) => { // 1. Tanggapin ang prop galing Landing
  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Branding Column */}
        <div className="footer-column">
          <h4 style={{ color: 'var(--accent)' }}>IntJob</h4>
          <p className="muted" style={{ fontSize: '0.85rem', marginTop: '10px' }}>
            Empowering the next generation of professionals through skills-based matching.
          </p>
        </div>

        <div className="footer-column">
          <h4>Solutions</h4>
          <ul>
            <li><a href="#how">How it Works</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#">Job Sites</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h4>Legal</h4>
          <ul>
            {/* 2. Palitan ang href ng onClick events */}
            <li>
              <a href="#!" onClick={(e) => { e.preventDefault(); onLegalClick('terms'); }}>
                Terms of Use
              </a>
            </li>
            <li>
              <a href="#!" onClick={(e) => { e.preventDefault(); onLegalClick('privacy'); }}>
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="newsletter-section">
        <div className="container">
          <h3>Stay Updated</h3>
          <p className="muted" style={{ marginBottom: '20px' }}>Get the latest career tips and job openings.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" required />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 IntJob. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;