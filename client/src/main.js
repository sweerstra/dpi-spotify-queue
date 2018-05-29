import { h, app } from 'hyperapp';
import './css/style.css';
import { ClockIcon, PlayIcon, SearchIcon } from './js/icons';
import { debounce, getUrlHashParams } from './js/utils';
import Storage from './js/data/Storage';
import Api from './js/data/Api';
import org from './vendor/amq';
import Loader from './js/components/Loader';

const amq = org.activemq.Amq;

document.addEventListener('DOMContentLoaded', () => {
  const storedToken = Storage.getToken();
  const isExpiredToken = Storage.hasExpiredToken();

  // if token is stored and has not expired
  if (storedToken) {
    if (isExpiredToken) {
      Storage.removeToken();
      redirectToSpotifyAuthorization();
    }

    return;
  }

  const params = getUrlHashParams(window.location.href);

  // check if url contains authentication token and correct state
  if (params) {
    const { access_token, state, expires_in } = params;

    if (access_token && state === 'client') {
      Storage.setToken(`Bearer ${access_token}`, parseFloat(expires_in));
      return;
    }
  }

  redirectToSpotifyAuthorization();
});

const redirectToSpotifyAuthorization = () => {
  const clientId = '5d155fde6d184e87bdb4be4639ee0aab';
  const redirectUri = 'http://localhost:8081';
  const spotifyUrl = 'https://accounts.spotify.com/authorize?response_type=token&' +
    `client_id=${clientId}&state=client&redirect_uri=${redirectUri}`;

  window.location.replace(spotifyUrl);
};

const state = {
  search: '',
  searchedMusic: null,
  addedMusic: [],
  isLoading: false
};

const actions = {
  setSearchedMusic: searchedMusic => state => ({ searchedMusic }),
  addToHistory: track => {
    const stringified = JSON.stringify(track);
    amq.sendMessage(amqRequestTopic, stringified);
    console.log(stringified);
    return state => ({ addedMusic: [...state.addedMusic, track] });
  },
  setTrackToIsPlaying: uri => state => ({
    addedMusic: state.addedMusic.map(track => {
      const isPlaying = track.uri === uri;
      return { ...track, isPlaying };
    })
  }),
  setLoading: isLoading => state => ({ isLoading })
};

const getMusic = (value, actions) => {
  if (!value) {
    return;
  }

  actions.setLoading(true);

  Api.searchSpotifyTrack(value, Storage.getToken())
    .then(music => actions.setSearchedMusic(music.tracks.items))
    .catch(() => {
      Storage.removeToken();
      redirectToSpotifyAuthorization();
    })
    .then(() => actions.setLoading(false));
};

const searchCallback = debounce((value, actions) => getMusic(value, actions), 500);

const formatDuration = (durationInMilliseconds) => {
  const seconds = durationInMilliseconds / 1000;
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = Math.round(seconds % 60);
  return `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;
};

const view = ({ search, searchedMusic, addedMusic, isLoading }, actions) => (
  <div class="container">
    <nav>
      <h1>Spotify Queue Client</h1>
      <div>
        <a href="#">View Queue</a>
      </div>
    </nav>

    <div class="search">
      <div class="search__bar">
        <input type="text" class="search__bar__input" placeholder="Search for music..." autofocus="true"
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
            {isPlaying && <PlayIcon/>}
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
const amqResponseQueue = 'queue://suggestionResponseQueue';

amq.init({
  uri: 'http://localhost:8080/amq',
  logging: true,
  timeout: 2000
});

const handleTrackResponse = (message) => {
  console.log({ message });
  const track = JSON.parse(message.textContent);
  console.log('Message Response: ', track);
  main.setTrackToIsPlaying(track.uri);
};

amq.addListener('id', amqResponseQueue, handleTrackResponse);
