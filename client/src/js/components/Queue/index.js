import { h } from 'hyperapp';
import './Queue.css';
import { ClockIcon, PlayIcon } from '../../icons';
import { formatDuration } from '../../utils';

const queueNameCreator = name => {
  const endingLettersToSkip = 'sxz';
  const lastLetter = name[name.length - 1];
  const suffix = endingLettersToSkip.includes(lastLetter) ? '\'' : '\'s';

  return name + suffix;
};

const Queue = ({ name, tracks }) => (
  <div class="queue">
    <div class="queue__heading">
      {name && queueNameCreator(name)} Queue
      <ClockIcon/>
    </div>
    <ul class="queue__items">
      {tracks.map(({ name, artists, duration, isPlaying }, index) => (
        <li class="queue__item" key={index}>
          <span class="queue__item__name">{name}</span>
          {isPlaying && <PlayIcon/>}
          <span class="queue__item__artists">{artists[0]}</span>
          <span class="queue__item__duration">{formatDuration(duration)}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default Queue;
