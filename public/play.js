"use strict";

// you can just press a key on the keyboard and it will display it, then you press enter to confirm you want to use the guess or press another key to change the guess before it's confirmed.

const guess = document.getElementById('current-guess');
let guessChar = "";

document.addEventListener("keypress", function(e) {
  // using "which" for Firefox compatibility.
  let key = e.which || e.keyCode;
  if (key === 13) {
    // POST: send the guess to the server
    if (guessChar) {
      var httpRequest = new XMLHttpRequest();
      httpRequest.open('POST', 'play');
      httpRequest.setRequestHeader('Content-Type',  'application/x-www-form-urlencoded');
      httpRequest.send('guess=' + encodeURIComponent(guessChar));

      // clear current guess
      guess.innerText = "";
      location.reload(true);
    }
  } else if (key >= 97 && key <= 122) {
    guessChar = String.fromCharCode(key);
    guess.innerText = guessChar;
  }
})
