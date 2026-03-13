import { createPortal } from 'react-dom';

const ModalPortal = ({ children }) => {
  // This creates a portal that mounts the modal outside the main app root
  return createPortal(children, document.body);
};

export default ModalPortal;