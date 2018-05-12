import Request from './Request';

const Api = {
  token: {
    getToken() {
      return localStorage.getItem('access_token');
    },
    setToken(token) {
      localStorage.setItem('access_token', token);
    },
    removeToken() {
      localStorage.removeItem('access_token');
    }
  },
  music: {
    searchTrack(q) {
      return Request.get(`https://api.spotify.com/v1/search?q=${q}&type=track,artist`, Api.token.getToken())
        .then(response => {
          return new Promise((resolve, reject) => {
            if (response.status === 401) {
              reject();
            } else {
              resolve(response.json());
            }
          });
        });
    }
  }
};

export default Api;
