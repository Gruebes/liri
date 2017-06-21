let inquirer = require("inquirer");
let fs = require("fs");
let Twitter = require('twitter');
let twitterCreds = require('./keys');

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
    let client = new Twitter(twitterCreds)
    console.log("client: " + JSON.stringify(client, null, 2))

    client.get('search/tweets', { q: 'node.js' }, function(error, tweets, response) {
        if (error) throw error;
        console.log(JSON.stringify(tweets, null, 2)); // The favorites. 
        // console.log(JSON.stringify(response, null, 2)); // Raw response object. 
    });

}

function _spotify() {

}