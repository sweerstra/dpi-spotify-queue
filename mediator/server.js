require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Stomp = require('stomp-client');
const SpotifyService = require('./spotify-service');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/authorize', (req, res) => {
    const scope = encodeURIComponent('user-modify-playback-state');
    const redirectUri = 'http://localhost:8082/callback';
    const clientId = process.env.SPOTIFY_CLIENT_ID;

    res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}` +
        `&scope=${scope}&state=mediator&redirect_uri=${redirectUri}`);
});

app.get('/callback', (req, res) => {
    const { code, state, error } = req.query;

    if (code && state === 'mediator') {
        res.json({ code });
    } else if (error) {
        console.log(error);
    }
});

app.get('/token/:code', (req, res) => {
    const { code } = req.params;

    const redirectUri = 'http://localhost:8082/callback';
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    SpotifyService.getToken(code, redirectUri, clientId, clientSecret)
        .then(data => {
            SpotifyService.setAccessToken(data.access_token);
            res.json(data);
        });
});

const requestDestination = '/queue/trackRequestQueue';
const responseDestination = '/queue/trackResponseQueue';

const client = new Stomp('127.0.0.1', 61613, 'admin', 'admin');

client.connect(sessionId => {
    console.log('Connected with session ID: ', sessionId);

    // incoming messages should be played by the spotify service
    client.subscribe(requestDestination, (body, headers) => {
        SpotifyService.playTracks(JSON.parse(body))
            .then(() => {
                client.publish(responseDestination, body);
            })
            .catch(err => console.log(err));
        console.log('Message received: ', body);
        client.publish(responseDestination, body);
    });
});

app.listen(8082);

module.exports = app;