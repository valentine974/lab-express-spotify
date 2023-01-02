require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
const path = require('path')



app.set('view engine', 'hbs');
app.set('views',path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));

// app.set('views', __dirname + '/views');
// app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (req, res, next) => {
  res.render("index");

});

app.get("/artist-search-results", (req, res) => { 
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      const artistData = { artists: data.body.artists.items }
      res.render('artist-search-results',artistData);
      console.log("The received data from the API: ", artistData); 
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
 
});
app.get('/albums/:id', (req, res) => {  
    spotifyApi
    .getArtistAlbums(req.params.id)
    .then ((data)=> {
        const albumData ={ albums: data.body.items}
        res.render('albums',albumData);
        console.log("The received data from the API: ", albumData)
    })
    .catch((err)=>console.log("The error while searching albums occurred: ", err));
  });

app.get('/tracks/:id', (req, res) => {   
    spotifyApi
    .getAlbumTracks(req.params.id)
    .then ((data)=> {
        const tracksData ={layout:false, tracks: data.body.items}
        res.render('tracks',tracksData);
        console.log("The received data from the API: ", tracksData)
    })
    .catch((err)=>console.log("The error while searching tracks occurred: ", err));
  });



app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
