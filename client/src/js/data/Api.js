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
  }
};

export default Api;
