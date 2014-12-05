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
var GameBoard = function() { // current function constructor 
    this.init(); // constructor invocation method - this bound to the new object 
};
// this is the prototype object associated with the above function constructor 
GameBoard.prototype = { // give all instances of TicTacToe class the following methods and values
    // every object linked to the prototype object which they inherit properties from
    // the prototype object is where inherited methods and values are deposited
    boardElem: null, // empty elements by setting them to null
    resetElem: null,
    resultElem: null,
    statusElem: null,
    moves: 0,
    xTurn: true, // there are two players X and O & X makes a move first and X is the human player
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
            this.renderMove(this.boardArr, { // pass an object containing the element and its data-position to updateGame method
                position: source.getAttribute("data-position"),
                element: source
            });
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

    validMovesIndices: function(board) { // check square is free from the player's perspective
        var moves = [];
        for (var i = 0; i < 9; i += 1) {
            if (board[i] === null) {
                moves.push(i);
            }
            return moves;
            console.log("the number of moves is ", moves); // indices of valid moves
        }
    },

    isSquareAvailable: function(board, position) {
        return board[position] === null; // returns true if space is available
    },

    checkForWinningMove: function() { // check all 8 winning combinations
        // check 3 rows, 3 columns and 2 diagonals using winCombo array that holds all winning combinations of the game
        var i;
        for (i = 0; i < this.winCombo.length; i += 1) {
            if (this.boardArr[this.winCombo[i][0]] === this.boardArr[this.winCombo[i][1]] && this.boardArr[this.winCombo[i][1]] === this.boardArr[this.winCombo[i][2]] && this.boardArr[this.winCombo[i][1]] !== null) {
                return true;
            }
        }
    },

    drawn: function() {
        if (this.moves === 9) {
            alert("Draw game!");
        }
        console.log("is the number of moves === 9", this.moves === 9);
    },

    won: function(result) {
        result = this.checkForWinningMove();
        if (result === true) { // if there is a winner
            if (this.xTurn === false) { // decide if X won or else O won
                alert("X wins!");
            } else {
                alert("O wins!");
            }
        }
    },

    renderMove: function(board, playerClick, square, squarePosition) { // player clicks the squares
        square = playerClick.element;
        squarePosition = playerClick.position;
        if (this.isSquareAvailable(board, squarePosition) && this.xTurn && this.gameOver !== true) { // check board array is null and game isn't over
            console.log("is there a free square", board[squarePosition] === null); // should be a function?
            this.moves += 1; // increment game move
            console.log("number of moves is ", this.moves); 
            board[squarePosition] = "X"; // human's player current move
            console.log("new board state when the human clicks square", this.boardArr); // return a new boardstate
            this.xTurn = false;
            console.log("is it the turn of X?", this.xTurn);
            square.value = board[squarePosition]; // udpate UI Once a human player makes a move
            console.log("update UI for human player", square.value);
            this.statusElem.innerHTML = "It's the turn of " + (this.xTurn ? "X" : "O"); // current game status
            this.computerTurn = true;
            console.log("is it human's turn", this.computerTurn === false);
        }
        this.ai(); // get the AI moves
        return this.won() || this.drawn(); // decide the game's outcome
    },

    aiRandNo: function() { // unique random number generator for naiveAI
        var numberPool = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // pool of random numbers to pick from 
        if (numberPool.length === 0) {
            throw "no random numbers left"; // throw statement throws a user-defined exception. Execution of the current function will stop 
            // (the statements after throw won't be executed), and control will be passed to the first catch block in the call stack 
            // If no catch block exists among caller functions, the program will terminate
        }
        var index = Math.floor(Math.random() * 9); // random nos of 0 - 8 to represent the board positions
        var pickNo = numberPool.splice(index, 1); // splice method to remove random number picked
        return pickNo[0];
    },

    aiTurn: function () {
        return this.xTurn === false && this.gameOver === false;
    },

    playRandom: function(board, randIndex) {
        // play random move by generating random numbers and checking space is available!
        var condition = this.aiTurn(); // true if it's the computer's turn
        randIndex = this.aiRandNo(); // random number generator
        console.log("first random number is ", randIndex);
        square = document.getElementsByTagName("input"); // get UI for AI move 
        // since I don't know the number of times I have to loop, used a while loop
        while (condition) { // if the condition is true, the statement is executed, condition keeps getting evaluated until it becomes false 
            if (this.isSquareAvailable(this.boardArr, randIndex)) { // check if a square is available for the computer 
                console.log("condition is", condition);
                console.log("is space free to click", this.isSquareAvailable(this.boardArr, randIndex));
                this.moves += 1;
                console.log("moves number is", this.moves);
                board[randIndex] = "O"; // computer plays
                console.log("new board state after computer plays a random move", board[randIndex]);
                square[randIndex].value = board[randIndex]; // update UI after computer plays a move
                console.log("update the board with computer UI: ", square[randIndex].value);
                this.xTurn = true; // player's next move
            } else {
                randIndex = this.aiRandNo(); // pull another random number out of the pool if there is no space available
                console.log("if there is a conflict, the new random computer no is", this.aiRandNo());
            }
            condition = false; // the statements keep getting executed until the condition becomes false 
            console.log("break out of loop when condition is", condition);
        }
    },
    // naiveAI method takes into account the current board state using this.boardArr and returns an update board
    ai: function() {
        this.playRandom(this.boardArr);
    }
};

var board = new GameBoard(board); // create a new instance of the GameBoard