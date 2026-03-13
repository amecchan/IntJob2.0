import { useState } from 'react';

export const useModal = () => {
  const [activeModal, setActiveModal] = useState(null); // 'login', 'signup', 'forgot' or null

  const openModal = (name) => setActiveModal(name);
  const closeModal = () => setActiveModal(null);

  return { activeModal, openModal, closeModal };
};