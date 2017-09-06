const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const routes = require('./routes/index');
const paysuccess = require('./routes/paysuccess');
const app = express();
const sslRedirect = require('heroku-ssl-redirect');
const mongoose = require('mongoose');


mongoose.connect('localhost:27017/stripe-subscription')
// Enable ssl redirect 
app.use(sslRedirect());
// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}))
app.set('view engine', '.hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/paysuccess', paysuccess);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;


