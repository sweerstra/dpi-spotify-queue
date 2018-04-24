import { h, app } from 'hyperapp';
import './css/style.css';
import { MUSIC_API_KEY } from './js/ApiConfig';

const state = {
  searchedMusic: [],
  addedMusic: []
};

const getSearchedMusic = (value) => {
  return fetch(`https://ws.audioscrobbler.com/2.0/?method=track.search&track=${value}&api_key=${MUSIC_API_KEY}&format=json`)
    .then(resp => resp.json());
};

const actions = {
  setSearchedMusic: searchedMusic => state => ({ searchedMusic }),
  addToHistory: track => state => ({ addedMusic: [...state.addedMusic, track] })
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
        <input type="text" class="search__bar__input" placeholder="Search music..." spellcheck="false"
               onkeypress={e => {
                 if (e.keyCode === 13) {
                   getSearchedMusic(e.target.value)
                     .then(music => {
                       actions.setSearchedMusic(music.results.trackmatches.track);
                     });
                 }
               }}/>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             class="feather feather-search" color="#384047">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>

      <ul class="search-list">
        {state.searchedMusic.map(({ name, artist }) =>
          <li class="search-list__item" onclick={() => actions.addToHistory({ name, artist })}>
            <span>{name}</span>
            <span>{artist}</span>
          </li>
        )}
      </ul>
    </div>
    <div class="selected-list">
      <div class="selected-list__heading">
        Your Track History
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             class="feather feather-clock" color="#384047">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
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
