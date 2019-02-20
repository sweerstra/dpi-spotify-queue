import React, { useState } from 'react';
import style from './index.module.css';
import Modal from '../Modal';

function GroupModal({ isOpen, onJoin, closable, onClose }) {
  const [group, setGroup] = useState('');

  return (
    <Modal
      title="Join an existing queue or create one"
      contentClassName={style.content}
      isOpen={isOpen}
      closable={closable}
      onClose={onClose}>
      <form onSubmit={e => {
        e.preventDefault();
        onJoin(group);
      }}>
        <div className={style['content-box']}>
          <label>
            Queue name *
            <input className="input input-tint"
                   value={group}
                   onChange={e => setGroup(e.target.value)}
                   autoFocus={true}/>
          </label>
          <button className="button button-tint"
                  disabled={!group}
                  spellCheck={false}>Confirm
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default GroupModal;
