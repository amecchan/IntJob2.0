import React, { useState } from 'react';
import logoImg from '../../assets/logo.jpg';
import styles from './Navbar.module.css';

const Navigation = ({ onLogin, onSignup, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Helper to handle navigation and close mobile menu
  const handleNavClick = (target) => {
    if (onNavigate) onNavigate(target);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={styles.nav}>
        <div className={styles.navWrapper}>
          <a href="#home" className={styles.brand} onClick={() => handleNavClick('home')}>
            <img src={logoImg} alt="IntJob Logo" className={styles.navLogo} />
            <span>IntJob</span>
          </a>
          
          <button className={styles.hamburger} onClick={toggleMenu}>
            <span></span><span></span><span></span>
          </button>
          
          <nav className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
            {/* New Job Lists Tab */}
            <a href="#jobs" className={styles.navItem} onClick={() => handleNavClick('job-lists')}>
              Job Lists
            </a>
            <a href="#how" className={styles.navItem} onClick={() => handleNavClick('how')}>
              How it works
            </a>
            <a href="#contact" className={styles.navItem} onClick={() => handleNavClick('contact')}>
              Contact
            </a>
            <button className="btn btn-outline" onClick={onLogin}>Login</button>
            <button className="btn btn-primary" onClick={onSignup}>Sign Up</button>
          </nav>
        </div>
        {isMenuOpen && <div className={styles.menuOverlay} onClick={toggleMenu}></div>}
      </header>
    </>
  );
};

export default Navigation;