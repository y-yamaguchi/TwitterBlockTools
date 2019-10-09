'use strict';

let blockids = null;
let maxid = null;

document.onkeypress = enter;
function enter() {
    if (window.event.keyCode == 13) {
        return false;
    }
}

// 認証できているかチェック
const urlA = 'http://127.0.0.1:3000/authentication';
$.get(urlA, null, null)
    .done(function (res) {
        if(res == 'OK'){
            console.log(res);
        }
        else{
            window.location.replace(res);
        }
    })
    .fail(function (err) {console.log(err);});


function getBlockIDs() {
    return new Promise(function (resolve, reject) {
        const urlB = 'http://127.0.0.1:3000/blockids';
        $.get(urlB, null, null, 'json')
            .done(function (res) {
                resolve(res.ids);
            })
            .fail(function (err) {
                console.log('ブロックIDリストを取得できませんでした。');
                reject(err);
            });
    });
}

function getSearchTweets(blockids) {
    return new Promise(function (resolve, reject) {
        const urlS = 'http://127.0.0.1:3000/search';

        const queryWords = $('#mainForm').serialize();
        console.log(queryWords);

        $.get(urlS, queryWords, null, 'json')
            .done(function (tweets) {
                const $contents = $('.twitter__contents'); // htmlファイルのdivを取得

                tweets.statuses.forEach((jdata, index) => {
                    if (tweets.statuses.length - 1 == index) {
                        maxid = jdata.id_str;
                        console.log(maxid);
                    }
                    if (blockids.includes(jdata.user.id_str)) {
                        return;
                    }
                    showResults($contents, jdata);
                });
                resolve();
            })
            .fail(function (err) {
                console.log('検索結果を取得できません。');
                reject(err);
            });
    })
}


function showResults($contents, jdata) {
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


function getAddSearchTweets() {
    return new Promise(function (resolve, reject) {
        //const urlAS = 'http://localhost:3000/addSearch';

        const queryWords = $('#mainForm').serializeArray()[0].value;

        console.log(queryWords);

        $.ajax({
            url: 'http://127.0.0.1:3000/addSearch',
            type: 'GET',
            data: {
                'id': maxid,
                'search_words': queryWords
            }
        })
            .done(function (tweets) {
                const $contents = $('.twitter__contents'); // htmlファイルのdivを取得

                tweets.statuses.forEach((jdata, index) => {
                    if (tweets.statuses.length - 1 == index) {
                        maxid = jdata.id_str;
                        console.log(maxid);
                    }
                    if (blockids.includes(jdata.user.id_str)) {
                        return;
                    }
                    showResults($contents, jdata);
                });
                resolve();
            })
            .fail(function (err) {
                console.log('検索結果を取得できません。');
                reject(err);
            });
    })
}


async function searchProcessAll() {
    try {
        // ブロックしたユーザーIDの取得
        blockids = await getBlockIDs();
        console.log(blockids);

        // ツイート一覧をクリーンにする
        $('.twitter__contents').empty();

        // 検索結果の取得
        await getSearchTweets(blockids);

        //const countC = $('.twitter__block').length;
        $('#subArea').empty();
        $('#subArea').append('<input type="button" class="btn btn-secondary" id="addSearch" value="追加検索">');

    } catch (err) {
        console.error(err);
    }
}

async function addSearchProcess() {
    try {
        // 検索結果の取得
        await getAddSearchTweets();
    } catch (err) {

    }
}


$('#search').on('click',
    function () {
        searchProcessAll();
    }
);


$('#subArea').on('click', '#addSearch',
    function () {
        console.log('追加検索がクリックされたよ');
        addSearchProcess();
    }
);


$('.twitter__contents').on('click', '.twitter__block', function () {
    const id = $(this).attr('id');
    $(`#${id}`).toggleClass('selected');
});

$('#select_all').on('click', function(){
    $('.twitter__contents').each(function(){
        $('.twitter__block').toggleClass('selected');
    });
})


$('#block').on('click', function () {
    //const url = "http://localhost:3000/block";

    let userData = [];

    if (!$('.selected').length) { // 何も選択されていないとき
        return;
    }

    $('.selected').each(function () {
        const id = $(this).attr('id');
        const addID = $(`#${id} .name_reply`).text().replace('@', '');
        if(!userData.includes(addID)){
        userData.push(addID);
        }
    });

    const userJSON = JSON.stringify(userData);

    $.ajax({
        url: 'http://127.0.0.1:3000/block',
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
