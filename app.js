require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:

app.get('/', (request, response) => {
  response.render('home');
});

app.get('/artist-search', (request, response) => {
  const term = request.query.term;
  const artist = spotifyApi.searchArtists(term);

  artist
    .then(data => {
      const result = data.body.artists.items;

      // console.log('The received data from the API: ', result);

      response.render('artist-search-results', { searchResult: result });
    })
    .catch(err =>
      console.log('The error while searching artists occurred: ', err)
    );
});

app.get('/albums/:artistId', (request, response, next) => {
  const artistId = request.params.artistId;
  const artistAlbums = spotifyApi.getArtistAlbums(artistId);

  artistAlbums
    .then(data => {
      const result = data.body.items;
      console.log('Artist albums', result);
      response.render('albums', { albums: result });
    })
    .catch(err =>
      console.log('The error while searching albums occurred: ', err)
    );
});

app.get('/tracks/:albumsId', (request, response, next) => {
  const albumsId = request.params.albumsId;
  const albumTracks = spotifyApi.getAlbumTracks(albumsId);

  albumTracks
    .then(data => {
      const result = data.body.items;
      console.log(' albums tracks', result);
      response.render('tracks', { tracks: result });
    })
    .catch(err =>
      console.log('The error while searching tracks occurred: ', err)
    );
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
