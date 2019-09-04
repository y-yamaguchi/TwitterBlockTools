'use strict';
/**
 * ユーザーをブロックするための関数
 * @param {Array} users ブロック対象ユーザーの配列
 */

exports.block = function (users) { 
    const twitter = require('twitter');
    const fs = require('fs');

    const client = new twitter(JSON.parse(fs.readFileSync('secret.json', 'utf-8')));

    users.forEach((name, index) => {
        const params = { screen_name: name, skip_status: true};

        setTimeout(
            function () {
                client.post('blocks/create', params, function (error, tweets, response) {
                    if (!error) {
                        console.log(`${name} is blocked!`);
                        console.log(tweets);
                    }
                });
            }, 1200 * index);
    });
};