let inquirer = require("inquirer");
let fs = require("fs");
let Twitter = require('twitter');
let credentials = require('./keys');
let Spotify = require('node-spotify-api');

let input = process.argv[3];

inquirer
    .prompt([{
        type: "checkbox",
        message: "What can I help you with today?",
        choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
        name: "command"
    }, {
        type: "confirm",
        message: "Are you sure:",
        name: "confirm",
        default: true
    }])
    .then(function(inquirerResponse) {
        if (inquirerResponse.confirm) {
            switch (inquirerResponse.command[0]) {
                case "my-tweets":
                    // console.log();
                    _twitter();
                    break;

                case "spotify-this-song":
                    console.log();
                    _spotify()
                    break;

                case "movie-this":
                    console.log();
                    _omdb();
                    break;

                case "do-what-it-says":
                    console.log();
                    _do();
                    break;
            }
        } else {
            console.log('oops');
        }
    });

let params = {
    q: "",
    count: 20
}

function _twitter() {
    let client = new Twitter(credentials.twitterKeys)
    let params = { screen_name: 'jackbarker404', count: 20 }

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) throw error;
        for (var i = 0; i < tweets.length; i++) {
            console.log(' ')
            console.log(tweets[i].text)
            console.log(tweets[i].created_at)
            console.log('----------------------')
        }
    });

}

function _spotify() {
    var spotify = new Spotify(credentials.spotifyKeys);

    spotify.search({ type: 'track', query: 'One Love - bob marley' || 'My Mumps', limit: 1 }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        // console.log(JSON.stringify(data.tracks.items[0].album.artists[0].name, null, 2));
        // console.log(JSON.stringify(data.tracks.items[0], null, 2));
        console.log(' ')
        console.log(JSON.stringify('Artist: ' + data.tracks.items[0].artists[0].name, null, 2));
        console.log(JSON.stringify('Song: ' + data.tracks.items[0].name, null, 2));
        console.log(JSON.stringify('URL: ' + data.tracks.items[0].external_urls.spotify, null, 2));
        console.log(JSON.stringify('Album: ' + data.tracks.items[0].album.name, null, 2));
        console.log('----------------------')

    });


}