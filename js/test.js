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

var cHeight = 500;
var cWidth = 500;

canvas.width = cWidth;
canvas.height = cHeight;

//
// set up tiles
//
var tileSize = 100;
var halfTile = tileSize/2;

var tilesX = cWidth / tileSize;
var tilesY = cHeight / tileSize;


// DEV
renderGrid(canvas, tileSize/10, '#ccc');
renderGrid(canvas, tileSize, 'red');


var x = 250;
var y = 250;

// moving right
ctx.beginPath();
ctx.moveTo( x, y );


// ------------------------------------------------------------------------- //
// North
// ------------------------------------------------------------------------- //

// turn left
// ctx.arcTo( x, y - halfTile, x - halfTile, y - halfTile, halfTile );

// turn right
// ctx.arcTo( x, y - halfTile, x + halfTile, y - halfTile, halfTile );

// straight
// ctx.lineTo( x, y - tileSize );



// ------------------------------------------------------------------------- //
// South
// ------------------------------------------------------------------------- //

// turn left
// ctx.arcTo( x, y + halfTile, x + halfTile, y + halfTile, halfTile );

// turn right
// ctx.arcTo( x, y + halfTile, x - halfTile, y + halfTile, halfTile );

// straight
// ctx.lineTo( x, y + tileSize );



// ------------------------------------------------------------------------- //
// East
// ------------------------------------------------------------------------- //

// turn right
// ctx.arcTo( x + halfTile, y, x + halfTile, y + halfTile, halfTile );

// turn left
// ctx.arcTo( x + halfTile, y, x + halfTile, y - halfTile, halfTile);

// straight
// ctx.lineTo( x + tileSize, y );



// ------------------------------------------------------------------------- //
// West
// ------------------------------------------------------------------------- //
// turn left
// ctx.arcTo( x - halfTile, y, x - halfTile, y + halfTile, halfTile );

// turn right
// ctx.arcTo( x - halfTile, y, x - halfTile, y - halfTile, halfTile );

// straight
// ctx.lineTo( x - tileSize, y );




ctx.stroke();