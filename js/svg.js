// ------------------------------------------------------------------------- //
// Helpers
// ------------------------------------------------------------------------- //

function randomRange(low, high) {
    return Math.floor( Math.random() * (1 + high - low) ) + low;
}

// ------------------------------------------------------------------------- //
// App vars
// ------------------------------------------------------------------------- //

var body = window.document.body;
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

    this.group = canvas.g();

    // if you want individual tile sizes
    // this.tileSize = opts.tileSize || tileSize;

    return this;
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
    var pathLength;
    var pathSpeed;
    // sets how fast the lines are drawn in px/sec
    var drawSpeed = 2000;


    function animatePath(path, speed) {

        var prefixedDuration = Modernizr.prefixed('transitionDuration');
        var duration = speed + 's';

        // necessary so the transition works as XXXX then 0
        setTimeout(function() {
            // debugger
            path.node.style[prefixedDuration] = duration;
            path.attr('strokeDashoffset', 0);
        }, 0);
    }

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

            pathLength = Snap.path.getTotalLength(this.path);
            pathLength = Math.ceil(pathLength);

            this.path.attr({
                stroke: stroke.color,
                strokeWidth: stroke.width,
                strokeLinecap : stroke.cap,
                strokeDashoffset : pathLength,
                strokeDasharray : pathLength,
                fill : 'none'
            });

            pathSpeed = pathLength / drawSpeed;

            animatePath(this.path, pathSpeed);
            // add to the group
            this.group.add(this.path);

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

function clearCanvas() {
    // clear all
    canvas.clear();
    // draw bg
    drawBg();
}


