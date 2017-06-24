let inquirer = require("inquirer");
let fs = require("fs");
let Twitter = require('twitter');
let credentials = require('./keys');
let Spotify = require('node-spotify-api');
var request = require('request');

inquirer
    .prompt([{
            type: "list",
            message: "What can I help you with today?",
            choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
            name: "command"
        },
        {
            type: 'input',
            name: 'spotify_song',
            message: 'What song would you like to look up?',
            when: function(answers) {
                return answers.command === 'spotify-this-song';
            }
        },
        {
            type: 'input',
            name: 'omdb_movie',
            message: 'What movie would you like to look up?',
            when: function(answers) {
                return answers.command === 'movie-this';
            }
        }
    ])
    .then(function(inquirerResponse) {
        // console.log(JSON.stringify(inquirerResponse.command))
        switch (inquirerResponse.command) {
            case "my-tweets":
                _twitter();
                break;

            case "spotify-this-song":
                _spotify(inquirerResponse.spotify_song)
                _log(inquirerResponse.command, inquirerResponse.spotify_song);
                break;

            case "movie-this":
                _omdb(inquirerResponse.omdb_movie);
                _log(inquirerResponse.command, inquirerResponse.omdb_movie);
                break;

            case "do-what-it-says":
                _do();
                break;
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

function _spotify(track) {
    var spotify = new Spotify(credentials.spotifyKeys);

    spotify.search({ type: 'track', query: track || 'The Sign - Ace of Base', limit: 1 }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(' ')
        console.log(JSON.stringify('Artist: ' + data.tracks.items[0].artists[0].name, null, 2));
        console.log(JSON.stringify('Song: ' + data.tracks.items[0].name, null, 2));
        console.log(JSON.stringify('URL: ' + data.tracks.items[0].external_urls.spotify, null, 2));
        console.log(JSON.stringify('Album: ' + data.tracks.items[0].album.name, null, 2));
        console.log('----------------------');
    });
}

function _omdb(movie) {
    let key = credentials.omdbKey.apiKey
    let title = movie || "Fast Times at Ridgemont High"
    let search = 'http://www.omdbapi.com/?apikey=' + key + '&r=json&t=' + title

    request(search, function(error, response, body) {
        // console.log('error:', error); // Print the error if one occurred 
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
        console.log(' ')
        console.log("Title: " + JSON.parse(body).Title);
        console.log("Year: " + JSON.parse(body).Year);
        console.log("Rating: " + JSON.parse(body).imdbRating);
        console.log("Country: " + JSON.parse(body).Country);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Actors: " + JSON.parse(body).Actors);
        console.log("imdb Rating: " + JSON.parse(body).imdbRating);
        console.log('----------------------')
    });
}

function _do() {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log(err);
        }
        let lines = data.toString().replace('\r', '').split('\n');
        let [command, option] = lines[Math.floor(Math.random() * lines.length)].split(',');
        // this[animal][method]();

        switch (command) {
            case 'spotify-this-song':
                _spotify(option);
                break;

            case 'movie-this':
                _omdb(option)
                break;
        }
    })
}

function _log(command, content) {
    fs.appendFile("random.txt", "\r" + command + ",\"" + content + "\"", function(err) {
        if (err) {
            return console.log(err);
        }
    });
}