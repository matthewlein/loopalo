
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
// App
// ------------------------------------------------------------------------- //

var canvas = Snap('#svg');

var cWidth = 500;
var cHeight = 500;

canvas.attr({
    width : cWidth,
    height : cHeight
});

//
// set up tiles
//
var tileSize = 100;
var halfTile = tileSize/2;

var tilesX = cWidth / tileSize;
var tilesY = cHeight / tileSize;



var x = 250;
var y = 250;

var newX;
var newY;

var rotationFlag;

var pathString = 'M ' + x + ' ' + y + ' ';

// pathString

// ------------------------------------------------------------------------- //
// North
// ------------------------------------------------------------------------- //

// turn left
// newX = (x - halfTile);
// newY = y - halfTile;
// rotationFlag = 0;

// turn right
// ctx.arcTo( x, y - halfTile, x + halfTile, y - halfTile, halfTile );
// newX = this.x + halfTile;
// newY = this.y - halfTile;
// rotationFlag = 1;

// pathString += 'A ' + halfTile + ' ' + halfTile + ', 0, 0, ' + rotationFlag + ', ' + newX + ' ' + newY + ' ';

// straight
// newX = this.x;
// newY = this.y - tileSize;

// pathString += 'L ' + newX + ' ' + newY + ' ';


// ------------------------------------------------------------------------- //
// South
// ------------------------------------------------------------------------- //

// turn left
// newX = this.x + halfTile;
// newY = this.y + halfTile;
// rotationFlag = 0;

// turn right
// newX = this.x - halfTile;
// newY = this.y + halfTile;
// rotationFlag = 1;

// pathString += 'A ' + halfTile + ' ' + halfTile + ', 0, 0, ' + rotationFlag + ', ' + newX + ' ' + newY + ' ';

// straight
// ctx.lineTo( x, y + tileSize );
// newX = this.x;
// newY = this.y + tileSize;

// pathString += 'L ' + newX + ' ' + newY + ' ';


// ------------------------------------------------------------------------- //
// East
// ------------------------------------------------------------------------- //

// turn left
// ctx.arcTo( x + halfTile, y, x + halfTile, y - halfTile, halfTile);
// newX = this.x + halfTile;
// newY = this.y - halfTile;
// rotationFlag = 0;

// turn right
// ctx.arcTo( x + halfTile, y, x + halfTile, y + halfTile, halfTile );
// newX = this.x + halfTile;
// newY = this.y + halfTile;
// rotationFlag = 1;

// pathString += 'A ' + halfTile + ' ' + halfTile + ', 0, 0, ' + rotationFlag + ', ' + newX + ' ' + newY + ' ';

// straight
// ctx.lineTo( x + tileSize, y );



// ------------------------------------------------------------------------- //
// West
// ------------------------------------------------------------------------- //
// turn left
// ctx.arcTo( x - halfTile, y, x - halfTile, y + halfTile, halfTile );
// newX = this.x - halfTile;
// newY = this.y + halfTile;
// rotationFlag = 0;

// turn right
// ctx.arcTo( x - halfTile, y, x - halfTile, y - halfTile, halfTile );
// newX = this.x - halfTile;
// newY = this.y - halfTile;
// rotationFlag = 1;

// pathString += 'A ' + halfTile + ' ' + halfTile + ', 0, 0, ' + rotationFlag + ', ' + newX + ' ' + newY + ' ';

// straight
// ctx.lineTo( x - tileSize, y );


var path = canvas.path(pathString);

path.attr({
    stroke: "#000",
    strokeWidth: 2,
    fill : 'none'
});