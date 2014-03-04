// ------------------------------------------------------------------------- //
// Helpers
// ------------------------------------------------------------------------- //

function randomRange(low, high) {
    return Math.floor( Math.random() * (1 + high - low) ) + low;
}

function DEG_RAD(deg) {
    return (Math.PI/180) * deg;
}

// ------------------------------------------------------------------------- //
// grids
// ------------------------------------------------------------------------- //
function renderGrid(canvas, gridPixelSize, color) {

    var can = canvas;
    var ctx = can.getContext('2d');

    ctx.save();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = color;

    // horizontal grid lines
    for(var i = 0; i <= canvas.height; i = i + gridPixelSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.closePath();
        ctx.stroke();
    }

    // vertical grid lines
    for(var j = 0; j <= canvas.width; j = j + gridPixelSize) {
        ctx.beginPath();
        ctx.moveTo(j, 0);
        ctx.lineTo(j, canvas.height);
        ctx.closePath();
        ctx.stroke();
    }

    ctx.restore();
}




// ------------------------------------------------------------------------- //
// App
// ------------------------------------------------------------------------- //


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var cWidth = 1800;
var cHeight = 1200;


canvas.width = cWidth;
canvas.height = cHeight;

//
// set up tiles
//
var tileSize = 96;
var halfTile = tileSize/2;

var tilesX = cWidth / tileSize;
var tilesY = cHeight / tileSize;

var moves = [
    'straight',
    'left',
    'right'
];

// ------------------------------------------------------------------------- //
// Line
// ------------------------------------------------------------------------- //

function Line( x, y, dir ) {
    this.x = x;
    this.y = y;
    this.dir = dir;
}

//
// Advance
//
Line.prototype.advance = function() {

    // start with unchanged values
    var newX = this.x;
    var newY = this.y;
    var newDir = this.dir;

    // curve coordinates
    var x1;
    var y1;
    var x2;
    var y2;

    // the next move
    var nextMove = this.getNextMove();

    // ------------------------------------------------------------------------- //
    // East
    // ------------------------------------------------------------------------- //
    if (this.dir === 0) {

        if (nextMove === 'left') {
            newX = this.x + halfTile;
            newY = this.y - halfTile;
            x1 = this.x + halfTile;
            y1 = this.y;
            x2 = this.x + halfTile;
            y2 = this.y - halfTile;
        }
        else if (nextMove === 'right') {
            newX = this.x + halfTile;
            newY = this.y + halfTile;
            x1 = this.x + halfTile;
            y1 = this.y;
            x2 = this.x + halfTile;
            y2 = this.y + halfTile;
        }
        else if (nextMove === 'straight') {
            newX = this.x + tileSize;
            newY = this.y;
        }

    }
    // ------------------------------------------------------------------------- //
    // North
    // ------------------------------------------------------------------------- //
    else if (this.dir === 1) {

        if (nextMove === 'left') {
            newX = this.x - halfTile;
            newY = this.y - halfTile;
            x1 = this.x;
            y1 = this.y - halfTile;
            x2 = this.x - halfTile;
            y2 = this.y - halfTile;
        }
        else if (nextMove === 'right') {
            newX = this.x + halfTile;
            newY = this.y - halfTile;
            x1 = this.x;
            y1 = this.y - halfTile;
            x2 = this.x + halfTile;
            y2 = this.y - halfTile;
        }
        else if (nextMove === 'straight') {
            newX = this.x;
            newY = this.y - tileSize;
        }

    }
    // ------------------------------------------------------------------------- //
    // West
    // ------------------------------------------------------------------------- //
    else if (this.dir === 2) {

        if (nextMove === 'left') {
            newX = this.x - halfTile;
            newY = this.y + halfTile;
            x1 = this.x - halfTile;
            y1 = this.y ;
            x2 = this.x - halfTile;
            y2 = this.y + halfTile;
        }
        else if (nextMove === 'right') {
            newX = this.x - halfTile;
            newY = this.y - halfTile;
            x1 = this.x - halfTile;
            y1 = this.y ;
            x2 = this.x - halfTile;
            y2 = this.y - halfTile;
        }
        else if (nextMove === 'straight') {
            newX = this.x - tileSize;
            newY = this.y;
        }

    }
    // ------------------------------------------------------------------------- //
    // South
    // ------------------------------------------------------------------------- //
    else if (this.dir === 3) {

        if (nextMove === 'left') {
            newX = this.x + halfTile;
            newY = this.y + halfTile;
            x1 = this.x;
            y1 = this.y + halfTile;
            x2 = this.x + halfTile;
            y2 = this.y + halfTile;
        }
        else if (nextMove === 'right') {
            newX = this.x - halfTile;
            newY = this.y + halfTile;
            x1 = this.x;
            y1 = this.y + halfTile;
            x2 = this.x - halfTile;
            y2 = this.y + halfTile;
        }
        else if (nextMove === 'straight') {
            newX = this.x;
            newY = this.y + tileSize;
        }
    }



    // move the ctx
    if (nextMove === 'straight') {
        ctx.lineTo( newX, newY );
    } else {
        ctx.arcTo( x1, y1, x2, y2, halfTile );
    }

    // update the direction if its a turn
    if (nextMove === 'left') {
        newDir += 1;
    }
    else if (nextMove === 'right') {
        newDir -= 1;
    }
    if (newDir < 0) {
        newDir = 3;
    }
    if (newDir > 3) {
        newDir = 0;
    }

    // update the object
    this.x = newX;
    this.y = newY;
    this.dir = newDir;

};

