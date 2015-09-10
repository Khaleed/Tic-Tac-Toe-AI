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
        statusElem: undefined,
        moves: 0,
        xTurn: true,
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
            // X is always the first player
            this.xTurn = true;
            this.statusElem.innerHTML = "It's the turn of X";
        },

        // initialise game
        init: function() {
            // get main elements
            var resetElem = document.getElementById("start-button");
            this.boardElem = document.getElementById("game-board");
            this.statusElem = document.getElementById("status");
            this.squares = document.getElementsByTagName("input");
            this.resetGame();
            // bind main event handlers       
            resetElem.onclick = function() {
                this.resetGame();
            }.bind(this); // inner function has access to the this value of the outer function
            this.boardElem.onclick = function(e) {
                var src;
                // event sometimes available through the global variable event for IE
                e = e || event;
                // event target is the object which the event is associated with
                src = e.boardElem || e.target;
                // pass boardArr and object containing the square element and its' position
                this.updateGame({
                    pos: src.getAttribute("data-position"),
                    elem: src
                });
            }.bind(this);
        },

        turnStatus: function() {
            this.statusElem.innerHTML = "It's the turn of " + (this.xTurn ? "X" : "O");
        },

        isSquareAvailable: function(pos) {
            return this.boardArr[pos] === undefined;
        },

        // check 3 rows, 3 columns and 2 diagonals, using winCombo array that holds all winning permutations 
        checkForWinningMove: function() {
            var i;
            for (i = 0; i < this.winCombo.length; i += 1) {
                if (this.boardArr[this.winCombo[i][0]] === this.boardArr[this.winCombo[i][1]] && this.boardArr[this.winCombo[i][1]] ===
                    this.boardArr[this.winCombo[i][2]] && this.boardArr[this.winCombo[i][1]] !== undefined) {
                    return true;
                }
            }
        },

        // check if first and second positions have the same value
        aiCheckFirstAndSecondInRow: function() {
            var i;
            for (i = 0; i < this.winCombo.length; i += 1) {
                if (this.xTurn !== true && this.boardArr[this.winCombo[i][0]] === this.boardArr[this.winCombo[i][1]] && this.boardArr[this.winCombo[i][1]] !== undefined &&
                    this.boardArr[this.winCombo[i][2]] === undefined) {
                    this.aiBlockTwoInRow(this.winCombo[i][2]);
                    return true;
                }
            }
        },

        // check second and third positions have the same value
        aiCheckSecondAndThirdInRow: function() {
            var i;
            for (i = 0; i < this.winCombo.length; i += 1) {
                if (this.xTurn !== true && this.boardArr[this.winCombo[i][1]] === this.boardArr[this.winCombo[i][2]] && this.boardArr[this.winCombo[i][2]] !== undefined &&
                    this.boardArr[this.winCombo[i][0]] === undefined) {
                    this.aiBlockTwoInRow(this.winCombo[i][0]);
                    return true;
                }
            }
        },

        aiCheckTwoInRow: function() {
            return this.aiCheckFirstAndSecondInRow() || this.aiCheckSecondAndThirdInRow();
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
            var result = this.checkForWinningMove();
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

        incMove: function() {
            this.moves += 1
            this.turnStatus();
        },

        renderHumanMove: function(square) {
            this.boardArr[square.pos] = "X";
            square.elem.value = this.boardArr[square.pos];
            this.xTurn = false;
            this.incMove();
        },

        renderAiMove: function(pos) {
            console.log("position is now at " + pos);
            this.boardArr[pos] = "O";
            this.squares[pos].value = this.boardArr[pos];
            this.xTurn = true;
            this.incMove();
        },

        aiTurn: function() {
            return this.xTurn !== true && this.moves !== 9 && !this.checkForWinningMove();
        },

        getRandPos: function() {
            return Math.floor(Math.random() * 9);
        },

        getValidAiRandPos: function() {
            var randPos = this.getRandPos();
            while (!this.isSquareAvailable(randPos) && this.moves !== 9) {
                randPos = this.getRandPos();
            }
            return randPos;
        },

        aiRandomMove: function(randPos) {
            randPos = this.getValidAiRandPos();
            this.renderAiMove(randPos);
        },

        aiBlockTwoInRow: function(blockPos) {
            if (this.isSquareAvailable(blockPos)) {
                console.log("blockPos to check if a free square is available is: " + blockPos);
                this.renderAiMove(blockPos);
            }
        },

        ai: function() {
            // if it is the turn of AI and the opponent hasn't got two in a row 
            if (this.aiTurn() && this.aiCheckTwoInRow() !== true) {
                // just make a random move to a free spot
                this.aiRandomMove();
            }
        },

        // render player 1 and 2 moves
        updateGame: function(square) {
            // stop drawing on a square that's already taken
            if (square.elem.value !== "") {
                return;
            }
            // if it is the turn of first player and a square is free and game is not over
            if (this.xTurn === true && this.isSquareAvailable(square.pos)) {
                this.renderHumanMove(square);
                this.ai();
            }
            // check if the game is over and show the game result
            if (this.moves >= 5) {
                this.isGameOver();
            }
        }
    };
    // a new instance of the TicTacToe class
    var myTicTacToe = new TicTacToe();
})();