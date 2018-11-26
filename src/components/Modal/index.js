import React from 'react';
import style from './index.module.css';
import classNames from 'classnames';

function Modal({ isOpen, title, closable, onClose, contentClassName, children }) {
  const modalClass = classNames(style.Modal, { [style.open]: isOpen });
  const modalContentClass = classNames(style.content, contentClassName);

  return (
    <div className={modalClass}>
      <div className={modalContentClass}>
        {closable && <span className={style.close} onClick={onClose}>&times;</span>}
        <h2 className={style.title}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default Modal;
