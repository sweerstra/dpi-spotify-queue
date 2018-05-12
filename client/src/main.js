import { app } from 'hyperapp';
import './css/style.css';
import { ClockIcon, PlayIcon, SearchIcon } from './js/icons';
import { debounce } from './js/utils';
import Api from './js/api';
import org from './vendor/amq';
import TokenField from './js/components/TokenField';
import Loader from './js/components/Loader';

const amq = org.activemq.Amq;

const token = Api.token.getToken();

const state = {
  search: '',
  searchedMusic: null,
  addedMusic: [],
  isLoading: false,
  token,
  isEditingToken: !token
};

const actions = {
  setSearchedMusic: searchedMusic => state => ({ searchedMusic }),
  addToHistory: track => {
    const stringified = JSON.stringify(track);
    amq.sendMessage(amqRequestTopic, stringified);
    return state => ({ addedMusic: [...state.addedMusic, track] });
  },
  setTrackToIsPlaying: uri => state => ({
    addedMusic: state.addedMusic.map(track => {
      const isPlaying = track.uri === uri;
      return { ...track, isPlaying };
    })
  }),
  setLoading: isLoading => state => ({ isLoading }),
  setToken: token => () => {
    if (token) {
      Api.token.setToken(token);
    }
    return { token, isEditingToken: !token };
  },
  removeToken: () => () => {
    Api.token.removeToken();
    return { token: null, isEditingToken: true };
  },
  setEditingToken: isEditingToken => state => ({ isEditingToken })
};

const getMusic = (value, actions) => {
  if (!value) return;

  actions.setLoading(true);

  Api.music.searchTrack(value)
    .then(music => actions.setSearchedMusic(music.tracks.items))
    .catch(() => {
      // unauthorized, so remove token
      actions.removeToken();
      actions.setSearchedMusic([]);
    })
    .then(() => actions.setLoading(false));
};

const searchCallback = debounce((value, actions) => {
  getMusic(value, actions);
}, 500);

const formatDuration = (durationInMilliseconds) => {
  const seconds = durationInMilliseconds / 1000;
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = Math.round(seconds % 60);
  return `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;
};

const view = ({ search, searchedMusic, addedMusic, isLoading, token, isEditingToken }, actions) => (
  <div class="container">
    <nav>
      <h1>Spotify Queue Client</h1>
      <TokenField token={token}
                  isEditing={isEditingToken}
                  onSubmit={actions.setToken}
                  onEdit={actions.setEditingToken}/>
      <div>
        <a href="#">View Queue</a>
      </div>
    </nav>

    <div class="search">
      <div class="search__bar">
        <input type="text" class="search__bar__input" placeholder="Search for music..." spellcheck={false}
               autofocus="true"
               oninput={e => searchCallback(e.target.value, actions)}/>
        <SearchIcon/>
      </div>
      <ul class="search-list">
        {(searchedMusic && searchedMusic.length > 0) && searchedMusic.map(({ name, artists, album, duration_ms, uri }, index) => {
          artists = artists.map(artist => artist.name);
          return <li class="search-list__item"
                     onclick={() => actions.addToHistory({ name, artists, duration: duration_ms, uri })}
                     key={index}>
            <img class="search-list__item__image" src={album.images[album.images.length - 1].url}/>
            <span class="search-list__item__name">{name}</span>
            <span class="search-list__item__artist">{artists.join(', ')}</span>
            <span class="search-list__item__duration">{formatDuration(duration_ms)}</span>
          </li>;
        })}
        {searchedMusic && searchedMusic.length === 0 && <div class="search-list__no-results">
          No results found.
        </div>}
      </ul>
      {isLoading && <div class="search__loader">
        <Loader/>
      </div>}
    </div>

    <div class="selected-list">
      <div class="selected-list__heading">
        Your Track History
        <ClockIcon/>
      </div>
      <ul class="selected-list__items">
        {addedMusic.map(({ name, artists, duration, isPlaying }, index) => (
          <li class="selected-list__item" key={index}>
            <span class="selected-list__item__name">{name}</span>
            {isPlaying ? <PlayIcon/> : undefined}
            <span class="selected-list__item__artists">{artists[0]}</span>
            <span class="selected-list__item__duration">{formatDuration(duration)}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const main = app(state, actions, view, document.getElementById('root'));

const amqRequestTopic = 'topic://suggestionRequestTopic';
const amqResponseQueue = 'queue://trackRequestQueue';

amq.init({
  uri: 'http://localhost:8080/amq',
  logging: true,
  timeout: 2000
});

const handleTrackResponse = ({ textContent }) => {
  const track = JSON.parse(textContent);
  console.log('Message Response: ', track);
  main.setTrackToIsPlaying(track.uri);
};

amq.addListener('id', amqResponseQueue, handleTrackResponse);
