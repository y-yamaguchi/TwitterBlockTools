var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/search', function (req, res, next) {
  const s = require('../search.js');
  const q = req.query['search_words'];
  console.log(q);

  async function getJSON() {
    //console.log(await s.search(q));
    res.send(await s.search(q));
  }
  getJSON();
});

router.post('/block', function (req, res, next) {
  const b = require('../block.js');
  const q = req.body;
  console.log(q);

  b.block(q);

  const response = JSON.stringify(["OK"]);
  res.send(response);
});

module.exports = router;
