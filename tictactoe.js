/*  

Vanilla JavaScript for TicTacToe-AI
Author: Khalid Omar Ali

*/

(function() {

    'use strict';

    var TicTacToe = function() {
        // this keyword refers to the new instance of the class 
        // in strict mode, this refers to whatever it is assigned to it during function initialisation
        this.init();
    };
    // every new instance of TicTacToe class inherits from the constructor's prototype obj
    TicTacToe.prototype = {
        // set initial game state
        boardElem: undefined,
        resetElem: undefined,
        resultElem: undefined,
        statusElem: undefined,
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
            // empty board
            for (i = 0; i <= 8; i += 1) {
                this.boardArr[i] = undefined;
            }
            // empty squares
            for (j = 0; j <= 8; j += 1) {
                this.squares[j].value = "";
            }
            this.moves = 0;
            this.gameOver = false;
            // X is always the first player
            this.xTurn = true;
            this.statusElem.innerHTML = "It's the turn of X";
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
                // pass boardArr and object containing the square element and its' position
                this.renderAllMoves(this.boardArr, {
                    pos: src.getAttribute("data-position"),
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

        // check 3 rows, 3 columns and 2 diagonals, using winCombo array that holds all winning permutations 
        checkForWinningMove: function(board) {
            var i;
            for (i = 0; i < this.winCombo.length; i += 1) {
                if (board[this.winCombo[i][0]] === board[this.winCombo[i][1]] && board[this.winCombo[i][1]] ===
                    board[this.winCombo[i][2]] && board[this.winCombo[i][1]] !== undefined) {
                    return true;
                }
            }
        },

        // check if first and second positions have the same value
        checkFirstAndSecondInRow: function(board) {
            var i;
            for (i = 0; i < this.winCombo.length; i += 1) {
                if (this.xTurn !== true && board[this.winCombo[i][0]] === board[this.winCombo[i][1]] && board[this.winCombo[i][1]] !== undefined &&
                    board[this.winCombo[i][2]] === undefined) {
                    // pass the empty 3rd position 
                    this.aiBlockTwoInRow(board, this.winCombo[i][2]);
                    return true;
                }
            }
        },

        // check second and third positions have the same value
        checkSecondAndThirdInRow: function(board) {
            var i;
            for (i = 0; i < this.winCombo.length; i += 1) {
                if (this.xTurn !== true && board[this.winCombo[i][1]] === board[this.winCombo[i][2]] && board[this.winCombo[i][2]] !== undefined &&
                    board[this.winCombo[i][0]] === undefined) {
                    // pass the empty 3rd position when square is free
                    this.aiBlockTwoInRow(board, this.winCombo[i][0]);
                    return true;
                }
            }
        },

        twoInRow: function(board) {
            return this.checkFirstAndSecondInRow(board) || this.checkSecondAndThirdInRow(board);
        },

        getValidMoves: function() {
            if (this.moves === 9) {
                return this.moves;
            }
        },

        drawn: function() {
            if (this.getValidMoves() === 9) {
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

        renderPlayer1Move: function(board, square) {
            this.moves += 1;
            board[square.pos] = "X";
            square.elem.value = board[square.pos];
            this.xTurn = false;
            this.turnStatus();
        },

        renderAiMove: function(board, pos) {
            console.log("position is now at " + pos);
            this.moves += 1;
            board[pos] = "O";
            this.squares[pos].value = board[pos];
            this.xTurn = true;
            this.turnStatus();
        },

        aiTurn: function() {
            return this.xTurn !== true && this.gameOver !== true;
        },

        getRandomPos: function() {
            var posList = [0, 1, 2, 3, 4, 5, 6, 7, 8];
            var randIndex = Math.floor(Math.random() * posList.length);
            var selectPos;
            if (posList.length === 0) {
                console.log("No random positions left");
            } else {
                // splice is a built-in mutator method
                selectPos = posList.splice(randIndex, 1);
            }
            return selectPos[0];
        },

        aiConflictManager: function(board, randPos) {
            console.log("original randPos is: " + randPos);
            var condition = !this.isSquareAvailable(board, randPos);;
            // keep looping while a square is not available
            while (condition) {
                randPos = this.getRandomPos();
                // as soon as square is available, exit loop
                condition = this.isSquareAvailable(board, randPos);
                console.log("after conflict is managed, new randPos passed to render Ai is " + randPos);
            }
        },

        aiRandomMove: function(board, randPos) {
            randPos = this.getRandomPos();
            if (this.isSquareAvailable(board, randPos)) {
                console.log("randPos when isSquareAvailable is called is " + randPos);
                return this.renderAiMove(board, randPos);
            } else {
                return this.aiConflictManager(board, randPos);
            }
        },

        aiBlockTwoInRow: function(board, blockPos) {
            console.log("position to block is now: " + blockPos);
            if (this.isSquareAvailable(board, blockPos)) {
                console.log("blockPos to check if a free square is available is: " + blockPos);
                this.renderAiMove(board, blockPos);
            }
        },

        ai: function(board) {
            // if it is the turn of AI and there are no two same values in a row 
            if (this.aiTurn() && this.twoInRow(board) !== true) {
                // make a random move to a free spot
                return this.aiRandomMove(board);
            }
        },

        // render player 1 and 2 moves
        renderAllMoves: function(board, square) {
            // stop drawing on a square that's already taken
            if (square.elem.value !== "") {
                return;
            }
            // if it is the turn of first player and a square is free and game is not over
            if (this.xTurn !== false && this.isSquareAvailable(board, square.pos) && this.gameOver !== true) {
                this.renderPlayer1Move(board, square);
            }
            if (!this.getValidMoves() && !this.checkForWinningMove(board)) {
                this.ai(board);
            }
            // check if the game is over and show the game result
            this.isGameOver();
        }
    };
    // a new instance of the TicTacToe class
    var myTicTacToe = new TicTacToe();
})();








