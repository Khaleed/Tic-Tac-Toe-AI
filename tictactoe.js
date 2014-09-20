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
      this.init(); // ?? ask Eftar
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
            this.updateModel({ // parse JSON containing position of button clicked & current value
                position: source.getAttribute("data-position"), // events bubble up the DOM Tree
                currentValue: source.value || null // the existing value X or O in our case 
            })
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
    updateModel: function(obj) {
        if  (this.boardArr[obj.position] === null && this.gameOver !== true) { // check if each square is empy 
        // & game over 
            this.moves += 1;
            this.boardArr[obj.position] = this.xTurn ? "X" : "O"; // ternary operator: test (boolean) and 
            // exp 1 if truthy & exp2 if falsy  
            this.xTurn = !this.xTurn; // enable taking turns between X and O
            this.statusElem.innerHTML = "It is the turn of " + (this.xTurn ? "X" : "O");
        } // need to stop updating model once all squares have been filled
        this.checkForWinningMove();  
    },

    checkForWinningMove: function () { // check all 8 winning combinations in boardArr
        var winningCombo = [[0, 1, 2], [3, 4, 5], [6, 7, 8],   // all winning combos nested arrays
                            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
                            [0, 4, 8], [2, 4, 6]
        ];
        // check if there is three Xs or Os in a row 
        if (this.boardArr[0] === this.boardArr[1] && this.boardArr[1] === this.boardArr[2] && this.boardArr[0] !== null) {
            return true;
            alert(this.boardArr[0] + " wins"); 
        } else if (this.boardArr[3] === this.boardArr[4] && this.boardArr[4] === this.boardArr[5] && this.boardArr[3] !== null) {
            return true;
            alert(this.boardArr[3] + " wins"); 
        } else if (this.boardArr[6] === this.boardArr[7] && this.boardArr[7] === this.boardArr[8] && this.boardArr[6] !== null) {
           return true;
           alert(this.boardArr[6] + " wins");
        // check if there is three Xs or Os in a column 
        } else if (this.boardArr[0] === this.boardArr[3] && this.boardArr[3] === this.boardArr[6] && this.boardArr[0] !== null) {
            return true;
            alert(this.boardArr[0] + " wins"); 
        } else if (this.boardArr[1] === this.boardArr[4] && this.boardArr[4] === this.boardArr[7] && this.boardArr[1] !== null) {
            return true;
            alert(this.boardArr[1] + " wins"); 
        } else if (this.boardArr[2] === this.boardArr[5] && this.boardArr[5] === this.boardArr[8] && this.boardArr[2] !== null) {
            return true;
            alert(this.boardArr[2] + " wins"); 
        // check if there is three Xs or Os in a diagonal
        } else if (this.boardArr[0] === this.boardArr[4] && this.boardArr[4] === this.boardArr[8] && this.boardArr[0] !== null) {
            return true;
            alert(this.boardArr[0] + " wins"); 
        } else if (this.boardArr[2] === this.boardArr[4] && this.boardArr[4] === this.boardArr[6] && this.boardArr[2] !== null) {
            return true;
            alert(this.boardArr[2] + " wins"); 
        }
        return false;
        alert("draw");
    } 
};

var playGame = new TicTacToe(); // new object which inherits from TicTacToe