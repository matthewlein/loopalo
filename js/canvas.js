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
// App vars
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




function getTileSizes() {
    halfTile = tileSize / 2;

    tilesX = cWidth / tileSize;
    tilesY = cHeight / tileSize;
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

function drawNew() {

    var startX;
    var startY;
    var startDir;
    var line;

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
        for (var i = 0; i < lineLength; i++) {
            line.advance();
        }


        var item;
        for (var k = strokes.length - 1; k >= 0; k--) {
            item = strokes[k];

            if (!!item.width) {
                ctx.strokeStyle = item.color;
                ctx.lineWidth = item.width;
                ctx.lineCap = item.cap;
                ctx.stroke();
            }
        }

        ctx.closePath();

    }

    ctx.restore();
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
    globals.open();

    var methods = gui.addFolder('Actions');

    methods.add(window, 'drawNew');
    methods.add(window, 'addStroke');
    methods.open();

    _.each(strokes, function(item, index) {
        var folder = gui.addFolder('Stroke ' + (index + 1) );
        folder.add(item, 'width', 0, 100);
        folder.addColor(item, 'color');
        folder.add(item, 'cap', ['round', 'square', 'butt']);
        folder.open();
    });


}

// ------------------------------------------------------------------------- //
// Init
// ------------------------------------------------------------------------- //

function init() {
    createGUI();
    drawNew();
}

init();