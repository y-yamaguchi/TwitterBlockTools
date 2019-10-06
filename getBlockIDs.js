exports.blockids = function () {
    return new Promise((resolve, reject) => {
        'use strict';

        const twitter = require('twitter');
        const fs = require('fs');

        // const client = new twitter(JSON.parse(fs.readFileSync('secret.json', 'utf-8')));
        const client = require('./share').client;

        const params = { stringify_ids: true };

        client.get('blocks/ids', params, function (error, ids, response) {
            if (!error) {
                console.log('next_cursor:' + ids.next_cursor_str);
                if (ids.next_cursor_str != '0') {
                    ids = additional(ids);
                }
                // console.log(ids);

                resolve(ids);
            }
            reject(error);
        });
    });
}

function additional(currentids) {
    // console.log(currentids);
    return new Promise((resolve, reject) => {
        const params = { stringify_ids: true, cursor: parseInt(currentids.next_cursor_str, 10) };
        const client = require('./share').client;
        client.get('blocks/ids', params, function (error, ids, response) {
            if (!error) {
                console.log('additional next_cursor:' + ids.next_cursor_str);

                const mergeids = ids.ids.concat(currentids.ids);
                ids.ids = mergeids;

                if (ids.next_cursor_str != '0') {
                    resolve(additional(ids));
                }
                resolve(ids);
            }
            reject(error);
        });
    });
}