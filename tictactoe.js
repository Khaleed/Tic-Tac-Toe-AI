if (!Function.prototype.bind) { // credit to Crockford for this bind function  
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound; // NYC 
    };
}

var TicTacToe = function() { // current function constructor 
    this.init();
};
// this is the prototype obect associated with the above function constructor 
TicTacToe.prototype = { // give all instances of TicTacToe class the following methods and values
    // every object linked to the prototype object which they inherit properties from
    // the prototype object is where inherited methods and values are deposited
    boardElem: null, // empty elements by setting them to null
    resetElem: null,
    resultElem: null,
    statusElem: null,
    xTurn: true,
    gameOver: false,
    moves: 0,
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
        this.resetElem = document.getElementById("reset");
        this.boardElem = document.getElementById("game-board");
        this.resultElem = document.getElementById("results");
        this.statusElem = document.getElementById("status");
        this.resetGame();
        // current binded events on clicking resetGame and gameboard
        this.resetElem.onclick = function() {
            this.resetGame();
        }.bind(this); // this now bounded to the this parameter of the outer function 
        // (bind() instead of writing var that = this
        this.boardElem.onclick = function(e) { // current click event handler (e is the event object passed as an arg)
            e = e || event; // event sometimes available through the global variable event (for IE)
            var source = e.boardElem || e.target; // event target is the object which
            // the event is associated
            this.updateGame(source.getAttribute("data-position")); // events bubble up the DOM Tree
            this.updateUI(source.getAttribute("data-position"), source);
        }.bind(this); // this now bounded to the this parameter of the outer function
    },

    resetGame: function() {
        for (var i = 0; i <= 8; i += 1) {
            this.boardArr[i] = null; // initialise all square values with null
        }
        this.moves = 0;
        this.gameOver = false;
        this.xTurn = true; // X is first player 
    },

    checkForWinningMove: function() { // check all 8 winning combinations
        // check 3 rows, 3 columns and 2 diagonals
        for (var i = 0; i < this.winCombo.length; i += 1) {
            if (this.boardArr[this.winCombo[i][0]] === this.boardArr[this.winCombo[i][1]] && this.boardArr[this.winCombo[i][1]] 
                === this.boardArr[this.winCombo[i][2]] && this.boardArr[this.winCombo[i][0]] !== null) {
                this.gameOver = true;
                return true;
            }
        }
    },

    updateUI: function(position, element) {
        var square = input.value;
        square = this.boardArr[position];
    }, 
    
    // Updates the model
    updateGame: function(position) {
        var square;
        if (this.boardArr[position] === null && this.gameOver !== true) { // check board is empty and game is not over
            this.moves += 1; // increment game moves
            this.boardArr[position] = this.xTurn ? "X" : "O"; // current move 
            this.xTurn = !this.xTurn; // current game turn
            this.updateUI();
            this.statusElem.innerHTML = "It is the turn of " + (this.xTurn ? "X" : "O"); // current game status
        }
        var outcome = this.checkForWinningMove(); // check if there is a winning move
        if (outcome === true) { // decide who won
            if (this.xTurn === false) { // when X wins, this.Xturn will be false
                alert("X wins");
                this.resetGame(); 
            } else {
                alert("O wins");
                this.resetGame();
            }
        }
    }
};

var playGame = new TicTacToe();
// AI - naive player (randomly)n
// naive computer player
// two in a row - fork try & win
// encode strategies from wiki 
// advanced AI 

