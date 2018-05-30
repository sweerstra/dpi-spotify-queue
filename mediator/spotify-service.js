const axios = require('axios');
const querystring = require('querystring');

class SpotifyService {
    constructor(credentials) {
        this._credentials = credentials || {};
    }

    setCredential(key, value) {
        this._credentials[key] = value;
    }

    getCredential(key) {
        return this._credentials[key];
    }

    setAccessToken(token) {
        this.setCredential('access_token', token);
    }

    getAccessToken() {
        return this.getCredential('access_token');
    }

    playTracks(tracks) {
        const token = this.getAccessToken();
        const url = 'https://api.spotify.com/v1/me/player/play';

        return axios({
            url,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: { uris: tracks }
        });
    }

    getToken(code, redirectUri, clientId, clientSecret) {
        const url = 'https://accounts.spotify.com/api/token';

        const params = querystring.stringify({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret
        });

        return axios.post(url, params)
            .then(response => response.data)
            .catch(error => error.response.data);
    }
}

module.exports = new SpotifyService();