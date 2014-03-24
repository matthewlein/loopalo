// ------------------------------------------------------------------------- //
// Helpers
// ------------------------------------------------------------------------- //

function randomRange(low, high) {
    return Math.floor( Math.random() * (1 + high - low) ) + low;
}

// ------------------------------------------------------------------------- //
// App vars
// ------------------------------------------------------------------------- //


var canvas = Snap('#svg');

var cWidth = 1200;
var cHeight = 800;

canvas.attr({
    width : cWidth,
    height : cHeight
});

//
// set up tiles
//
var tileSize = 96;
var halfTile = tileSize/2;

var tilesX = cWidth / tileSize;
var tilesY = cHeight / tileSize;

// sets the possible moves
// you can add repeats to increase likelyhood of getting something
var moves = [
    'straight',
    'left',
    'right'
];

// ------------------------------------------------------------------------- //
// Line
// ------------------------------------------------------------------------- //

function Line( opts ) {

    opts = opts || {};

    // griddy
    this.x = opts.x || ( randomRange(0, tilesX) * tileSize );
    this.y = opts.y || ( randomRange(0, tilesY) * tileSize );

    // griddy but kinda random
    // this.x = opts.x || randomRange(0, cWidth);
    // this.y = opt.y || randomRange(0, cHeight);

    this.dir = opts.dir || randomRange(0, 3);
    this.steps = opts.steps || lineLength;

    // start with M move to x, y
    this.pathString = 'M ' + this.x + ' ' + this.y + ' ';

    // set later when its drawn
    this.path = null;

    // if you want individual tile sizes
    // this.tileSize = opts.tileSize || tileSize;
}

