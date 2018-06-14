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

const Queue = ({ name, tracks, isPlaying, onPlay, onRemoveTrack }) => {
  const durationInMilliseconds = tracks.reduce((totalDuration, track) => totalDuration + track.duration, 0);
  const currentDate = new Date();
  currentDate.setSeconds(currentDate.getSeconds() + (durationInMilliseconds / 1000));
  const musicUntilTimeString = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div class="queue">
      <div class="queue__heading">
        <span class="queue__heading__title">{name && queueNameCreator(name)} Queue</span>
        {durationInMilliseconds !== 0 &&
        <div>Music until {musicUntilTimeString}</div>}
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
};

export default Queue;
