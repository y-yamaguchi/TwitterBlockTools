var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// passportを追加
var passport = require('passport');
// passport-twitterを追加
var TwitterStrategy = require('passport-twitter').Strategy;


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//////////////////////////////////////////////////////////////////////////////////

// passportのための追加

app.use(
  require('express-session')({
    secret: 'reply-analyzer',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

// セッション管理に関する設定
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  done(null, id);
});


const fs = require('fs');
const twitter = require('twitter');

const consumers = JSON.parse(fs.readFileSync('secret.json', 'utf-8'));
const TWITTER_CONSUMER_KEY = consumers.consumer_key;
const TWITTER_CONSUMER_SECRET = consumers.consumer_secret;
let access_token_key = null;
let access_token_secret = null;


require('./share').client = null;

passport.use(new TwitterStrategy({
  consumerKey: TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
  callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
},
  function (token, tokenSecret, profile, cb) {
    access_token_key = token;
    access_token_secret = tokenSecret;

    require('./share').client = new twitter({
      consumer_key: TWITTER_CONSUMER_KEY,
      consumer_secret: TWITTER_CONSUMER_SECRET,
      access_token_key: access_token_key,
      access_token_secret: access_token_secret
    });

    console.log(token, tokenSecret);
    process.nextTick(function () {
      return cb(null, profile);
    });
  }
));

// 認証のために Twitter へリダイレクトさせます。認証が完了すると、Twitter は
// ユーザーをアプリケーションへとリダイレクトして戻します。
//   /auth/twitter/callback
app.get('/auth/twitter', passport.authenticate('twitter'));

// ユーザーが許可すると、Twitter はユーザーをこの URL にリダイレクトさせます。
// この認証プロセスの最後に、アクセストークンの取得をおこないます。
// この取得が成功すればユーザーはログインしたことになります。取得に失敗したとき
// は、認証が失敗したとみなされます。
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

////////////////////////////////////////////////////////////////////////////////////////////////



app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