function drawManyLines() {

    // var startX;
    // var startY;
    // var startDir;
    // var tileSize;

    var line;

    getTileSizes();

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
// Modes
// ------------------------------------------------------------------------- //

// starting mode
var mode = 'draw';
// modes holder
var modes = {};

//
// Draw mode
//
modes.draw = (function() {

    function onPressDraw(event) {
        // normalize
        normalizeEvent(event);
        // save X and Y
        pointerX = event.pageX;
        pointerY = event.pageY;

        // make line
        var line = new Line({
            x : pointerX,
            y : pointerY
        });
        line.drawPath();

        // add event listeners for move
        body.addEventListener('mousemove', onMoveDraw, false);

        // start interval/timeout
        lineInterval = setInterval(function(){
            var line = new Line({
                x : pointerX,
                y : pointerY
            });
            line.drawPath();
        }, (1000/6) );
    }

    function onMoveDraw(event) {
        // save the current X and Y
        normalizeEvent(event);
        pointerX = event.pageX;
        pointerY = event.pageY;
    }

    function onReleaseDraw(event) {
        // clear interval
        clearInterval(lineInterval);
        // remove move listeners
        body.removeEventListener('mousemove', onMoveDraw, false);
    }

    function bindEvents() {
        body.addEventListener('mousedown', onPressDraw, false);
        body.addEventListener('mouseup', onReleaseDraw, false);
    }

    function unbindEvents() {
        body.removeEventListener('mousedown', onPressDraw, false);
        body.removeEventListener('mouseup', onReleaseDraw, false);
    }

    // Return
    return {
        on : bindEvents,
        off : unbindEvents
    };

})();

//
// Move mode
//
modes.move = (function() {

    // invert filter


    function onGroupOverMove() {
        var invert = canvas.filter( Snap.filter.invert(1) );
        this.attr({
            filter : invert
        });
    }
    function onGroupOutMove() {
        this.attr({
            filter : null
        });
    }
    function onGroupPressMove() {

    }
    function onGroupReleaseMove() {

    }
    function onPointerMoveMove() {

    }

    function bindEvents() {
        var gs = canvas.selectAll('g');

        var lastX;
        var lastY;
        var currentX;
        var currentY;

        gs.forEach(function(group) {
            // group hover
            group.hover(onGroupOverMove, onGroupOutMove, group, group);
            group.mousedown(onGroupPressMove);

            group.drag(
                function move( dx, dy, x, y ){
                    // set x and y as current
                    currentX = x;
                    currentY = y;
                    // find the change in x, y
                    var diffX = currentX - lastX;
                    var diffY = currentY - lastY;
                    // console.log('dx: ', diffX, 'dy: ', diffY);

                    // make a new matrix
                    var t = new Snap.Matrix();
                    // move by the difference in x and y
                    t.translate(diffX, diffY);

                    // if it had a matrix before, add it to the old
                    if ( !!this._matrix ) {
                        t.add(this._matrix);
                    }
                    // assign the new matrix value
                    this._matrix = t;
                    // make the transformation
                    this.transform( t );

                    // reset x and y
                    lastX = currentX;
                    lastY = currentY;
                },
                function start( x, y, event ){
                    lastX = x;
                    lastY = y;
                },
                function end(event){

                }
            );
        });
    }

    function unbindEvents() {
        var gs = canvas.selectAll('g');

        gs.forEach(function(group) {
            // unbind listeners
            group.unhover(onGroupOverMove, onGroupOutMove);
            group.unmousedown(onGroupPressMove);
            group.undrag();
        });
    }

    return {
        on : bindEvents,
        off : unbindEvents
    };

})();

//
// Erase mode
//
modes.erase = (function() {

    // invert filter
    var invert = canvas.filter( Snap.filter.invert(1) );

    function onGroupOverErase() {
        this.attr({
            filter : invert
        });
    }
    function onGroupOutErase() {
        this.attr({
            filter : null
        });
    }
    function onGroupClickErase() {
        this.remove();
    }


    function bindEvents() {
        var gs = canvas.selectAll('g');

        gs.forEach(function(group) {
            // group hover
            group.hover(onGroupOverErase, onGroupOutErase, group, group);
            group.click(onGroupClickErase);
        });
    }

    function unbindEvents() {
        var gs = canvas.selectAll('g');

        gs.forEach(function(group) {
            // unbind listeners
            group.unhover(onGroupOverErase, onGroupOutErase);
            group.unclick(onGroupClickErase);
        });
    }

    return {
        on : bindEvents,
        off : unbindEvents
    };

})();




function onModeChange(mode) {

    if (mode === 'draw') {
        // offs
        modes.move.off();
        modes.erase.off();
        // on
        modes.draw.on();
    }
    else if (mode === 'move') {
        // offs
        modes.draw.off();
        modes.erase.off();
        // on
        modes.move.on();
    }
    else if (mode === 'erase') {
        // offs
        modes.move.off();
        modes.draw.off();
        // on
        modes.erase.on();
        // might want to do this at the canvas level and delegate for g
        // so you can DrawManyLines() and still erase without changing modes

    }

}

// ------------------------------------------------------------------------- //
// Events
// ------------------------------------------------------------------------- //

// yoinked from jQuery
function normalizeEvent(event) {
    var eventDoc;
    var doc;
    var body;

    // Calculate pageX/Y if missing and clientX/Y available
    if ( event.pageX == null && event.clientX != null ) {
        eventDoc = event.target.ownerDocument || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
        event.pageY = event.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
    }

    return event;
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


// function onClick(event) {

//     var line = new Line({
//         x : event.x,
//         y : event.y
//     });

//     line.drawPath();

// }

var pointerX;
var pointerY;
var lineInterval;

// function onPress(event) {
//     // normalize
//     normalizeEvent(event);
//     // save X and Y
//     pointerX = event.pageX;
//     pointerY = event.pageY;

//     // make line
//     var line = new Line({
//         x : pointerX,
//         y : pointerY
//     });
//     line.drawPath();
//     // add event listeners for move
//     body.addEventListener('mousemove', onMove, false);
//     // start interval/timeout
//     lineInterval = setInterval(function(){
//         var line = new Line({
//             x : pointerX,
//             y : pointerY
//         });
//         line.drawPath();
//     }, (1000/6) );
// }

// function onMove(event) {
//     // save the current X and Y
//     normalizeEvent(event);
//     pointerX = event.pageX;
//     pointerY = event.pageY;
// }

// function onRelease(event) {
//     // clear interval
//     clearInterval(lineInterval);
//     // remove move listeners
//     body.removeEventListener('mousemove', onMove, false);
// }



// binding starting
// function unbindEvents() {
//     body.removeEventListener('mousedown', onPress, false);
//     body.removeEventListener('mouseup', onRelease, false);
// }
function bindEvents() {
    // body.addEventListener('mousedown', onPress, false);
    // body.addEventListener('mouseup', onRelease, false);
    // canvas.click(onClick);
    // resize
    var throttledResize = _.throttle(onResize, 300);
    window.addEventListener('resize', throttledResize, false);
}


// ------------------------------------------------------------------------- //
// GUI creation
// ------------------------------------------------------------------------- //

var gui;

function createGUI() {

    var guiContainer = document.getElementById('gui-container');

    gui = new dat.GUI({
        autoPlace : false
    });
    guiContainer.appendChild(gui.domElement);
    guiContainer.addEventListener('mousedown', function(event){
        event.stopPropagation();
    }, false);

    var globals = gui.addFolder('Global Options');

    globals.add(window, 'lineCount', 1, 100);
    globals.add(window, 'lineLength', 1, 200);
    globals.add(window, 'tileSize', 20, 300);
    var mode = globals.add(window, 'mode', ['draw', 'move', 'erase']);
    globals.addColor(window, 'bgColor');
    globals.open();

    mode.onChange(onModeChange);


    var methods = gui.addFolder('Actions');

    methods.add(window, 'drawManyLines');
    methods.add(window, 'addStroke');
    methods.add(window, 'clearCanvas');
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
    drawBg();
    // drawManyLines();
    bindEvents();
    modes.draw.on();
}

init();