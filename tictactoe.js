if(!String.prototype.supplant) { // credit to Crockford for this supplant function
    String.prototype.supplant = function(o) {
        return this.replace(
            /\{([^{}]*)\}/g,
            function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };
}

if (!Function.prototype.bind) { // credit to Crockford for this bind function  
    Function.prototype.bind = function(oThis) {
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

        return fBound;
    };
}

var TicTacToe = function () { // current function constructor 
      this.init(); // executed 
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
    winningCombo: [
        
        [0, 1, 2], [3, 4, 5], [6, 7, 8],   // all winning combos nested arrays
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]        
        
        ],

    init: function () { // first function associated with the prototype 
        // bind UI
        this.resetElem = document.getElementById("reset-button");
        this.boardElem = document.getElementById("game-board");
        this.resultElem = document.getElementById("results");
        this.statusElem = document.getElementById("status");
        this.reset();
        // current binded events on clicking reset and gameboard
        this.resetElem.onclick = function () {
            this.reset();
        }.bind(this); // this now bounded to the this parameter of the outer function 
        // (bind() instead of writing var that = this)
        this.boardElem.onclick = function (e) { // current click event handler (e is the event object passed as an arg)
            e = e || event; // event sometimes available through the global variable event (for IE)
            var source = e.boardElem || e.target; // event target is the object which
            // the event is associated
            this.updateModel(source.getAttribute("data-position")); // events bubble up the DOM Tree
        }.bind(this); // this now bounded to the this parameter of the outer function
    },

    reset: function () {
        // each time game is reseted, re-start values 
        for (var i = 0; i <= 8; i += 1) { // null all squares 1 - 9
            this.boardArr[i] = null;
        }
        this.moves = 0;
        this.gameOver = false;
        this.xTurn = true; // player that moves first will be X
    },

    // Updates the model
    updateModel: function(position) {
        if  (this.boardArr[position] === null && this.gameOver !== true) {
        // & game over 
            this.moves += 1;
            this.boardArr[position] =   this.xTurn ? "X" : "O"; // ternary operator: test (boolean) and 
            // exp 1 if truthy & exp2 if falsy  
            this.xTurn = !this.xTurn; // enable taking turns between X and O
            this.statusElem.innerHTML = "It is the turn of " + (this.xTurn ? "X" : "O");
        } // need to stop updating model once all squares have been filled
        var outcome = this.checkForWinningMove();
        if (outcome === true) {
            if (this.xTurn) {
            alert("X wins");    
            } 
            else {
            alert("O wins");
            }
        }  
    },

    checkForWinningMove: function () { // check all 8 winning combinations in boardArr

        var winningCombo = [[0, 1, 2], [3, 4, 5], [6, 7, 8],   // all winning combos in nested arrays
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        // check row 1 
        if (this.boardArr[this.winningCombo[0][0]] === this.boardArr[this.winningCombo[0][1]] && this.boardArr[this.winningCombo[0][1]] === this.boardArr[this.winningCombo[0][2]] && this.boardArr[0] !== null) {
            this.gameOver = true;
            return true;
         }
        // check row 2 
        if (this.boardArr[this.winningCombo[1][0]] === this.boardArr[this.winningCombo[1][1]] && this.boardArr[this.winningCombo[1][1]] === this.boardArr[this.winningCombo[1][2]]&& this.boardArr[this.winningCombo[1][0]] !== null) {
            this.gameOver = true;
            return true;
         }
        // check row 3 
        if (this.boardArr[this.winningCombo[2][0]] === this.boardArr[this.winningCombo[2][1]] && this.boardArr[this.winningCombo[2][1]] === this.boardArr[this.winningCombo[2][2]]&& this.boardArr[this.winningCombo[2][0]] !== null) {
            this.gameOver = true;
            return true;
         }
         // check column 1 
        if (this.boardArr[this.winningCombo[3][0]] === this.boardArr[this.winningCombo[3][1]] && this.boardArr[this.winningCombo[3][1]] === this.boardArr[this.winningCombo[3][2]]&& this.boardArr[this.winningCombo[3][0]] !== null) {
            this.gameOver = true;
            return true;
         }
         // check column 2
         if (this.boardArr[this.winningCombo[4][0]] === this.boardArr[this.winningCombo[4][1]] && this.boardArr[this.winningCombo[4][1]] === this.boardArr[this.winningCombo[4][2]]&& this.boardArr[this.winningCombo[4][0]] !== null) {
            this.gameOver = true;
            return true;
         }
         // check column 3
         if (this.boardArr[this.winningCombo[5][0]] === this.boardArr[this.winningCombo[5][1]] && this.boardArr[this.winningCombo[5][1]] === this.boardArr[this.winningCombo[5][2]]&& this.boardArr[this.winningCombo[5][0]] !== null) {
            this.gameOver = true;
            return true;
         }
         // check diagonal 1
         if (this.boardArr[this.winningCombo[6][0]] === this.boardArr[this.winningCombo[6][1]] && this.boardArr[this.winningCombo[6][1]] === this.boardArr[this.winningCombo[6][2]]&& this.boardArr[this.winningCombo[6][0]] !== null) {
            this.gameOver = true;
            return true;
         }
         // check diagonal 2
         if (this.boardArr[this.winningCombo[7][0]] === this.boardArr[this.winningCombo[7][1]] && this.boardArr[this.winningCombo[7][1]] === this.boardArr[this.winningCombo[7][2]]&& this.boardArr[this.winningCombo[7][0]] !== null) {
            this.gameOver = true;
            return true;
         }
         return false;
         alert("no winner"); 
    }
};

var playGame = new TicTacToe(); // new object which inherits from TicTacToe