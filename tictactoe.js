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

var TicTacToe = function () { //current function constructor
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
        // (instead of writing var that = this)
        this.boardElem.onclick = function (e) { // current click event handler (e is the event object passed as an arg)
            e = e || event; // event sometimes available through the global variable event (for IE)
            var source = e.boardElem || e.target; // event target is the object which
            // the event is associated
            this.updateModel({ // parse JSON containing position of button clicked & current value
                position: source.getAttribute("data-position"), // events bubble up the DOM Tree
                currentValue: source.value || null // the existing value X or O in our case 
                    //this is important so we do not allow a button to clicked twice
            })
        }.bind(this); // this now bounded to the this parameter of the outer function
    },

    reset: function () {
        for (var i = 0; i <= 8; i += 1) { // null all squares 1 - 9
            this.boardArr[i] = null;
        }
        this.moves = 0;
        this.gameOver = false;
        this.xTurn = true; // player that moves first will be X
    },

    // Updates the model
    updateModel: function(obj) {
        if  (this.boardArr[obj.position] === null && this.gameOver !== true) { // check if each square is empy & game over 
            this.moves += 1;
            this.boardArr[obj.position] = this.xTurn ? "X" : "O"; // ternary operator: test (boolean) and exp 1 if truthy
            // & exp2 if falsy  
            this.xTurn = !this.xTurn; // take turns between X and 0
            this.statusElem.innerHTML = "It is the turn of " + (this.xTurn ? "X" : "O");
        }
        if  (this.boardArr === "")
            this.checkForWinner(); // update checkForWinner() using the boardArr
    },

    checkForWinner: function () { // check all 8 winning combinations in boardArr
        
        // check if there are three Xs or three Os in a row  
        if (arr[1] === arr[2] && arr[2] === arr[3] && arr[1] !== "") {
            this.resultElem.innerHTML = arr[1] + ' wins';
            this.gameOver = true;
            this.statusElem.innerHTML = " ";
            return;
        } /*else if (arr[4] === arr[5] && arr[5] === arr[6] && arr[4] !== "") {
            this.resultElem.innerHTML = arr[4] + ' wins';
            this.gameOver = true;
            this.statusElem.innerHTML = " ";
            return;
        } else if (arr[7] === arr[8] && arr[8] == arr[9] && arr[7] !== "") {
            this.resultElem.innerHTML = arr[7] + ' wins';
            this.gameOver = true;
            this.statusElem.innerHTML = " ";
            return;
        }
        // check if there are three Xs or three Os in a column   
        else if (arr[1] === arr[4] && arr[4] === arr[7] && arr[1] !== "") {
            this.resultElem.innerHTML = arr[1] + ' wins';
            this.gameOver = true;
            this.statusElem.innerHTML = " ";
            return;
        } else if (arr[2] === arr[5] && arr[5] === arr[8] && arr[2] !== "") {
            this.resultElem.innerHTML = arr[2] + ' wins';
            this.gameOver = true;
            this.statusElem.innerHTML = " ";
            return;
        } else if (arr[3] === arr[6] && arr[6] == arr[9] && arr[3] !== "") {
            this.resultElem.innerHTML = arr[3] + ' wins';
            this.gameOver = true;
            this.statusElem.innerHTML = " ";
            return;
        }
        // check if there are three Xs or three Os in a diagonal
        else if (arr[7] === arr[5] && arr[5] === arr[3] && arr[7] !== "") {
            this.resultElem.innerHTML = arr[7] + ' wins';
            this.gameOver = true;
            this.statusElem.innerHTML = " ";
            return;
        } else if (arr[1] === arr[5] && arr[5] === arr[9] && arr[1] !== "") {
            this.resultElem.innerHTML = arr[1] + ' wins';
            this.gameOver = true;
            this.statusElem.innerHTML = " ";
            return;
        } 
        else if (this.moves === 9){
            this.resultElem.innerHTML = "draw";
            this.gameOver = true; 
            return;
        } */
        else {
            this.resultElem.innerHTML = " ";
            return;
        }
    } 
};

var playGame = new TicTacToe(); // new object which inherits from TicTacToe