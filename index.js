/*-----readline module, promises API, interface for input/output ---------------*/
const readline = require("readline");
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}
/*---------------------------------------*/
start();
async function start() {
  let min = 1;
  let max = null;
  let ans = "N";
  let guess = null;
  let range = null;
  count = 0;
  minCache = [];
  maxCache = [];

  /*-------------choose game-----------------------------*/
  game = await ask("Choose 1 to guess a number I'm thinking of; or 0 for me to guess a number you're thinking of");

  /*------------------user guesses cpu's number--------------------*/
  if (game === "1") {
    max = await ask("upper limit? ");
    console.log("OK! you picked " + max + " for the upper limit");

    range = max - min + 1;
    guess = Math.floor(Math.random() * range + min);
    console.log(guess);

    ans = await ask("what number am I thinking of?");
    term = 0;
    while (term != 1) {
      if (ans == guess) {
        replay = await ask(
          "You win! my number was " +
            guess +
            " would you like to play again?(y/n)"
        );
        if (replay === "y") {
          guess = Math.floor(Math.random() * range + min);
          console.log(guess);
          ans = await ask("what number am I thinking of?");
        } else {
          console.log("OK, thanks for playing");
          term = 1;
        }
      } else if (ans > guess) {
        ans = await ask("that's too high. guess again");
      } else if (ans < guess) {
        ans = await ask("that's too low. guess again");
      }
    }
    /*---------------- cpu guesses user's number--------------*/
  } else {
    max = await ask("upper limit?");
    console.log("OK! think of a number between 1 and " + max);

    while (ans.toUpperCase() != "Y") {
      count += 1;
      range = max - min + 1;
      guess = Math.floor((max - min) / 2 + min);

      ans = await ask("Is it " + guess + "? ");
      if (ans.toUpperCase() === "Y") {
        replay = await ask(
          "I win! your number was " +
            guess +
            " it took me " +
            count +
            " tries. would you like to play again?(y/n)"
        );
        if (replay === "y") {
          min = 1;
          max = await ask("upper limit?");
          console.log("OK! guess a number between 1 and " + max);
          ans = "n";
        } else {
          console.log("OK, thanks for playing");
          ans = "Y";
        }
      } else {
        hL = await ask("Is it higher (H), or lower (L)? ");
        if (hL.toUpperCase() === "H" && guess + 1 >= Math.min(...maxCache)) {
          console.log("hey cheater!");
          ans = "y";
        } else if (hL.toUpperCase() === "H") {
          minCache.push(guess);
          min = Math.max(...minCache);
        } else if (
          hL.toUpperCase() === "L" &&
          guess - 1 <= Math.max(...minCache)
        ) {
          console.log("hey cheater!");
          ans = "y";
        } else {
          maxCache.push(guess);
          max = Math.min(...maxCache);
        }
      }
    }
  }
  process.exit();
}
