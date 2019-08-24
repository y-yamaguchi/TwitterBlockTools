exports.block = function (users) {
    "use strict";
    const twitter = require("twitter");
    const fs = require("fs");

    const client = new twitter(JSON.parse(fs.readFileSync("secret.json", "utf-8")));

    users.forEach((name, index) => {
        const params = { screen_name: name };

        setTimeout(
            function () {
                client.post('blocks/create', params, function (error, tweets, response) {
                    if (!error) {
                        console.log(`${name} is blocked!`);
                        console.log(tweets);
                    }
                });
            }, 2000 * index);
    });
};