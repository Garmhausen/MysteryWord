'use strict';

const express = require('express');
const session = require('express-session');
const fs = require('fs');

const words = fs.readFileSync('./words', 'utf-8').toLowerCase().split('\n');

const checkGuess = function(game, guess, next) {
  let correct = false;
  let alreadyGuessed = false;
  for (let i = 0; i < game.wordArray.length; i++) {
    if (
      guess === game.wordArray[i].letter &&
      game.wordArray[i].revealed === false
    ) {
      correct = true;
      game.wordArray[i].revealed = true;
      game.HiddenLetterCount--;
      game.totalGuesses++;
      if (!game.HiddenLetterCount) {
        game.win = true;
      }
    } else if (
      guess === game.wordArray[i].letter &&
      game.wordArray[i].revealed === true
    ) {
      alreadyGuessed = true;
    }
  }
  for (let i = 0; i < game.guessArray.length; i++) {
    if (guess === game.guessArray[i]) {
      alreadyGuessed = true;
    }
  }
  if (!correct && !alreadyGuessed) {
    game.guessArray.push(guess);
    game.remainingGuesses--;
    game.totalGuesses++;
  }
  if (game.remainingGuesses === 0) {
    game.lose = true;
  }
  return game;
  next();
};

const createGame = function(difficulty, next) {
  let word = '';
  if (difficulty == 'Easy') {
    while (word.length <= 4 || word.length >= 6) {
      word = words[Math.floor(Math.random() * words.length)];
    }
  } else if (difficulty == 'Normal') {
    while (word.length <= 6 || word.length >= 8) {
      word = words[Math.floor(Math.random() * words.length)];
    }
  } else {
    while (word.length <= 8) {
      word = words[Math.floor(Math.random() * words.length)];
    }
  }

  let guessArray = [];
  let wordArray = [];
  for (let i = 0; i < word.length; i++) {
    wordArray.push({
      letter: word.charAt(i),
      revealed: false
    });
  }
  let game = [
    {
      word: word,
      difficulty: difficulty,
      wordArray: wordArray,
      guessArray: guessArray,
      HiddenLetterCount: wordArray.length,
      totalGuesses: 0,
      remainingGuesses: 8,
      win: false,
      lose: false,
      dictionary: 'https://www.merriam-webster.com/dictionary/' + word
    }
  ];
  return game;
  next();
};

module.exports = {
  checkGuess: checkGuess,
  createGame: createGame
};