Line.prototype.getNextMove = function() {

    var nextMove = moves[ randomRange( 0, moves.length - 1 ) ];

    return nextMove;

};

Line.prototype.draw = function(){


    var x = this.x;
    var y = this.y;
    //
    ctx.beginPath();
    //  arc(x, y, radius, startAngle, endAngle, anticlockwise)
    ctx.arc(x, y, 5, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fillStyle = 'black';
    ctx.fill();


};


// ------------------------------------------------------------------------- //
// Instance
// ------------------------------------------------------------------------- //


// DEV
// renderGrid(canvas, tileSize/10, '#ccc');
// renderGrid(canvas, tileSize, 'red');

// mark the start
// line.draw();


// ------------------------------------------------------------------------- //
// One complete line
// ------------------------------------------------------------------------- //



var startX = ( randomRange(0, tilesX) * tileSize );
var startY = ( randomRange(0, tilesY) * tileSize );
var startDir = randomRange(0, 3);

var line = new Line( startX, startY, startDir );

/*

ctx.beginPath();
ctx.moveTo(line.x, line.y);
for (var i = 0; i < 70; i++) {
    line.advance();
    // ctx.stroke();
}
ctx.strokeStyle = 'yellow';
ctx.lineWidth = 50;
ctx.stroke();
ctx.strokeStyle = 'blue';
ctx.lineWidth = 30;
ctx.stroke();
ctx.strokeStyle = '#f00';
ctx.lineWidth = 10;
ctx.stroke();

ctx.closePath();

*/




// ------------------------------------------------------------------------- //
// many lines
// ------------------------------------------------------------------------- //

var lineCount = 30;
var lineSteps = 70;
var color1 = '#41abe6';
var width1 = 33;
var color2 = '#c3d2a0';
var width2 = 30;
var color3 = '#41abe6';
var width3 = 10;

var gui = new dat.GUI();

gui.add(window, 'lineCount', 1, 100);
gui.add(window, 'lineSteps', 1, 200);
gui.addColor(window, 'color1');
gui.add(window, 'width1', 0, 100);
gui.addColor(window, 'color2');
gui.add(window, 'width2', 0, 100);
gui.addColor(window, 'color3');
gui.add(window, 'width3', 0, 100);
gui.add(window, 'tileSize', 20, 300);

gui.add(window, 'drawAll');

function getTileSizes() {
    halfTile = tileSize / 2;

    tilesX = cWidth / tileSize;
    tilesY = cHeight / tileSize;
}

function savePNG() {

}

function drawAll() {

    getTileSizes();

    ctx.clearRect(0, 0, cWidth, cHeight);
    ctx.save();

    for (var j = 0; j < lineCount; j++) {
        startX = ( randomRange(0, tilesX) * tileSize );
        startY = ( randomRange(0, tilesY) * tileSize );
        startDir = randomRange(0, 3);

        line = new Line( startX, startY, startDir );

        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        for (var i = 0; i < lineSteps; i++) {
            line.advance();
        }
        // draw lines if they have a width
        if (!!width1) {
            ctx.strokeStyle = color1;
            ctx.lineWidth = width1;
            ctx.stroke();
        }
        if (!!width2) {
            ctx.strokeStyle = color2;
            ctx.lineWidth = width2;
            ctx.stroke();
        }
        if (!!width3) {
            ctx.strokeStyle = color3;
            ctx.lineWidth = width3;
            ctx.stroke();
        }




        ctx.closePath();

        // faded bg?
        // ctx.save();
        // ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
        // ctx.fillRect ( 0, 0, cWidth, cHeight) ;
        // ctx.restore();
    }

    ctx.restore();
}


drawAll();