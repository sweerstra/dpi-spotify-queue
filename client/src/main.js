import { h, app } from 'hyperapp';
import './css/style.css';
import { MUSIC_API_KEY } from './js/ApiConfig';
import { loader } from './js/loader';
import { SearchIcon, ClockIcon } from './js/icons';

const state = {
  searchedMusic: [],
  addedMusic: [],
  loading: false
};

const actions = {
  setSearchedMusic: searchedMusic => state => ({ searchedMusic }),
  setSearch: e => state => ({ search: e.target.value }),
  addToHistory: track => state => ({ addedMusic: [...state.addedMusic, track] }),
  setLoading: loading => state => ({ loading })
};

const getMusic = (actions, value) => {
  actions.setLoading(true);
  return fetch(`https://ws.audioscrobbler.com/2.0/?method=track.search&track=${value}&api_key=${MUSIC_API_KEY}&format=json`)
    .then(resp => resp.json())
    .then(music => {
      actions.setSearchedMusic(music.results.trackmatches.track);
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
      <ul class="search-list">
        {state.searchedMusic.map(({ name, artist }) =>
          <li class="search-list__item" onclick={() => actions.addToHistory({ name, artist })}>
            <span>{name}</span>
            <span>{artist}</span>
          </li>
        )}
      </ul>
      <div class="search__loader">
        {state.loading && loader}
      </div>
    </div>

    <div class="selected-list">
      <div class="selected-list__heading">
        Your Track History
        <ClockIcon/>
      </div>
      <ul class="selected-list__items">
        {state.addedMusic.map(({ name, artist }) =>
          <li class="selected-list__item">
            <span>{name}</span>
            <span>{artist}</span>
          </li>
        )}
      </ul>
    </div>
  </div>
);

app(state, actions, view, document.getElementById('root'));
