import Request from './Request';
import { TOKEN } from '../ApiConfig';

export default {
  searchTrack: q => Request.get(`https://api.spotify.com/v1/search?q=${q}&type=track,artist`, TOKEN)
};
