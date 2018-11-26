import React from 'react';
import style from './index.module.css';
import classNames from 'classnames';
import { ColorsIcon, GithubIcon, HeadphonesIcon, SwitchGroupIcon } from '../../icons';

function Navigation({ onGroupChange, onPlayback, isControllingPlayback, onColorPicker }) {
  const playbackClass = classNames(style.icon, { [style.active]: isControllingPlayback });

  return (
    <nav className={style.Navigation}>
      <h1>Spotify Queue</h1>
      <SwitchGroupIcon className={style.icon} title="Change Queue" onClick={onGroupChange}/>
      <HeadphonesIcon className={playbackClass} title="Control Playback" onClick={onPlayback}/>
      <ColorsIcon className={style.icon} title="Color Picker" onClick={onColorPicker}/>
      <a className={style.link} href="https://github.com/sweerstra/dpi-spotify-queue/tree/firebase" target="_blank"
         rel="noopener noreferrer">
        <GithubIcon className={style.icon} title="GitHub Source"/>
      </a>
    </nav>
  );
}

export default Navigation;
