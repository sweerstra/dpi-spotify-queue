import { h, app } from 'hyperapp';
import './css/style.css';
import { SearchIcon } from './js/icons';
import { debounce, getUrlHashParams, formatDuration } from './js/utils';
import Storage from './js/data/Storage';
import Api from './js/data/Api';
import org from './vendor/amq';
import Loader from './js/components/Loader';
import Modal from './js/components/Modal';
import Queue from './js/components/Queue';

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
  searchedMusic: null,
  queuedTracks: [],
  isLoading: false,
  isModalOpen: !Storage.getGroup(),
  selectedGroup: Storage.getGroup()
};

const actions = {
  setSearchedMusic: searchedMusic => state => ({ searchedMusic }),
  addToQueue: track => {
    const stringified = JSON.stringify(track);
    amq.sendMessage(amqRequestTopic, stringified);
    console.log(stringified);
  },
  addTrack: track => state => ({ queuedTracks: [...state.queuedTracks, track] }),
  setLoading: isLoading => state => ({ isLoading }),
  setIsModalOpen: isModalOpen => state => ({ isModalOpen }),
  setSelectedGroup: selectedGroup => state => ({ selectedGroup })
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

const view = ({ searchedMusic, queuedTracks, isLoading, isModalOpen, selectedGroup }, actions) => (
  <div>
    <div class={`container ${isModalOpen ? 'modal__overlay' : ''}`}>
      <nav>
        <h1>Spotify Queue Client</h1>
        <div>
          <a href="#">View Broker</a>
        </div>
        <div>
          <a href="http://localhost:8082/authorize" target="_blank">Set Control Device</a>
        </div>
        <button onclick={() => actions.setIsModalOpen(true)}>{selectedGroup}</button>
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
                       onclick={() => actions.addToQueue({ name, artists, duration: duration_ms, uri })}
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
      <Queue name={selectedGroup} tracks={queuedTracks}/>
    </div>
    <Modal isOpen={isModalOpen}
           closable={selectedGroup}
           onModalCloseRequest={() => actions.setIsModalOpen(false)}>
      <form class="group-modal__content"
            onsubmit={e => {
              e.preventDefault();

              const group = e.target.group.value;
              Storage.setGroup(group);
              actions.setSelectedGroup(group);
              actions.setIsModalOpen(false);
            }}>
        <h2>Spotify Queue Group</h2>
        <p>
          This queue name will be used to add tracks to.
        </p>
        <input type="text" class="input" value={selectedGroup} name="group" placeholder="name..." autofocus="true"
               required/>
        <button class="btn">Confirm</button>
      </form>
    </Modal>
  </div>
);

const main = app(state, actions, view, document.getElementById('root'));

const amqRequestTopic = 'topic://suggestionRequestTopic';
const amqResponseQueue = 'topic://suggestionRequestTopic';

amq.init({
  uri: 'http://localhost:8080/amq',
  logging: true,
  timeout: 2000
});

const handleTrackResponse = (message) => {
  const track = JSON.parse(message.textContent);
  console.log('Incoming track', track);
  main.addTrack(track);
};

amq.addListener('id', amqResponseQueue, handleTrackResponse);
