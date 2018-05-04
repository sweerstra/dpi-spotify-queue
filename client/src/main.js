import { h, app } from 'hyperapp';
import './css/style.css';
import { Loader } from './js/loader';
import { ClockIcon, SearchIcon } from './js/icons';
import { debounce } from './js/utils';
import Api from './js/api';
import org from './vendor/amq';
import TokenField from './js/components/TokenField';

const amq = org.activemq.Amq;
const amqTopic = 'topic://suggestionRequestTopic';

amq.init({
  uri: 'http://localhost:8080/amq',
  logging: true,
  timeout: 2000
});

const state = {
  search: '',
  searchedMusic: null,
  addedMusic: [],
  loading: false,
  token: Api.getToken()
};

const actions = {
  setSearchedMusic: searchedMusic => state => ({ searchedMusic }),
  addToHistory: track => {
    const stringified = JSON.stringify(track);
    amq.sendMessage(amqTopic, stringified);
    return state => ({ addedMusic: [...state.addedMusic, track] });
  },
  setLoading: loading => state => ({ loading }),
  setToken: token => state => {
    Api.setToken(token);
    return { token };
  }
};

const getMusic = (value, actions) => {
  if (!value) return;

  actions.setLoading(true);

  Api.searchTrack(value)
    .then(music => actions.setSearchedMusic(music.tracks.items))
    .catch(() => {
      // unauthorized, so remove token
      actions.setToken(null);
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

const view = ({ search, searchedMusic, addedMusic, loading, token }, actions) => (
  <div class="container">
    <nav>
      <h1>Spotify Queue Client</h1>
      <TokenField onSubmit={actions.setToken} token={token}/>
      <div>
        <a href="#">View Queue</a>
      </div>
    </nav>

    <div class="search">
      <div class="search__bar">
        <input type="text" class="search__bar__input" placeholder="Search for music..." spellcheck="false"
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
      {loading && <div class="search__loader">
        <Loader/>
      </div>}
    </div>

    <div class="selected-list">
      <div class="selected-list__heading">
        Your Track History
        <ClockIcon/>
        <span>
          {formatDuration(addedMusic.reduce((total, track) => total + track.duration, 0))}
        </span>
      </div>
      <ul class="selected-list__items">
        {addedMusic.map(({ name, artists, duration }, index) => (
          <li class="selected-list__item" key={index}>
            <span class="selected-list__item__name">{name}</span>
            <span class="selected-list__item__artists">{artists[0]}</span>
            <span class="selected-list__item__duration">{formatDuration(duration)}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

app(state, actions, view, document.getElementById('root'));
