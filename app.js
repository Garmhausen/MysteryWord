'use strict';

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const parseurl = require('parseurl');
const session = require('express-session');
const expressValidator = require('express-validator');
const mustacheExpress = require('mustache-express');
const jsonfile = require('jsonfile');

const secret = require('./secret.js');

const routes = require('./routes.js');
const mech = require('./mechanics.js');

// create app
const app = express();

// app setup, use mustache for the templates
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(express.static('public'));

// middleware: bodyParser(), and expressValidator()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

// session middleware

app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {}
  })
);

app.use(routes);

app.listen(process.env.PORT || 3000, function() {
  console.log(
    'Express server listening on port %d in %s mode',
    this.address().port,
    app.settings.env
  );
});
