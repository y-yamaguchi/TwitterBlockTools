exports.search = function (words) {
    return new Promise((resolve, reject) => {
        "use strict";
        const twitter = require("twitter");
        const fs = require("fs");

        const client = new twitter(JSON.parse(fs.readFileSync("secret.json", "utf-8")));

        const query = words + ' exclude:retweets';
        const params = { q: query, count: 100, tweet_mode: 'extended' };


        client.get('search/tweets', params, function (error, tweets, response) {
            if (!error) {
                console.log("JSON data OK");
                resolve(tweets);
            }
        });
    });
};