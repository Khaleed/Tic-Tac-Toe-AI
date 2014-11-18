if (!Function.prototype.bind) { // credit to Crockford for this bind function  
    Function.prototype.bind = function(oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }
        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function() {},
            fBound = function() {
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
            };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
}

var TicTacToe = function() { // current function constructor 
    this.init(); // constructor invocation method - this bound to the new object 
};

// this is the prototype object associated with the above function constructor 
TicTacToe.prototype = { // give all instances of TicTacToe class the following methods and values
    // every object linked to the prototype object which they inherit properties from
    // the prototype object is where inherited methods and values are deposited
    boardElem: null, // empty elements by setting them to null
    resetElem: null,
    resultElem: null,
    statusElem: null,
    moves: 0,
    xTurn: true, // there are two players X and O & X makes a move first and X is the human player
    computerTurn: false,
    gameOver: false,
    boardArr: [],
    winCombo: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ],

    init: function() { // first function associated with the prototype 
        // bind UI
        var source;
        this.resetElem = document.getElementById("reset-game");
        this.boardElem = document.getElementById("game-board");
        this.resultElem = document.getElementById("results");
        this.statusElem = document.getElementById("status");
        this.resetGame(); // reset game when game is first initialised
        // bind main two events
        this.resetElem.onclick = function() {
            this.resetGame(); // clear board once reset button is clicked
        }.bind(this); // inner function's this now bounded to the this variable of the outer function 
        // use bind method instead of writing var that = this
        this.boardElem.onclick = function(e) { // current click event handler (e is the event object passed as an argument)
            e = e || event; // event sometimes available through the global variable event for IE - cross browser issue
            source = e.boardElem || e.target; // event target is the object which the event is associated with - cross browser issue
            this.updateGame({ // pass an object containing the element and its data-position to updateGame method
                position: source.getAttribute("data-position"),
                element: source
            });
            this.naiveAI(); // get the AI moves using helper functions
            this.winner(); // then check who won
            this.draw();
        }.bind(this); // inner function's this variable now bounded to the this variable of the outer function
    },
    
    resetGame: function() {
        var elem, i, j;
        for (i = 0; i <= 8; i += 1) {
            this.boardArr[i] = null; // set all values of board array to null
        }
        elem = document.getElementsByTagName("input"); // get all the inputs from game-board
        for (j = 0; j <= 8; j += 1) {
            elem[j].value = ""; // clear the board
        }
        this.moves = 0; // increment each play
        this.gameOver = false;
        this.xTurn = true; // X is first player, asumme that user always plays first 
    },
    
    checkForWinningMove: function() { // check all 8 winning combinations
        // check 3 rows, 3 columns and 2 diagonals using winCombo array that holds all winning combinations of the game
        var i;
        for (i = 0; i < this.winCombo.length; i += 1) {
            if (this.boardArr[this.winCombo[i][0]] === this.boardArr[this.winCombo[i][1]] && this.boardArr[this.winCombo[i][1]] === this.boardArr[this.winCombo[i][2]] && this.boardArr[this.winCombo[i][1]] !== null) {
                this.gameOver = true;
                return true;
            }
        }
    },
    
    winner: function() {
        var outcome = this.checkForWinningMove(); // check if there is a winning move
        console.log("is there a winner?", outcome); 
        if (outcome === true) { // if there is a winning move, decide who won
            if (this.xTurn) { // when X wins, this.Xturn set to false
            console.log("does xTurn equal to false?", this.xTurn === false);
                alert("X wins");
                this.resetGame();
            } else {
                alert("O wins");
                this.resetGame();
            }
        }
    },

    draw: function () {
      var outcome = this.checkForWinningMove();
      console.log("is there a winner?",  outcome);
      if (outcome === false) {
        alert("draw");
        this.resetGame(); 
      }
    },
    
    updateGame: function(object) { // player clicks the squares
        var square = object.element;
        if (this.boardArr[object.position] === null && this.xTurn && this.gameOver !== true) { // check board array is null and game isn't over
            console.log("is there a free square" , this.boardArr[object.position] === null); // should be a function?
            this.moves += 1; // increment game move
            console.log("number of human moves is ", this.moves); 
            this.boardArr[object.position] = "X"; // human's player current move
            console.log("new board state when the human clicks square", this.boardArr); // return a new boardstate
            this.xTurn = false;
            console.log("is it the turn of X?", this.xTurn);
            square.value = this.boardArr[object.position]; // udpate UI Once a human player makes a move
            console.log("update UI for human player", square.value);
            this.statusElem.innerHTML = "It's the turn of " + (this.xTurn ? "X" : "O"); // current game status
            this.computerTurn = true;
            console.log("is it human's turn", this.computerTurn === false);
        }
    },
    
    playRandom: function() {
        // play random move by generating random numbers and checking space is available!
        var square = document.getElementsByTagName("input");
        var computerMove = Math.floor(Math.random() * 8 + 0); // generate random numbers of 0 to 8
        console.log("first random computer number is", computerMove);
        var condition = this.computerTurn; // as long as it is the computer's turn 
        console.log("is it the turn of the computer?", this.computerTurn);
        // since I don't know the number of times I have to loop, use while loop
        while (condition) { // if the condition is true, the statement is executed, condition keeps getting evaluated until it is false 
            if (this.boardArr[computerMove] === null && this.xTurn === false && this.gameOver !== true) {
                console.log("is the square empty for the computer to click?", this.boardArr[computerMove] === null); 
                this.moves += 1;
                console.log("computer number of moves", this.moves);
                this.boardArr[computerMove] = "O"; // computer plays
                console.log("new board state after computer plays a random move", this.boardArr);
                square[computerMove].value = this.boardArr[computerMove]; // update UI after computer plays a move
                this.humanTurn = true;
                this.computerTurn = false;
                this.xTurn = true;  
                console.log("is it the turn of the human?", this.humanTurn);
            }
            else {
            computerMove = Math.floor(Math.random() * 8 + 0);
            console.log("if there is a conflict, the new random computer move is", computerMove);
            }      
            condition = this.computerTurn; // the statements keep getting executed until the condition becomes false 
            console.log("break out of loop when the computer turn is", this.computerTurn);
        }
    },
    
    // naiveAI method takes into account the current board state using this.boardArr and returns an update board
    naiveAI: function() {
        this.playRandom();
  }
};
var playGame = new TicTacToe();

