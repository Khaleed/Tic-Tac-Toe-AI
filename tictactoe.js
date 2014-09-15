if (!String.prototype.supplant) { // credit to Crockford for this supplant function
    String.prototype.supplant = function(o) {
        return this.replace(
            /\{([^{}]*)\}/g,
            function(a, b) {
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
            fNOP = function() {},
            fBound = function() {
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

Array.matrix = function (m, n, initial) { // credit to Crockford for this matrix function 
  var a, i, j, mat = []; // current private variables
  for (i = 0; i < m; i += 1) { // loop through the number of m rows
    a = []; // create second empty array called a for columns
    for (j = 0; j < n; j += 1) { // loop through number of n columns
      a[j] = 0; // initialise column array (index = j counter variable)
    }
    mat[i] = a; // add a array into mat array to create matrix 
  }
  return mat; //return mat array 
};


var TicTacToe = function() { //current function constructor
    this.init();
};

TicTacToe.prototype = { // give all instances of TicTacToe the following methods and values
    // every object linked to the prototype object which they inherit properties from
    boardElem: null, // empty elements by setting them to null 
    resultElem: null,
    statusElem: null,
    xTurn: true,
    gameOver: false,
    moves: 0,

    init: function() {
        // bind UI
        this.resetElem = document.getElementById("reset-button");
        this.boardElem = document.getElementById("game-board");
        this.resultElem = document.getElementById("results");
        this.statusElem = document.getElementById("status");
        
        this.sq1 = document.getElementById("btn1").value;
        this.sq2 = document.getElementById("btn2").value;
        this.sq3 = document.getElementById("btn3").value;
        this.sq4 = document.getElementById("btn4").value;
        this.sq1 = document.getElementById("btn5").value;
        this.sq6 = document.getElementById("btn6").value;
        this.sq7 = document.getElementById("btn7").value;
        this.sq8 = document.getElementById("btn8").value;
        this.sq9 = document.getElementById("btn9").value;

        // current binded events on starbutton and game board
        
        this.resetElem.onclick = function() {
            this.reset();
        }.bind(this); // this now bounded to the this parameter of the outer function (instead of writing var that = this)

        this.boardElem.onclick = function(e) { // e initialised as function param 
            e = e || event; // work around due to IE
            var source = e.boardElem || e.target;
            this.updateModel({
                position:source.getAttribute("id");
                currentValue: source.value || null         //the exisitng value, this is important so we do not allow a button to clicked twice

            })
        }.bind(this); // this now bounded to the this parameter of the outer function
    },

    reset: function() {
        
        var sqrArr = document.getElementsByTagName("input");
        for (var i = 0; i < sqrArr.length; i += 1) {
            sqrArr[i].value = "";
        }

        this.boardArr = []; // current 3 by 3 aray, initialised with 0

        for(var n=1;n<=9;n++) {
            this.boardArr[n]=null;
        }

        this.moves=0;
        this.gameOver= false;
        this.xTurn = true;
    }
    /**
    * Updtes the model (boardArr)
    * @par
    */
    updateModel: function(obj) { // 

    }

    getSquareValues: function(square) {
        var squareValue = document.getElementById(square); // coming from events that bubble up from the init function
        if(squareValue.value !== "") { // if there is an X or O 
           return;
        }
        if (squareValue !== "X" && squareValue !== "O" && this.gameOver !== true) { // stops a square being selected more than once
            // and stops clicking square when the game is over
            if (this.xTurn) {
                this.moves += 1;
                squareValue.value = "X"; // draw X on board
                this.xTurn = false; // then it is no longer the turn of X, switch turn to O
                this.statusElem.innerHTML = "It is the turn of O";
            } else {
                this.moves += 1;
                squareValue.value = "O"; // if is O's turn, draw O
                this.xTurn = true; // it is now the turn of X
                this.statusElem.innerHTML = "It is the turn of X";
            }
        } else {
            return; // exit method 
        }
        if (this.moves === 9) { // check number of moves to see that 9 moves were made to complete a game
            this.gameOver = true;
        }
        this.checkForWinner();
    },

    checkForWinner: function() { // check all 8 winning combinations by holding them in an array
        
        // check if there are three Xs or three Os in a row  
        if (arr[1] === arr[2] && arr[2] === arr[3] && arr[1] !== "") {
            this.resultElem.innerHTML = arr[1] + ' wins';
            this.gameOver = true;
            this.statusElem.innerHTML = " ";
            return;
        } else if (arr[4] === arr[5] && arr[5] === arr[6] && arr[4] !== "") {
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
        }
        else {
            this.resultElem.innerHTML = " ";
            return;
        }
    }
};

var playGame = new TicTacToe(); // new object which inherits from TicTacToe
