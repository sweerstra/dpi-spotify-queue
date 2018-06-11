import { h } from 'hyperapp';
import './Queue.css';
import { PlayIcon, RemoveIcon } from '../../icons';
import { formatDuration } from '../../utils';

const queueNameCreator = name => {
  const endingLettersToSkip = 'sxz';
  const lastLetter = name[name.length - 1];
  const suffix = endingLettersToSkip.includes(lastLetter) ? '\'' : '\'s';

  return name + suffix;
};

const Queue = ({ name, tracks, isPlaying, onPlay, onRemoveTrack }) => (
  <div class="queue">
    <div class="queue__heading">
      {name && queueNameCreator(name)} Queue
      <PlayIcon className={isPlaying ? 'animate-flicker' : ''} onclick={onPlay}/>
    </div>
    <ul class="queue__items">
      {tracks.map(({ name, artists, duration, id }, index) => (
        <li class="queue__item" key={index}>
          <div>
            <span class="queue__item__name">{name}</span>
            <span class="queue__item__artists">{artists.join(', ')}</span>
          </div>
          <span class="queue__item__duration">{formatDuration(duration)}</span>
          <RemoveIcon onclick={() => onRemoveTrack({ id, name })}/>
        </li>
      ))}
    </ul>
  </div>
);

export default Queue;
