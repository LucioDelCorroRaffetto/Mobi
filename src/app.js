var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const sessionVerify = require('../middlewares/sessionVerify');
var session = require('express-session');
const methodOverride = require('method-override');


var indexRouter = require('./routes/index');
var inmueblesRouter = require('./routes/inmuebles');
var cartRouter = require('./routes/cart');
const adminRoutes = require('./routes/admin');
const usersRouter = require('./routes/users');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(methodOverride('_method'));


app.use(session({
  secret: "1234567890",
  resave: true,
  saveUninitialized: true
}))

app.use(sessionVerify);

app.use('/', indexRouter);
app.use('/carts', cartRouter);
app.use('/inmuebles', inmueblesRouter);
app.use('/admin', adminRoutes);
app.use('/users', usersRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;