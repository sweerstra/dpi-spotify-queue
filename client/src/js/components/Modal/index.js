import { h } from 'hyperapp';
import './Modal.css';

const Modal = ({ className, isOpen = false, closable, onModalCloseRequest }, children) => {
  const modalOpenClass = isOpen ? '' : 'closed';

  return (
    <div className={`modal ${className} ${modalOpenClass}`}>
      <div className="modal-container">
        {closable && <span className="modal__close"
                           onclick={onModalCloseRequest}>&times;</span>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
