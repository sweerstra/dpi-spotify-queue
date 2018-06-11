import Request from './Request';

const Api = {
  searchSpotifyTrack(query, token) {
    return Request.get(`https://api.spotify.com/v1/search?q=${query}&type=track,artist`, token)
      .then(response => {
        return new Promise((resolve, reject) => {
          if (response.status === 401) {
            reject({ error: 'Unauthorized' });
          } else {
            resolve(response.json());
          }
        });
      });
  },

  playSpotifyTracks(uris, token) {
    return Request.put('https://api.spotify.com/v1/me/player/play', { uris }, token)
      .then(response => {
        return new Promise((resolve, reject) => {
          console.log(response);
          if (response.status === 401) {
            reject({ error: 'Unauthorized' });
          } else {
            resolve({ isPlaying: true });
          }
        });
      });
  },

  redirectToSpotifyAuthorization(withScope) {
    const clientId = '5d155fde6d184e87bdb4be4639ee0aab';
    const redirectUri = window.location.origin;
    const state = withScope ? 'device' : 'token';
    const scope = withScope ? 'scope=' + encodeURIComponent('user-modify-playback-state') : '';
    const spotifyUrl = 'https://accounts.spotify.com/authorize?response_type=token&' +
      `client_id=${clientId}&state=${state}&redirect_uri=${redirectUri}&${scope}`;

    window.location.replace(spotifyUrl);
  }
};

export default Api;
