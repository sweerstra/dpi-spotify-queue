import { h, app } from 'hyperapp';
import './css/main.css';
import { GithubIcon, SearchIcon } from './js/icons';
import { debounce, getUrlParams, formatDuration } from './js/utils';
import Storage from './js/data/Storage';
import Api from './js/data/Api';
import Loader from './js/components/Loader';
import Modal from './js/components/Modal';
import Queue from './js/components/Queue';
import ColorPicker from './js/components/ColorPicker';

// set up firebase with database
import firebase from 'firebase/app';
import 'firebase/database';

const config = {
  authDomain: "dpi-spotify.firebaseapp.com",
  databaseURL: "https://dpi-spotify.firebaseio.com"
};

const database = firebase
  .initializeApp(config)
  .database();

document.addEventListener('DOMContentLoaded', () => {
  const mainColor = Storage.getMainColor();
  const tintColor = Storage.getTintColor();

  if (mainColor) {
    document.documentElement.style.setProperty('--color-main', mainColor);
  }

  if (tintColor) {
    document.documentElement.style.setProperty('--color-tint', tintColor);
  }

  const storedToken = Storage.getToken();
  const isExpiredToken = Storage.hasExpiredToken();

  // if token is stored and has not expired
  if (storedToken) {
    if (isExpiredToken) {
      Storage.removeToken();
      Api.redirectToSpotifyAuthorization();
      return;
    }

    history.replaceState('', '', '/');
    return;
  }

  const params = getUrlParams(window.location.href);

  // check if url contains authentication token and correct state
  if (params) {
    const { state, access_token, expires_in } = params;

    if (access_token && state === 'token') {
      Storage.setToken(`Bearer ${access_token}`, parseFloat(expires_in));
      history.replaceState('', '', '/');
      return;
    }
  }

  Api.redirectToSpotifyAuthorization();
});

const state = {
  searchedMusic: null,
  queuedTracks: [],
  isLoading: false,
  isModalOpen: !Storage.getGroup(),
  selectedGroup: Storage.getGroup(),
  isPlaying: false,
  isColorPickerOpen: false
};

const actions = {
  setSearchedMusic: searchedMusic => state => ({ searchedMusic }),
  addToQueue: track => state => {
    database
      .ref(state.selectedGroup)
      .push(track, response => response);

    console.log(JSON.stringify(track));
  },
  setTracks: queuedTracks => state => ({ queuedTracks }),
  setLoading: isLoading => state => ({ isLoading }),
  setIsModalOpen: isModalOpen => state => ({ isModalOpen }),
  setSelectedGroup: selectedGroup => state => ({ selectedGroup }),
  setIsPlaying: isPlaying => state => ({ isPlaying }),
  setIsColorPickerOpen: isColorPickerOpen => state => ({ isColorPickerOpen })
};

const getMusic = (value, actions) => {
  if (!value) {
    actions.setSearchedMusic([]);
    return;
  }

  actions.setLoading(true);

  Api.searchSpotifyTrack(value, Storage.getToken())
    .then(music => actions.setSearchedMusic(music.tracks.items))
    .catch(() => {
      Storage.removeToken();
      Api.redirectToSpotifyAuthorization();
    })
    .then(() => actions.setLoading(false));
};

const playMusic = (uris, actions) => {
  if (!uris || uris.length === 0) {
    alert('There are no tracks in the queue to play.');
    return;
  }

  Api.playSpotifyTracks(uris, Storage.getToken())
    .then(() => actions.setIsPlaying(true))
    .catch(() => alert('You are not authorized to use the current playback state.'));
};

const setMainColor = (color) => {
  Storage.setMainColor(color);
  document.documentElement.style.setProperty('--color-main', color);
};

const setTintColor = (color) => {
  Storage.setTintColor(color);
  document.documentElement.style.setProperty('--color-tint', color);
};

const searchCallback = debounce((value, actions) => getMusic(value, actions), 500);

const view = ({ searchedMusic, queuedTracks, isLoading, isModalOpen, selectedGroup, isPlaying, isColorPickerOpen }, actions) => (
  <div>
    <div class={`container ${isModalOpen ? 'modal__overlay' : ''}`}>
      <nav>
        <h1>Spotify Queue</h1>
        <ColorPicker isOpen={isColorPickerOpen}
                     onToggle={() => actions.setIsColorPickerOpen(!isColorPickerOpen)}
                     onSelectBackgroundColor={color => {
                       setMainColor(color);
                       actions.setIsColorPickerOpen(false);
                     }}
                     onSelectTextColor={color => {
                       setTintColor(color);
                       actions.setIsColorPickerOpen(false);
                     }}
                     onCreate={colorPicker => colorPickerRef = colorPicker}/>
        <button onclick={() => Api.redirectToSpotifyAuthorization(true)}>Control Playback</button>
        <a href="https://github.com/sweerstra/dpi-spotify-queue/tree/firebase" target="_blank">
          <GithubIcon/>
        </a>
      </nav>

      <div class="search">
        <div class="search__bar">
          <SearchIcon/>
          <input type="text" class="search__bar__input" placeholder="Search for music..." autofocus="true"
                 oninput={e => searchCallback(e.target.value, actions)}/>
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
        </ul>
        {isLoading && <div class="search__loader">
          <Loader/>
        </div>}
      </div>
      <Queue name={selectedGroup}
             tracks={queuedTracks}
             onQueueEdit={() => actions.setIsModalOpen(true)}
             isPlaying={isPlaying}
             onPlay={() => {
               const uris = queuedTracks.map(track => track.uri);
               console.log({ uris });
               playMusic(uris, actions);
             }}
             onRemoveTrack={({ id, name }) => {
               if (confirm(`Are you sure you want to delete "${name}" from the queue?`)) {
                 database
                   .ref(selectedGroup)
                   .child(id)
                   .remove();
               }
             }}/>
    </div>
    <Modal className="group-modal"
           isOpen={isModalOpen}
           closable={selectedGroup}
           onModalCloseRequest={() => actions.setIsModalOpen(false)}>
      <form class="group-modal__content"
            onsubmit={e => {
              e.preventDefault();

              const oldGroup = Storage.getGroup();

              if (oldGroup) {
                removeTrackListener(oldGroup);
              }

              const group = e.target.group.value;
              Storage.setGroup(group);
              actions.setSelectedGroup(group);
              actions.setIsModalOpen(false);
              actions.setIsPlaying(false);

              setTrackListener(group);
            }}>
        <h2>Join an existing queue or create one</h2>
        <p>Make sure you'll spread the word of your queue!</p>
        <input type="text" class="input"
               value={selectedGroup} name="group" placeholder="your queue name..." required/>
        <button class="btn">Confirm</button>
      </form>
    </Modal>
  </div>
);

const main = app(state, actions, view, document.getElementById('root'));

let colorPickerRef;

document.addEventListener('click', (e) => {
  if (!colorPickerRef || !colorPickerRef.contains(e.target)) {
    main.setIsColorPickerOpen(false);
  }
});

const setTrackListener = (group) => {
  if (group) {
    database
      .ref(group)
      .on('value', snapshot => {
        const val = snapshot.val();

        const tracks = val
          ? Object.entries(val).map(([id, obj]) => ({ id, ...obj }))
          : [];

        main.setTracks(tracks);
      });
  }
};

const removeTrackListener = (group) => {
  database
    .ref(group)
    .off();
};

const { selectedGroup } = state;

setTrackListener(selectedGroup);
