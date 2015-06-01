/*
Vanilla JavaScript for TicTacToe-AI
Author: Khalid Omar Ali
*/

(function() {

    'use strict';

    // var socket = io.connect("http://localhost:3000");
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
    TicTacToe.prototype = {
        // set initial game state
        boardElem: null,
        resetElem: null,
        resultElem: null,
        statusElem: null,
        moves: 0,
        xTurn: true,
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

        resetGame: function() {
            var elem, i, j;
            for (i = 0; i <= 8; i += 1) {
                this.boardArr[i] = null; // set all values of board array to null
            }
            for (j = 0; j <= 8; j += 1) {
                this.squares[j].value = ""; // clear the board UI
            }
            this.moves = 0; // current move incrementor
            this.gameOver = false;
            this.xTurn = true; // X is first player
            this.statusElem.innerHTML = "";
        },
        // initialise game
        init: function() {
            // get elements
            var src;
            this.resetElem = document.getElementById("start-button");
            this.boardElem = document.getElementById("game-board");
            this.resultElem = document.getElementById("results");
            this.statusElem = document.getElementById("status");
            this.squares = document.getElementsByTagName("input");
            // reset game when first started
            this.resetGame();
            // bind main event handlers to reset game and click board        
            this.resetElem.onclick = function() {
                this.resetGame(); 
            }.bind(this); // inner function's this now bounded to the this variable of the outer function 
            // use bind method instead of writing var that = this
            this.boardElem.onclick = function(e) { 
                // event sometimes available through the global variable event for IE
                e = e || event; 
                // event target is the object which the event is associated with
                src = e.boardElem || e.target;
                // pass an object containing the element and its data-position to renderMove method 
                this.renderMove(this.boardArr, { 
                    position: src.getAttribute("data-position"),
                    elem: src
                });
            }.bind(this);
        },

        turnStatus: function() {
            this.statusElem.innerHTML = "It's the turn of " + (this.xTurn ? "X" : "O");
        },

        isSquareAvailable: function(board, position) {
            return board[position] === null; // returns true if space is available
        },

        checkForWinningMove: function() { // check 3 rows, 3 columns and 2 diagonals using winCombo array that holds all winning combinations of the game
            var i;
            for (i = 0; i < this.winCombo.length; i += 1) {
                if (this.boardArr[this.winCombo[i][0]] === this.boardArr[this.winCombo[i][1]] && this.boardArr[this.winCombo[i][1]] ===
                    this.boardArr[this.winCombo[i][2]] && this.boardArr[this.winCombo[i][1]] !== null) {
                    return true;
                }
            }
        },

        validMoves: function() {
            if (this.moves === 9) {
                return this.moves;
            }
        },

        drawn: function() {
            // indices begin at 0
            if (this.validMoves() === 9) {
                alert("Draw game!");
                this.resetGame();
            }
        },

        won: function(result) {
            result = this.checkForWinningMove();
            if (result === true) { // if there is a winner
                if (this.xTurn === false) { // decide if X won or else O won
                    alert("X wins!");
                    this.resetGame();
                } else {
                    alert("O wins!");
                    this.resetGame();
                }
            }
        },

        isGameOver: function() {
            return this.won() || this.drawn(); // decide the game's outcome
        },

        // condition for the AI turn
        aiTurn: function() {
            return this.xTurn === false && this.gameOver === false;
        },

        // unique random number generator for naive AI
        aiRandomNo: function() {
            var numberpool = [0, 1, 2, 3, 4, 5, 6, 7, 8],
                randomIndex = Math.floor(Math.random() * 9),
                pickNo;
            if (numberpool.length === 0) {
                throw "no random numbers left";
            }
            // pic a random number and remove from the pool
            pickNo = numberpool.splice(randomIndex, 1);
            return pickNo[0];
        },

        aiMove: function (board, randPos) {
            this.moves += 1;
            board[randPos] = "O";
            this.squares[randPos].value = "O";
            this.xTurn = true;
            this.turnStatus();
        },

        // dealing with conflict between naive AI and Human player
        aiConflict: function(board, randPos) {
            // if there is no space for AI
            var condition = !this.isSquareAvailable(board, randPos);
            while(condition) {
                // generate a new random position
                randPos = this.aiRandomNo();
                // if there is a space available for AI, exit loop
                if(this.isSquareAvailable(board, randPos)) {
                    this.aiMove(board, randPos);
                    condition = false;
                } 
            } 
        },
        // AI render's move
        aiRandomPlay: function(board, randPos) {
            // play random move by generating random numbers and checking space is available!
            randPos = this.aiRandomNo();
                // if space is available, play AI move
                if (this.isSquareAvailable(this.boardArr, randPos)) {
                    this.aiMove(board, randPos); 
                } else {
                    // find random position that doesn't conficlt with human player
                    this.aiConflict(board, randPos);
                }
        },
        // AI method returns an updated board
        ai: function() {
            if (this.aiTurn()) {
                return this.aiRandomPlay(this.boardArr);
            }
        },
        // actual game play
        renderMove: function(board, square, squareElem, squarePos) {
            // acess object that hold each square elem clicked and it's position
            squareElem = square.elem;
            squarePos = square.position;
            // stop drawing on a square that's already taken
            if (squareElem.value !== "") {
                return;
            }
            // if it is the turn of the player and a square is available and game is not over
            if (this.xTurn !== false && this.isSquareAvailable(board, squarePos) && 
                this.gameOver !== true) {
                this.moves += 1;
                board[squarePos] = "X";
                squareElem.value = board[squarePos];
                this.xTurn = false;
                this.turnStatus();
            }
            // get AI move as long as all squares haven't been taken
            // and there hasn't been a winning move
            if(this.moves !== 9 && !this.checkForWinningMove()) {
                this.ai();   
            }
            // check if the game is over
            this.isGameOver();
        }
    };
    var playGame = new TicTacToe();
})();