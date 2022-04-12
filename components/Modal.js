import React from 'react';

import useModalState from 'hooks/useModalState';

export default function Modal({ children }) {
  const { showModal, setModal } = useModalState();
  return (
    <div
      className={`modal-container flex items-center justify-center ${
        !showModal && 'hidden'
      }`}
      onClick={() => setModal(false)}>
      <div className="modal-box relative mx-6">{children}</div>
    </div>
  );
}
