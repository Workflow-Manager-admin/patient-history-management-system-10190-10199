import React from "react";

// PUBLIC_INTERFACE
function Modal({ title, children, onClose }) {
  /** Universal modal window */
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {title && <div className="modal-title">{title}</div>}
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
