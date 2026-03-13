import React from 'react';

const footerLinks = {
  Solutions: ['Integrations', 'Job Sites'],
  Company: ['Partner', 'Contact Us'],
  Legal: ['Terms of Use', 'Privacy Policy'],
};

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        {Object.entries(footerLinks).map(([category, links]) => (
          <div className="footer-column" key={category}>
            <h4>{category}</h4>
            <ul>
              {links.map((link) => (
                <li key={link}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="newsletter-section">
        <div className="container">
          <h3>Sign up for our newsletter</h3>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" required />
            <button type="submit" className="btn btn-primary">Sign Up</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© IntJob. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
