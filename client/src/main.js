import { h, app } from 'hyperapp';
import './css/style.css';
import { Loader } from './js/loader';
import { ClockIcon, SearchIcon } from './js/icons';
import Api from './js/api';
import org from './vendor/amq';

const amq = org.activemq.Amq;
const amqTopic = 'topic://suggestionRequestTopic';

amq.init({
  uri: 'http://localhost:8080/amq',
  logging: true,
  timeout: 2000
});

const state = {
  searchedMusic: [],
  addedMusic: [],
  loading: false
};

const actions = {
  setSearchedMusic: searchedMusic => state => ({ searchedMusic }),
  setSearch: e => state => ({ search: e.target.value }),
  addToHistory: track => {
    const stringified = JSON.stringify(track);
    console.log({ track: stringified });
    amq.sendMessage(amqTopic, stringified);

    return state => ({ addedMusic: [...state.addedMusic, track] });
  },
  setLoading: loading => state => ({ loading })
};

const getMusic = (actions, value) => {
  if (!value) return;

  actions.setLoading(true);

  Api.searchTrack(value)
    .then(music => {
      actions.setSearchedMusic(music.tracks.items);
      actions.setLoading(false);
    });
};

const view = (state, actions) => (
  <div class="container">
    <nav>
      <h1>Spotify Queue Client</h1>
      <div>
        <a href="#">View Queue</a>
      </div>
    </nav>

    <div class="search">
      <div class="search__bar">
        <input type="text" class="search__bar__input" placeholder="Search music..." spellcheck="false" autofocus="true"
               oninput={actions.setSearch}
               onkeypress={e => {
                 if (e.keyCode === 13) {
                   getMusic(actions, e.target.value);
                 }
               }}/>
        <SearchIcon onclick={() => getMusic(actions, state.search)}/>
      </div>
      {!state.loading
        ? <ul class="search-list">
          {state.searchedMusic.map(({ name, artists, album, uri }, index) =>
            <li class="search-list__item" onclick={() => actions.addToHistory({ name, artists, uri })} key={index}>
              <img class="search-list__item__image" src={album.images[album.images.length - 1].url}/>
              <span class="search-list__item__name">{name}</span>
              <span class="search-list__item__artist">{artists.map(artist => artist.name).join(', ')}</span>
            </li>
          )}
        </ul>
        : <div class="search__loader">
          <Loader/>
        </div>}
    </div>

    <div class="selected-list">
      <div class="selected-list__heading">
        Your Track History
        <ClockIcon/>
      </div>
      <ul class="selected-list__items">
        {state.addedMusic.map(({ name, artists }, index) =>
          <li class="selected-list__item" key={index}>
            <span>{name}</span>
            <span>{artists[0].name}</span>
          </li>
        )}
      </ul>
    </div>
  </div>
);

app(state, actions, view, document.getElementById('root'));
