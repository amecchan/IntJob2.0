import React, { useState } from 'react';
import logoImg from '../../assets/logo.jpg';
import styles from './Navbar.module.css';

const Navigation = ({ onLogin, onSignup }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header className={styles.nav}>
        <div className={styles.navWrapper}>
          <a href="#home" className={styles.brand}>
            <img src={logoImg} alt="IntJob Logo" className={styles.navLogo} />
            <span>IntJob</span>
          </a>
          
          <button className={styles.hamburger} onClick={toggleMenu}>
            <span></span><span></span><span></span>
          </button>
          
          {/* Use a template literal or classnames library to toggle the 'open' class */}
          <nav className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
            <a href="#how" className={styles.navItem} onClick={toggleMenu}>How it works</a>
            <a href="#contact" className={styles.navItem} onClick={toggleMenu}>Contact</a>
            <button className="btn btn-outline" onClick={onLogin}>Login</button>
            <button className="btn btn-primary" onClick={onSignup}>Sign Up</button>
          </nav>
        </div>
        {/* Overlay only shows when state is true */}
        {isMenuOpen && <div className={styles.menuOverlay} onClick={toggleMenu}></div>}
      </header>
    </>
  );
};
export default Navigation;