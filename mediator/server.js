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

app.get('/login', function (req, res) {
    const scopes = encodeURIComponent('user-modify-playback-state');
    const redirectUri = 'http://localhost:8081';
    const clientId = process.env.SPOTIFY_CLIENT_ID;

    res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}` +
        `&scope=${scopes}&redirect_uri=${redirectUri}`);
});

const requestDestination = '/queue/trackRequestQueue';
const responseDestination = '/queue/trackResponseQueue';

const client = new Stomp('127.0.0.1', 61613, 'admin', 'admin');

client.connect(sessionId => {
    console.log('Connected with session ID: ', sessionId);

    // incoming messages should be played by the spotify service
    client.subscribe(requestDestination, (body, headers) => {
        console.log({ headers });

        SpotifyService.playTrack(body)
            .then(() => {
                console.log('send back', body);
                client.publish(responseDestination, body);
            });
    });
});

app.listen(8082);

module.exports = app;