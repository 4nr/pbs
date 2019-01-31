//
// === Create a GuessingGame Prototype ===
//

// -- Function --
// Purpose    : constructor
// Returns    : A GuessingGame object
// Arguments  : NONE
function GuessingGame(){
  // pick a random number between 1 and 10, and store it
  this._value = Math.floor(Math.random() * 10) + 1;

  // store whether or not the game is over
  this._over = false;

  // store whether or not the game has been won
  this._won = false;
}

// -- Function --
// Purpose    : Make one or more guesses
// Returns    : true if you guesses correctly, false otherwise
// Arguments  : 1) an integer
//                --OR--
//              1) an array of integers
GuessingGame.prototype.guess = function(g){
  // deal with the arguments - always make them into an array
  var guesses = [];
  if(g instanceof Array){
    guesses = g; // is an array, so just store reference
  }else{
    guesses[0] = g; // not an array, so store in element 0
  }

  // if the game is over, say so and leave
  if(this._over){
    pbs.say("Sorry - the game is over - too late to guess now!");
    return false;
  }

  // loop through the guesses
  var self = this; // alias this for use in callback
  var guessedRight = false;
  guesses.forEach(function(guess){
    // if the game is not over, make a guess
    if(!self._over){
      if(isNaN(guess)){
        pbs.say('Invalid Guess - ' + guess + ' is not a number');
      }else if(guess == self._value){
        pbs.say('CORRECT - the secret number is ' + guess);
        self._over = true;
        self._won = true;
        guessedRight = true;
      }else if(guess < self._value){
        pbs.say(guess + ' is too low');
      }else{
        pbs.say(guess + ' is too high');
      }
    }
  });

  // return how we did
  return guessedRight;
};

// -- Function --
// Purpose    : Give up - will print the answer
// Returns    : A reference to self to facilitate function chaining
// Arguments  : NONE
GuessingGame.prototype.quit = function(){
  // if the game is already over, say so, and leave
  if(this._over){
    if(this._won){
      pbs.say('Game already over - you WON!');
    }else{
      pbs.say('Game already over - you lost :(');
    }
    return this;
  }

  // end the game and reveal the answer
  this._over = true;
  pbs.say("Game Over - the secret number was " + this._value);

  // return a reference to self
  return this;
};

//
// === Use or GuessingGame Prototype ===
//

// create a new guessing game
var myGame = new GuessingGame();

// guess or give an error message
var guesses = pbs.inputs();
if(guesses.length == 0){
  pbs.say('Try guess a number between 1 and 10 (inclusive) - enter your guesses in the inputs');
}else{
  var gotIt = myGame.guess(guesses);

  // if we didn't guess right, quit so we see the answer
  if(!gotIt){
    myGame.quit();
  }
}
