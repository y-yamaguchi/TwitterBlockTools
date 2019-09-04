exports.blockids = function () {
    return new Promise((resolve, reject) => {
        "use strict";

        const twitter = require("twitter");
        const fs = require("fs");

        const client = new twitter(JSON.parse(fs.readFileSync("secret.json", "utf-8")));

        const params = { stringify_ids: true };

        client.get('blocks/ids', params, function (error, ids, response) {
            if (!error) {
                resolve(ids);
            }
        });
    });
};