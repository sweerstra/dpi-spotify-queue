import request from './request';
import { SpotifyClientID } from '../config';

export default {
  searchSpotifyTracks(query, token) {
    return request.get(`https://api.spotify.com/v1/search?q=${query}&type=track,artist`, token);
  },

  playSpotifyTracks(uris, token) {
    return request.put('https://api.spotify.com/v1/me/player/play', { uris }, token);
  },

  getCurrentlyPlayingTrack(token) {
    return request.get('https://api.spotify.com/v1/me/player/currently-playing', token);
  },

  redirectToSpotifyAuthorization(clientId) {
    clientId = clientId || SpotifyClientID;
    const redirectUri = window.location.origin;
    const state = 'token';
    const scope = 'scope=' + encodeURIComponent('user-modify-playback-state user-read-currently-playing');
    const spotifyUrl = 'https://accounts.spotify.com/authorize?response_type=token&' +
      `client_id=${clientId}&state=${state}&redirect_uri=${redirectUri}&${scope}`;

    window.location.replace(spotifyUrl);
  }
};
