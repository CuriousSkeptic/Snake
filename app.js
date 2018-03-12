//contants
var COLS = 38;
var ROWS = 38;
var EMPTY = 0;
var SNAKE = 1;
var FOOD = 2;
var LEFT = 0;
var UP = 1;
var RIGHT = 2;
var DOWN = 3;
var KEY_LEFT = 37; //keycode for left
var KEY_UP = 38; //keycode for up
var KEY_RIGHT = 39; //keycode for right
var KEY_DOWN = 40; //keycode for down

//variables
var canvas; //html5 canvas
var ctx; //canvas 2d context
var keystate; //what keycode was most recently pressed
var frames; //fps
var score; //number of food eaten

//Grid  object for snake to move on
var grid = {
    width: null, //columns
    height: null, //rows
    _grid: null, //object to manipulate

    init: function(d, c, r) { //set d to every index of matrix[c][r]
        this.width = c;
        this.height = r;
        this._grid = [];
        for (var x = 0; x < c; x++) {
            this._grid.push([]);
            for (var y = 0; y < r; y++) {
                this._grid[x].push(d);
            }
        }
    },

    set: function(val, x, y) { //set value at  _grid[x][y] to val
        this._grid[x][y] = val;
    },

    get: function(x, y) { //get value at _grid[x][y]
        return this._grid[x][y];
    }
};

//snake object
var snake = {
    direction: null, //direction set by key presses
    last: null, //last element in queue
    _queue: null, //array to store all positions in queue

    init: function(d, x, y) { //constructor function
        this.direction = d;
        this._queue = [];
        this.insert(x, y);
    },

    insert: function(x, y) { //add position

        //adds element to end of the queue
        this._queue.unshift({
            x: x,
            y: y
        });
        this.last = this._queue[0]; //last is first element of queue or last placed in the queue
    },

    remove: function() { //return the removed first element in the queue (first in last out)

        return this._queue.pop();
    }
};

//Set a food id at a random free cell in the grid
function setFood() {
    var empty = [];

    for (var x = 0; x < grid.width; x++) { //matix for loop to get the number of empty cells
        for (var y = 0; y < grid.height; y++) {
            if (grid.get(x, y) === EMPTY) {
                empty.push({
                    x: x,
                    y: y
                });
            }
        }
    }

    var randpos = empty[Math.round(Math.random() * (empty.length - 1))];
    grid.set(FOOD, randpos.x, randpos.y); //add food to a random index betweeen 0 and empty.length - 1
}

function main() { //driver function

    // create canvas element
    canvas = document.createElement("canvas");
    canvas.width = COLS * 15;
    canvas.height = ROWS * 15;
    ctx = canvas.getContext("2d");

    // add the canvas element to the body of the document
    document.body.appendChild(canvas);

    ctx.font = "15px Futura"; //font for score at bottom left
    frames = 0; //fps
    keystate = {}; //what button has been pressed

    // keeps track of the keybourd input
    document.addEventListener("keydown", function(evt) {
        keystate[evt.keyCode] = true;
    });
    document.addEventListener("keyup", function(evt) {
        delete keystate[evt.keyCode];
    });

    init(); //initialize objects
    loop(); //start loop
    printScore(); //add score to bottom left of canvas
}

//Resets and inits game objects
function init() {
    score = 0;
    grid.init(EMPTY, COLS, ROWS); //initialize grid
    var sp = {
        x: Math.floor(COLS / 2),
        y: ROWS - 1
    };
    snake.init(UP, sp.x, sp.y); //initialize snake
    grid.set(SNAKE, sp.x, sp.y);
    setFood(); //initialize food
}

function loop() {
    update(); //every 5 ticks update
    draw(); //animate canvas based on logic in update

    window.requestAnimationFrame(loop, canvas); //call loop and animate the canvas
}

//Updates the game logic
function update() {

    frames++; //increase frame for fps

    // changing direction of the snake depending on which keys that are pressed
    if (keystate[KEY_LEFT] && snake.direction !== RIGHT) { //left
        snake.direction = LEFT;
    }
    if (keystate[KEY_UP] && snake.direction !== DOWN) { //up
        snake.direction = UP;
    }
    if (keystate[KEY_RIGHT] && snake.direction !== LEFT) { //right
        snake.direction = RIGHT;
    }
    if (keystate[KEY_DOWN] && snake.direction !== UP) { //down
        snake.direction = DOWN;
    }

    // each five frames update the game state.
    if (frames % 5 === 0) {

        // pop the last element from the snake queue i.e. the head
        var nx = snake.last.x;
        var ny = snake.last.y;

        // updates the position depending on the snake direction
        switch (snake.direction) {
            case LEFT:
                nx--;
                break;
            case UP:
                ny--;
                break;
            case RIGHT:
                nx++;
                break;
            case DOWN:
                ny++;
                break;
        }

        // checks all gameover conditions
        if (0 > nx || nx > grid.width - 1 || 0 > ny || ny > grid.height - 1 || grid.get(nx, ny) === SNAKE) {
            return init();
        }

        // check wheter the new position are on the FOOD item
        if (grid.get(nx, ny) === FOOD) {

            // increment the score and sets a new FOOD position
            score++;
            setFood();
        } else {

            // take out the first item from the snake queue i.e the tail and remove id from grid
            var tail = snake.remove();
            grid.set(EMPTY, tail.x, tail.y);
        }

        // add a snake id at the new position and append it to the snake queue
        grid.set(SNAKE, nx, ny);
        snake.insert(nx, ny);
    }
}

//Render the grid to the canvas.
function draw() {

    // calculate tile-width and -height
    var tw = canvas.width / grid.width;
    var th = canvas.height / grid.height;

    // iterate through the grid and draw all cells
    for (var x = 0; x < grid.width; x++) {
        for (var y = 0; y < grid.height; y++) {

            // sets the fillstyle depending on the id of each cell
            switch (grid.get(x, y)) {
                case EMPTY:
                    ctx.fillStyle = "#fff";
                    break;
                case SNAKE:
                    ctx.fillStyle = "#00d8d6";
                    break;
                case FOOD:
                    ctx.fillStyle = "#00d8d6";
                    break;
            }
            ctx.fillRect(x * tw, y * th, tw, th);
        }
    }

    // changes the fillstyle once more and draws the score message to the canvas
    ctx.fillStyle = "#00d8d6";
    // ctx.font = "15pt Futura";
    ctx.fillText(score, 10, canvas.height - 10);
}

// start and run the game
main();
