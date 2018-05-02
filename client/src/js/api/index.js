import Request from './Request';

const token = localStorage.getItem('access_token');

export default {
  searchTrack: q => Request.get(`https://api.spotify.com/v1/search?q=${q}&type=track,artist`, token)
};
