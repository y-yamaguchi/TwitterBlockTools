exports.addSearch = function (words, lastID) {
    return new Promise((resolve, reject) => {
        'use strict';
        const twitter = require('twitter');
        const fs = require('fs');

        // const client = new twitter(JSON.parse(fs.readFileSync('secret.json', 'utf-8')));
        const client = require('./share').client;

        const query = words + ' exclude:retweets';
        const params = { q: query, count: 100, tweet_mode: 'extended', max_id: lastID};


        client.get('search/tweets', params, function (error, tweets, response) {
            if (!error) {
                console.log('Additional JSON data OK');
                resolve(tweets);
            }
        });
    });
};