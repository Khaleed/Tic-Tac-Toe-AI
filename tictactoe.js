/*

Vanilla JavaScript for TicTacToe-AI
Author: Khalid Omar Ali

*/

(function() {

    'use strict';

    var TicTacToe = function() {
        // this keyword refers to the new instance of the class 
        this.init();
    };

    // build a secret object within the constructor
    // function's prototype property
    // every created TicTacToe inherits from that Object
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
                this.boardArr[i] = null;
            }
            for (j = 0; j <= 8; j += 1) {
                this.squares[j].value = "";
            }
            this.moves = 0;
            this.gameOver = false;
            // X is always the first player
            this.xTurn = true;
            this.statusElem.innerHTML = "";
        },

        // initialise game
        init: function() {
            var src;
            this.resetElem = document.getElementById("start-button");
            this.boardElem = document.getElementById("game-board");
            this.resultElem = document.getElementById("results");
            this.statusElem = document.getElementById("status");
            this.squares = document.getElementsByTagName("input");
            this.resetGame();
            // bind main event handlers       
            this.resetElem.onclick = function() {
                this.resetGame();
            }.bind(this);
            this.boardElem.onclick = function(e) {
                // event sometimes available through the global variable event for IE
                e = e || event;
                // event target is the object which the event is associated with
                src = e.boardElem || e.target;
                // pass an object containing the square element
                // and its data-position to renderMove method 
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
            return board[position] === null;
        },

        // check 3 rows, 3 columns and 2 diagonals using winCombo array 
        checkForWinningMove: function() {
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
            if (this.validMoves() === 9) {
                alert("Draw game!");
                this.resetGame();
            }
        },

        won: function(result) {
            result = this.checkForWinningMove();
            if (result === true) {
                if (this.xTurn === false) {
                    alert("X wins!");
                    this.resetGame();
                } else {
                    alert("O wins!");
                    this.resetGame();
                }
            }
        },

        isGameOver: function() {
            return this.won() || this.drawn();
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
            // pick a random number and remove from the number pool
            pickNo = numberpool.splice(randomIndex, 1);
            return pickNo[0];
        },


        aiMove: function(board, randPos) {
            this.moves += 1;
            board[randPos] = "O";
            this.squares[randPos].value = "O";
            this.xTurn = true;
            this.turnStatus();
        },

        // manage conflict between AI and human player
        aiConflict: function(board, randPos) {
            // if there is no space for AI
            var condition = !this.isSquareAvailable(board, randPos);
            while (condition) {
                // generate a new random position
                randPos = this.aiRandomNo();
                // if there is a space available for AI, exit loop
                if (this.isSquareAvailable(board, randPos)) {
                    this.aiMove(board, randPos);
                    condition = false;
                }
            }
        },

        // play a random AI move
        aiRandomPlay: function(board, randPos) {
            // generate random number 
            randPos = this.aiRandomNo();
            // if space is available, play AI move
            if (this.isSquareAvailable(this.boardArr, randPos)) {
                this.aiMove(board, randPos);
            } else {
                // find random position that doesn't conflict with human player
                this.aiConflict(board, randPos);
            }
        },

        // AI method returns an updated board
        ai: function() {
            if (this.aiTurn()) {
                return this.aiRandomPlay(this.boardArr);
            }
        },

        renderMove: function(board, square, squareElem, squarePos) {
            // acess object that hold each square elem clicked and it's position
            squareElem = square.elem;
            squarePos = square.position;
            // stop drawing on a square that's already taken
            if (squareElem.value !== "") {
                return;
            }
            // if it is the turn of the human player 
            // and a square is available and game is not over
            if (this.xTurn !== false && this.isSquareAvailable(board, squarePos) && this.gameOver !== true) {
                this.moves += 1;
                board[squarePos] = "X";
                squareElem.value = board[squarePos];
                this.xTurn = false;
                this.turnStatus();
            }
            // get AI move as long as all squares haven't been taken
            // and there hasn't been a winning move
            if (this.moves !== 9 && !this.checkForWinningMove()) {
                this.ai();
            }
            // check if the game is over
            this.isGameOver();
        }
    };
    // a new instance of the TicTacToe class
    var playGame = new TicTacToe();
})();