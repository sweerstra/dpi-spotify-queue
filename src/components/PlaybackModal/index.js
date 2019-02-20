import React, { useState } from 'react';
import style from './index.module.css';
import Modal from '../Modal';

function PlaybackModal({ isOpen, currentClientId, onConfirm, onClose }) {
  const [clientId, setClientId] = useState('');

  return (
    <Modal
      title="Control Playback"
      isOpen={isOpen}
      contentClassName={style['modal-content']}
      closable={true}
      onClose={onClose}>
      <form>
        <p>
          Before controlling your playback device, <a
          href="https://developer.spotify.com/documentation/general/guides/app-settings" className={style.link}
          target="_blank" rel="noopener noreferrer">register</a> your application at Spotify.
        </p>

        {currentClientId && <p className={style['current-client-id']}>
          Current Client ID: <span className={style['client-id']}>{currentClientId}</span>
        </p>}

        <div className={style.controls}>
          <label>
            Spotify Client ID
            <input className="input input-tint"
                   value={clientId}
                   onChange={e => setClientId(e.target.value)}
                   spellCheck={false}/>
          </label>
          <button className="button button-tint"
                  onClick={() => onConfirm(clientId)}
                  disabled={!clientId}>
            Save
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default PlaybackModal;
