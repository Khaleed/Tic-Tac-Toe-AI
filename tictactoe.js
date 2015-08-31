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
                this.boardArr[i] = undefined;
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
            // get main elements
            this.resetElem = document.getElementById("start-button");
            this.boardElem = document.getElementById("game-board");
            this.resultElem = document.getElementById("results");
            this.statusElem = document.getElementById("status");
            this.squares = document.getElementsByTagName("input");
            this.resetGame();
            // bind main event handlers       
            this.resetElem.onclick = function() {
                this.resetGame();
            }.bind(this); // inner function has access to the this value of the outer function
            this.boardElem.onclick = function(e) {
                var src;
                // event sometimes available through the global variable event for IE
                e = e || event;
                // event target is the object which the event is associated with
                src = e.boardElem || e.target;
                // pass boardArr and object containing the square element
                // and its data-position to renderAllMoves method 
                this.renderAllMoves(this.boardArr, {
                    position: src.getAttribute("data-position"),
                    elem: src
                });
            }.bind(this);
        },

        turnStatus: function() {
            this.statusElem.innerHTML = "It's the turn of " + (this.xTurn ? "X" : "O");
        },

        isSquareAvailable: function(board, position) {
            return board[position] === undefined;
        },

        // check 3 rows, 3 columns and 2 diagonals using winCombo array 
        checkForWinningMove: function(board) {
            var i;
            for (i = 0; i < this.winCombo.length; i += 1) {
                if (board[this.winCombo[i][0]] === board[this.winCombo[i][1]] && board[this.winCombo[i][1]] ===
                    board[this.winCombo[i][2]] && board[this.winCombo[i][1]] !== undefined) {
                    return true;
                }
            }
        },
        
        // check first and second value in a row
        checkFirstAndSecondInArow: function(board, position) {
            var i;
            // iterate through all winning combinations
            for (i = 0; i < this.winCombo.length; i += 1) {
                // check if the values in first and second positions of the board match and third position is free
                if (board[this.winCombo[i][0]] === board[this.winCombo[i][1]] && board[this.winCombo[i][1]] !==
                    undefined && board[this.winCombo[i][2]] === undefined) {
                    this.aiBlockTwoInArow(board, this.winCombo[i][2]);
                    return true;
                }
            }
        },
        
        // check second and third value in a row
        checkSecondAndThirdInArow: function(board, position) {
            var i;
            // iterate through all winning combinations
            for (i = 0; i < this.winCombo.length; i += 1) {
                // check if the values in first and second positions of the board match and third position is free
                if (board[this.winCombo[i][1]] === board[this.winCombo[i][2]] && board[this.winCombo[i][2]] !==
                    undefined && board[this.winCombo[i][0]] === undefined) {
                    this.aiBlockTwoInArow(board, this.winCombo[i][0]);
                    return true;
                }
            }
        },

        twoInArow: function(board, position) {
            return this.checkFirstAndSecondInArow(board, position) || this.checkSecondAndThirdInArow(board, position);
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

        won: function() {
            var result = this.checkForWinningMove(this.boardArr);
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
                // generate random index between 0 and 8
                randomIndex = Math.floor(Math.random() * numberpool.length),
                pickNo;
            if (numberpool.length === 0) {
                throw "no random numbers left";
            }
            // pick a random number and remove from the number pool
            pickNo = numberpool.splice(randomIndex, 1);
            return pickNo[0];
        },

        renderAiMove: function(board, position) {
            this.moves += 1;
            board[position] = "O";
            this.squares[position].value = "O";
            this.xTurn = true;
            this.turnStatus();
        },

        renderHumanMove: function(board, position, squareElem) {
            // if it is the turn of the human player 
            // and a square is available and game is not over
            this.moves += 1;
            board[position] = "X";
            squareElem.value = board[position];
            this.xTurn = false;
            this.turnStatus();
        },

        // manage conflict between AI and human player
        aiConflict: function(board, randPos) {
            // if there is no space on board for AI
            // based on the initial random position
            var condition = !this.isSquareAvailable(board, randPos);
            while (condition) {
                // generate a new random position
                randPos = this.aiRandomNo();
                // if there is a space available for AI with 
                // the new random position, exit loop
                if (this.isSquareAvailable(board, randPos)) {
                    this.renderAiMove(board, randPos);
                    condition = false;
                }
            }
        },

        // play a random AI move
        aiRandomMove: function(board, randPos) {
            // generate random number 
            randPos = this.aiRandomNo();
            // if space is available, play AI move
            if (this.isSquareAvailable(board, randPos)) {
                return this.renderAiMove(board, randPos);
            } else {
                // find random position that doesn't conflict with human player
                this.aiConflict(board, randPos);
            }
        },

        aiBlockTwoInArow: function(board, position) {
            if (this.isSquareAvailable(board, position)) {
                return this.renderAiMove(board, position);
            }
        },

        // returns an updated board when AI moves are made
        ai: function() {
            // if it is the turn of AI and there is no two in a row move by hunan player
            if (this.aiTurn() && this.twoInArow() !== true) {
                // just play randomly
                return this.aiRandomMove(this.boardArr);
            } else {
                // block two in a row
                return this.aiBlockTwoInArow(this.boardArr);
            }
        },
        // render human and AI moves on the board
        renderAllMoves: function(board, squareObj) {
            // acess object that holds each square elem clicked and it's position
            var squareElem = squareObj.elem,
                squarePos = squareObj.position;
            // stop drawing on a square that's already taken
            if (squareElem.value !== "") {
                return;
            } // draw human player's move
            if (this.xTurn !== false && this.isSquareAvailable(board, squarePos) && this.gameOver !== true) {
                this.renderHumanMove(board, squarePos, squareElem);
            }
            // get AI move as long as all squares haven't been taken
            // and there hasn't been a winning move
            if (this.moves !== 9 && !this.checkForWinningMove(board)) {
                this.ai();
            }
            // check if the game is over and show the game result
            this.isGameOver();
        }
    };
    // a new instance of the TicTacToe class
    var myTicTacToe = new TicTacToe();
})();