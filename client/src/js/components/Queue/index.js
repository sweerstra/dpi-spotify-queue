import { h } from 'hyperapp';
import './Queue.css';
import { ClockIcon, PlayIcon, RemoveIcon } from '../../icons';
import { formatDurationWithAddedMilliseconds, formatDuration } from '../../utils';

const queueNameCreator = name => {
  const endingLettersToSkip = 'sxz';
  const lastLetter = name[name.length - 1];
  const suffix = endingLettersToSkip.includes(lastLetter) ? '\'' : '\'s';

  return name + suffix;
};

const Queue = ({ name, tracks, onQueueEdit, isPlaying, onPlay, onRemoveTrack }) => {
  const durationInMilliseconds = tracks.reduce((totalDuration, track) => totalDuration + track.duration, 0);
  const musicUntilTimeString = formatDurationWithAddedMilliseconds(new Date(), durationInMilliseconds);
  const durationString = formatDuration(durationInMilliseconds, false);
  const clockTitle = `Music until ${musicUntilTimeString} (${durationString})`;

  return (
    <div class="queue">
      <div class="queue__heading">
        <span class="queue__heading__title"
              onclick={onQueueEdit}>{name && queueNameCreator(name)} Queue</span>
        <PlayIcon className={isPlaying ? 'animate-flicker' : ''} onclick={onPlay}/>
        <div class="with-tooltip" data-title={clockTitle}>
          <ClockIcon/>
        </div>
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
