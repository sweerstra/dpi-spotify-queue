import React from 'react';
import style from './index.module.css';
import classNames from 'classnames';
import { ClockIcon, PlayIcon, RemoveIcon } from '../../icons';
import { formatDuration } from '../../utils/time';

function Queue({ name, tracks, isPlaying, onPlay, onRemoveTrack }) {
  function objectifyName(name) {
    const endingLettersToSkip = 'sxz';
    const lastLetter = name[name.length - 1];
    const suffix = endingLettersToSkip.includes(lastLetter) ? '\'' : '\'s';
    return name + suffix;
  }

  const totalDuration = tracks.reduce((total, track) => total + track.duration, 0);
  const durationString = formatDuration(totalDuration, false);

  return (
    <div className={style.Queue}>
      <div className={style.header}>
        <span className={style.title}>{name && objectifyName(name)} Queue</span>
        {totalDuration > 0 && (
          <PlayIcon className={classNames(style.icon, { flicker: isPlaying })} title="Play Tracks" onClick={onPlay}/>
        )}
        {totalDuration > 0 && (
          <ClockIcon className={style.icon} title={durationString}/>
        )}
      </div>
      {tracks === null && <span className={style['loading-text']}>Looking for tracks...</span>}
      <ul className={style['item-container']}>
        {tracks.map(({ id, name, artists, duration }) => (
          <li className={style.item} key={id}>
            <div>
              <span className={style['item-name']}>{name}</span>
              <span>{artists.join(', ')}</span>
            </div>
            <span className={style['item-duration']}>{formatDuration(duration)}</span>
            <RemoveIcon className={style.icon} onClick={() => onRemoveTrack({ id, name })}/>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Queue;
