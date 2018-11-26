import React, { useEffect, useState } from 'react';
import style from './index.module.css';
import Navigation from '../Navigation/index';
import ColorPicker from '../ColorPicker/index';
import SearchBar from '../SearchBar/index';
import SearchResults from '../SearchResults/index';
import Queue from '../Queue/index';
import Modal from '../Modal/index';
import GroupModal from '../GroupModal/index';
import PlaybackModal from '../PlaybackModal';
import Api from '../../data/api';
import { preferences } from '../../data/storage';
import { getUrlParams } from '../../utils/url';

function App({ firebase }) {
  const [queuedTracks, setQueuedTracks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(preferences.getGroup());
  const [currentClientId, setCurrentClientid] = useState(preferences.getClientId());
  const [modals, setModals] = useState({
    group: !preferences.getGroup(),
    playback: false,
    colorPicker: false
  });

  useEffect(() => {
    const urlParams = getUrlParams(window.location.href);

    // verify the url contains correct state and authentication token
    if (urlParams) {
      const { state, access_token, expires_in } = urlParams;

      if (state === 'token' && access_token) {
        preferences.setToken(access_token, parseFloat(expires_in));
        window.history.replaceState(null, '', '/');
      }
    }

    const token = preferences.getToken();

    if (token === null) {
      return Api.redirectToSpotifyAuthorization(currentClientId);
    }

    if (currentGroup) {
      firebase
        .setGroupRef(currentGroup)
        .listenForTracks(setQueuedTracks);
    }
  }, []);

  function searchMusic(query) {
    if (!query) {
      return setSearchResults([]);
    }

    setIsLoading(true);

    Api.searchSpotifyTracks(query, preferences.getToken())
      .then(music => setSearchResults(music.tracks.items))
      .catch(err => {
        console.log({ err });
        if (err.response.status === 401) {
          console.log('Unauthorized');
          preferences.removeToken();
          Api.redirectToSpotifyAuthorization(currentClientId);
        }
      })
      .then(() => setIsLoading(false));
  }

  function addTrackToQueue(track) {
    firebase.addTrack(track);
    console.log({ track });
  }

  function removeTrack({ id, name }) {
    if (window.confirm(`Are you sure you want to delete "${name}" from the queue?`)) {
      firebase.removeTrack(id);
    }
  }

  function playTracks() {
    if (queuedTracks.length === 0) {
      return alert('There are no tracks in the queue to play.');
    }

    const uris = queuedTracks.map(track => track.uri);
    console.log({ uris });

    Api.playSpotifyTracks(uris, preferences.getToken())
      .then(() => setIsPlaying(true))
      .catch(err => {
        if (err.response.status === 401) {
          alert('You are not authorized to use the current playback state.');
        }
      });
  }

  function joinGroup(newGroup) {
    const currentGroup = preferences.getGroup();

    if (currentGroup) {
      firebase.removeGroupRef();
    }

    firebase
      .setGroupRef(newGroup)
      .listenForTracks(setQueuedTracks);

    preferences.setGroup(newGroup);
    setCurrentGroup(newGroup);
    openModal('group', false);
    setIsPlaying(false);
  }

  function saveClientId(clientId) {
    if (clientId === currentClientId) {
      return;
    }

    preferences.setClientId(clientId);
    setCurrentClientid(clientId);
    Api.redirectToSpotifyAuthorization(clientId);
  }

  function openModal(type, open) {
    setModals({ ...modals, [type]: open });
  }

  return (
    <>
      <div className={style.container}>
        <Navigation
          onGroupChange={() => openModal('group', true)}
          onPlayback={() => openModal('playback', true)}
          isControllingPlayback={Boolean(currentClientId)}
          onSettings={() => openModal('colorPicker', true)}/>

        <div className={style.search}>
          <SearchBar onSearch={searchMusic}/>
          <SearchResults
            results={searchResults}
            onSelect={addTrackToQueue}
            isLoading={isLoading}/>
        </div>

        <Queue name={currentGroup}
               tracks={queuedTracks}
               isPlaying={isPlaying}
               onPlay={playTracks}
               onRemoveTrack={removeTrack}/>
      </div>

      <GroupModal
        isOpen={modals.group}
        onJoin={joinGroup}
        closable={Boolean(currentGroup)}
        onClose={() => openModal('group', false)}/>

      <Modal
        title="Color Picker"
        isOpen={modals.colorPicker}
        closable={true}
        onClose={() => openModal('colorPicker', false)}>
        <ColorPicker/>
      </Modal>

      <PlaybackModal
        isOpen={modals.playback}
        currentClientId={currentClientId}
        onConfirm={saveClientId}
        onClose={() => openModal('playback', false)}/>
    </>
  );
}

export default App;
