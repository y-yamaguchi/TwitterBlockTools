var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/search', function (req, res, next) {
  const s = require('../search.js');
  const q = req.query['search_words'];
  console.log(q);

  async function getJSON() {
    res.send(await s.search(q));
  }
  getJSON();
});

router.get('/addSearch', function (req, res, next) {
  const as = require('../addSearch.js');
  const q = req.query['search_words'];
  console.log(`追加検索:${q}`);
  const maxid = req.query['id'];
  console.log(maxid);

  async function getJSON() {
    res.send(await as.addSearch(q, maxid-1));
  }
  getJSON();
});


router.get('/blockids', async function (req, res, next) {
  if (require('./../share').client == null) {
    res.send('./auth/twitter');
  }
  else {
    const g = require('../getBlockIDs.js');

    async function getJSON() {
      const data = await g.blockids().catch(e => console.error(e));
      console.log(data);
      // res.send(await g.blockids().catch(e => console.error(e)));
      res.send(data);
    }
    await getJSON();
  }
});


router.post('/block', function (req, res, next) {
  const b = require('../block.js');
  const q = req.body;
  console.log(q);

  b.block(q);

  const response = JSON.stringify(['OK']);
  res.send(response);
});


router.get('/authentication', function(req, res, next){
  if (require('./../share').client == null) {
    res.send('./auth/twitter');
  }
  else{
    res.send('OK');
  }
});

// // 追加
// res.render('index', {
//   title: 'login demo',
//   session: req.session.passport //passportでログイン後は、このオブジェクトに情報が格納されます。
// });


module.exports = router;
