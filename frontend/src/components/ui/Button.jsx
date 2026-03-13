// src/components/ui/Button.jsx
import styles from './button.module.css';

function Button({ children, variant = 'primary', ...props }) {
  // Combine the base class with the chosen variant
  const variantClass = variant === 'outline' ? styles.btnOutline : styles.btnPrimary;
  
  return (
    <button className={`${styles.btn} ${variantClass}`} {...props}>
      {children}
    </button>
  );
}

export default Button;