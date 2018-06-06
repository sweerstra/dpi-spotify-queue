import { h } from 'hyperapp';
import './Modal.css';

const Modal = ({ isOpen = false, closable, onModalCloseRequest }, children) => {
  const modalOpenClass = isOpen ? '' : 'closed';

  return (
    <div>
      <div className={`modal ${modalOpenClass}`}>
        <div className="modal-container">
          {closable && <span className="modal__close"
                             onclick={onModalCloseRequest}>&times;</span>}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
