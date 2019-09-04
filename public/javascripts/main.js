"use strict";

document.onkeypress = enter;
function enter() {
    if (window.event.keyCode == 13) {
        return false;
    }
}

$('#search').on('click',
    function () {
        const queryWords = $('#mainForm').serialize();
        const urlS = "http://localhost:3000/search";
        const urlB = "http://localhost:3000/blockids";

        console.log(queryWords);

        let blockids = null;

        $.get(urlB, null, null, "json")
            .done(function (res) {
                blockids = res.ids;

                $.get(urlS, queryWords, null, "json")

                    .done(function (tweets) {

                        const $contents = $('.twitter__contents'); // htmlファイルのdivを取得
                        $('.twitter__contents').empty();

                        tweets.statuses.forEach(jdata => {

                            if (blockids.includes(jdata.user.id_str)) {
                                // console.log(`jdataの方:${jdata.user.id_str}`);
                                return;
                            }

                            showResults($contents,jdata);
                        })
                    })
                    .fail(function () {
                        console.log("検索結果を取得できません。");
                    });
            })
            .fail(function () {
                console.log("ブロックIDリストを取得できませんでした。");
            });
    }
);


function showResults($contents,jdata) {
    $contents.append(
        `<div class="twitter__block" id=${jdata.id_str}>
            <figure>
                <img src=${jdata.user.profile_image_url} />
            </figure>
            <div class="twitter__block-text">
                <div class="name">${jdata.user.name}<span class="name_reply">@${jdata.user.screen_name}</span></div>
                <div class="date">${jdata.created_at}</div>
                <div class="text">
                    ${jdata.full_text}
                </div>
                <div class="twitter__icon">
                    <span class="twitter-bubble"></span>
                    <span class="twitter-loop">${jdata.retweet_count}</span>
                    <span class="twitter-heart">${jdata.favorite_count}</span>
                </div>
            </div>
        </div>`
    );
};



$('.twitter__contents').on('click', '.twitter__block', function () {
    const id = $(this).attr("id");
    $(`#${id}`).toggleClass("selected");
});


$('#block').on('click', function () {
    //const url = "http://localhost:3000/block";

    let userData = [];

    $('.selected').each(function () {
        const id = $(this).attr("id");
        userData.push($(`#${id} .name_reply`).text().replace("@", ""));
    });

    const userJSON = JSON.stringify(userData);

    $.ajax({
        url: 'http://localhost:3000/block',
        type: 'POST',
        data: userJSON,
        contentType: 'application/json',
        success: function (res) {
            const $contents = $('.twitter__contents'); // htmlファイルのdivを取得
            console.log(res);
        }
    });

    $('.selected').remove();

});
