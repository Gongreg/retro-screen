const SpotifyWebApi = require('spotify-web-api-node');
const WebApiRequest = require('spotify-web-api-node/src/webapi-request');
const HttpManager = require('spotify-web-api-node/src/http-manager');
const fs = require('fs');
const path = require('path');

const {credentials} = require('./config.local');

const MAX_LENGTH = 10;

SpotifyWebApi._addMethods({
  resume: function (options) {

    const request = WebApiRequest.builder()
      .withPath('/v1/me/player/play')
      .withHeaders({ 'Content-Type' : 'application/json' })
      .withBodyParameters(options)
      .build();

    this._addAccessToken(request, this.getAccessToken());

    return this._performRequest(HttpManager.put, request);
  },
  shuffle: function(state) {
    const request = WebApiRequest.builder()
      .withPath('/v1/me/player/shuffle')
      .withHeaders({ 'Content-Type' : 'application/json' })
      .withQueryParameters({state})
      .build();

    this._addAccessToken(request, this.getAccessToken());

    return this._performRequest(HttpManager.put, request);
  },
  volume: function(volume) {
    const request = WebApiRequest.builder()
      .withPath('/v1/me/player/volume')
      .withHeaders({ 'Content-Type' : 'application/json' })
      .withQueryParameters({volume_percent: volume})
      .build();

    this._addAccessToken(request, this.getAccessToken());

    return this._performRequest(HttpManager.put, request);
  }
});

const spotifyApi = new SpotifyWebApi(credentials);

async function refreshToken(data) {
  try {
    const response = await spotifyApi.refreshAccessToken();

    spotifyApi.setAccessToken(response.body.access_token);

    data.access_token = response.body.access_token;

    fs.writeFile(path.join(__dirname, 'auth.local.json'), JSON.stringify(data), 'utf8', () => {});
  } catch (err) {
    console.log('Could not refresh access token', err);
  }

  return data;
}

async function connect() {
  const previousData = JSON.parse(fs.readFileSync(path.join(__dirname, 'auth.local.json'), 'utf8'));
  let data = previousData;
  try {
    const response = await spotifyApix.authorizationCodeGrant(previousData.code);

    data = {
      code: previousData.code,
      access_token: response.body.access_token,
      refresh_token: response.body.refresh_token,
    };

  } catch (e) {
    //silence, that means that code was already used, so we reuse access_token and refresh token
  }

  spotifyApi.setAccessToken(data.access_token);
  spotifyApi.setRefreshToken(data.refresh_token);

  data = await refreshToken(data);

  const now = new Date();
  const millis = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 7, 30, 0, 0) - now;
  setTimeout(async function(){

    data = await refreshToken(data);

    const devices = (await spotifyApi.getMyDevices()).body.devices;
    const raspberryId = devices.filter((x) => x.name === 'raspberry')[0].id;

    await spotifyApi.transferMyPlayback({deviceIds: [raspberryId]});
    await spotifyApi.shuffle(true);
    await spotifyApi.volume(80);

    //My release radar
    spotifyApi.resume({
      context_uri: 'spotify:user:spotify:playlist:37i9dQZEVXbfxoeivZ5YRj',
      offset: {
        position: Math.floor(Math.random() * MAX_LENGTH),
      }
    });
  }, millis);




}

module.exports = {
  connect,
};
