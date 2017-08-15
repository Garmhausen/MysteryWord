'use strict';

const express = require('express');
const router = express.Router();
const fs = require('fs');
const bodyParser = require('body-parser');
const parseurl = require('parseurl');
const session = require('express-session');
const expressValidator = require('express-validator');
const mustacheExpress = require('mustache-express');
const jsonfile = require('jsonfile');

const mech = require('./mechanics.js');

const file = 'winners.json';
let winners;
jsonfile.readFile(file, function(err, obj) {
  winners = obj;
});

router.get('/', function(req, res) {
  res.render('index');
});

router.post('/', function(req, res) {
  req.session.game = mech.createGame(req.body.play);
  res.redirect('/play');
});

router.get('/play', function(req, res) {
  if (req.session.game) {
    let game = req.session.game[0];
    res.render('play', { display: game });
    // }
  } else {
    res.redirect('/');
  }
});

router.post('/play', function(req, res) {
  let game = req.session.game[0];
  let guess = req.body.guess;
  game = mech.checkGuess(game, guess);
  req.session.game[0] = game;
  res.redirect('/play');
});

router.post('/win', function(req, res) {
  let word = req.session.game[0].word;
  let guesses = req.session.game[0].totalGuesses;
  let difficulty = req.session.game[0].difficulty;
  req.checkBody('name', 'You must enter a name!').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    res.render('error');
  } else {
    let name = req.body.name;
    let id = winners.winners.length;
    winners.winners.push({
      id: id,
      name: name,
      word: word,
      guesses: guesses,
      difficulty: difficulty
    });
    jsonfile.writeFileSync(file, winners);
    res.redirect('/winners');
  }
});

router.get('/winners', function(req, res) {
  res.render('winners', { display: winners.winners });
});

module.exports = router;
