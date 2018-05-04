import Request from './Request';

export default {
  getToken() {
    const token = localStorage.getItem('access_token');
    console.log({ token });
    return token;
  },
  setToken(token) {
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      this.removeToken();
    }
  },
  removeToken() {
    localStorage.removeItem('access_token');
  },
  searchTrack(q) {
    return Request.get(`https://api.spotify.com/v1/search?q=${q}&type=track,artist`, this.getToken())
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
};
