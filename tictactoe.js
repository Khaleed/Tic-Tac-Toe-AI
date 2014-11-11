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
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
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
    xTurn: true, // there are two players X and O & X makes a move first
    gameOver: false,
    computerMove: Math.floor(Math.random() * 8 + 0), // generate random numbers of 0 to 8 
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
            if (this.boardArr[this.winCombo[i][0]] === this.boardArr[this.winCombo[i][1]] && this.boardArr[this.winCombo[i][1]] ===
                this.boardArr[this.winCombo[i][2]] && this.boardArr[this.winCombo[i][1]] !== null) { 
                this.gameOver = true;
                return true;
            }
        }
    },

    winner: function() {
        var outcome = this.checkForWinningMove(); // check if there is a winning move
        if (outcome === true) { // if there is a winning move, decide who won
            if (this.xTurn === false) { // when X wins, this.Xturn set to false
                alert("X wins");
                this.resetGame();
            } else {
                alert("O wins");
                this.resetGame();
            }
        }
    },

    updateGame: function(object) { // player clicks the squares
        var square = object.element;
        if (this.boardArr[object.position] === null && this.gameOver !== true) { // check board array is null and game isn't over
            this.moves += 1; // increment game moves 
            this.boardArr[object.position] = "X"; // human's player current move
            this.xTurn = false; 
            square.value = this.boardArr[object.position]; // udpate UI Once a human player makes a move
            this.statusElem.innerHTML = "It's the turn of " + (this.xTurn ? "X" : "O"); // current game status 
        }
        this.winner(); // check for winner
    },

    playRandom: function() {
        // play random move by generating random numbers and checking space is available!
        var square = document.getElementsByTagName("input");
        if (this.boardArr[this.computerMove] === null && this.gameOver !== true) {
            this.moves += 1;
            this.boardArr[this.computerMove] = "O"; // computer plays
            this.xTurn = true;
            square[this.computerMove].value = this.boardArr[this.computerMove]; // update UI after computer plays a move
        }
        this.winner(); // check for winner 
    },

    // naiveAI method takes into account the current board state using this.boardArr and returns an update board
    naiveAI: function() {
        this.playRandom();
    }
};

var playGame = new TicTacToe();