//
// Advance
//
Line.prototype.advance = function() {

    // start with unchanged values
    var newX = this.x;
    var newY = this.y;
    var newDir = this.dir;
    var newPathString = this.pathString;

    // for rotation direction
    var rotationFlag;

    // the next move
    var nextMove = this.getNextMove();

    // for random tile sizes
    // var tileSize = this.tileSize;
    // var halfTile = this.tileSize/2;

    // ------------------------------------------------------------------------- //
    // East
    // ------------------------------------------------------------------------- //
    if (this.dir === 0) {

        if (nextMove === 'left') {
            newX = this.x + halfTile;
            newY = this.y - halfTile;
            rotationFlag = 0;
        }
        else if (nextMove === 'right') {
            newX = this.x + halfTile;
            newY = this.y + halfTile;
            rotationFlag = 1;
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
            rotationFlag = 0;
        }
        else if (nextMove === 'right') {
            newX = this.x + halfTile;
            newY = this.y - halfTile;
            rotationFlag = 1;
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
            rotationFlag = 0;
        }
        else if (nextMove === 'right') {
            newX = this.x - halfTile;
            newY = this.y - halfTile;
            rotationFlag = 1;
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
            rotationFlag = 0;
        }
        else if (nextMove === 'right') {
            newX = this.x - halfTile;
            newY = this.y + halfTile;
            rotationFlag = 1;
        }
        else if (nextMove === 'straight') {
            newX = this.x;
            newY = this.y + tileSize;
        }
    }



    // draw the segment
    if (nextMove === 'straight') {
        newPathString += 'L ' + newX + ' ' + newY + ' ';
    } else {
        // A arc guide:
        // A rx ry, x-axis-rotation, large-arc-flag, sweep-flag, x y
        newPathString += 'A ' + halfTile + ' ' + halfTile + ', 0, 0, ' + rotationFlag + ', ' + newX + ' ' + newY + ' ';
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
    this.pathString = newPathString;

};

Line.prototype.getNextMove = function() {

    var nextMove = moves[ randomRange( 0, moves.length - 1 ) ];

    return nextMove;

};

Line.prototype.drawPath = function() {

    var stroke;

    // advance lineLength steps on this line
    for (var i = 0; i < this.steps; i++) {
        this.advance();
    }

    // using a for loop so it draws backwards
    for (var k = strokes.length - 1; k >= 0; k--) {
        stroke = strokes[k];

        // if the stroke has a width
        if (!!stroke.width) {

            // make a path
            this.path = canvas.path(this.pathString);

            this.path.attr({
                stroke: stroke.color,
                strokeWidth: stroke.width,
                strokeLinecap : stroke.cap,
                fill : 'none'
            });

        }
    }
};


// ------------------------------------------------------------------------- //
// Getting stuff
// ------------------------------------------------------------------------- //

function getTileSizes() {
    halfTile = tileSize / 2;

    tilesX = cWidth / tileSize;
    tilesY = cHeight / tileSize;
}

function onResize() {
    cWidth = window.innerWidth;
    cHeight = window.innerHeight;
    getTileSizes();
    // set canvas size
    canvas.attr({
        width : cWidth,
        height : cHeight
    });
}

// ------------------------------------------------------------------------- //
// Line drawing
// ------------------------------------------------------------------------- //

// number of lines drawn
var lineCount = 30;

// how long each line is
var lineLength = 70;

// the strokes on the paths
var strokes = [
    {
        color : '#41abe6',
        width : 10,
        cap : 'round'
    },
    {
        color : '#c3d2a0',
        width : 30,
        cap : 'round'
    },
    {
        color : '#41abe6',
        width : 33,
        cap : 'round'
    }
];

var bgColor = '#F3F5DF';
// reference for the rectangle
var bgRect;

function drawBg() {
    // svg doesn't have a bg color, using rect instead
    var bgRect = canvas.rect( 0, 0, '100%', '100%');
    bgRect.attr({
        fill : bgColor
    });
}


function drawNew() {

    // var startX;
    // var startY;
    // var startDir;
    // var tileSize;

    var line;

    getTileSizes();

    // clear all
    canvas.clear();

    // draw bg
    drawBg();

    // draw all the lines
    for (var j = 0; j < lineCount; j++) {

        // griddy
        // startX = ( randomRange(0, tilesX) * tileSize );
        // startY = ( randomRange(0, tilesY) * tileSize );

        // griddy but kinda random
        // startX = randomRange(0, cWidth);
        // startY = randomRange(0, cHeight);

        // startDir = randomRange(0, 3);

        // for random tile sizes
        // tileSize = randomRange(20, 200);

        line = new Line();

        line.drawPath();

    }

}


function addStroke() {

    var maxWidthStroke = _.max( strokes, function(stroke) {
        return stroke.width;
    });

    var maxWidth = maxWidthStroke.width;

    var newStrokeIndex = strokes.length;

    strokes.push({
        color : '#000',
        width : maxWidth + 5,
        cap : 'round'
    });

    var newStroke = strokes[newStrokeIndex];

    var folder = gui.addFolder('Stroke ' + (strokes.length) );
    folder.add(newStroke, 'width', 0, 100);
    folder.addColor(newStroke, 'color');
    folder.add(newStroke, 'cap', ['round', 'square', 'butt']);
    folder.open();

}

// ------------------------------------------------------------------------- //
// GUI creation
// ------------------------------------------------------------------------- //

var gui;

function createGUI() {
    gui = new dat.GUI();

    var globals = gui.addFolder('Global Options');

    globals.add(window, 'lineCount', 1, 100);
    globals.add(window, 'lineLength', 1, 200);
    globals.add(window, 'tileSize', 20, 300);
    globals.addColor(window, 'bgColor');
    globals.open();

    var methods = gui.addFolder('Actions');

    methods.add(window, 'drawNew');
    methods.add(window, 'addStroke');
    methods.open();

    _.each(strokes, function(stroke, index) {
        var folder = gui.addFolder('Stroke ' + (index + 1) );
        folder.add(stroke, 'width', 0, 100);
        folder.addColor(stroke, 'color');
        folder.add(stroke, 'cap', ['round', 'square', 'butt']);
        folder.open();
    });

}

// ------------------------------------------------------------------------- //
// Init
// ------------------------------------------------------------------------- //

function init() {
    onResize();
    createGUI();
    drawNew();
    var throttledResize = _.throttle(onResize, 300);
    window.addEventListener('resize', throttledResize, false);
}

init();