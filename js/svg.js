/* global Modernizr */
/* global Snap */


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
var svgWrapper = document.getElementById('svg-wrapper');

canvas.attr({
    width : '100%',
    height : '100%'
});

var cWidth = svgWrapper.offsetWidth;
var cHeight = svgWrapper.offsetHeight;




// sets the possible moves
// you can add repeats to increase likelyhood of getting something
var moves = [
    'straight',
    'left',
    'right'
];
// ------------------------------------------------------------------------- //
// Default settings
// ------------------------------------------------------------------------- //

var settings = {
    // starting mode
    mode : 'draw',
    // number of lines drawn
    lineCount : 30,
    // how long each line is
    lineLength : 70,
    // how big are loops and straights
    tileSize : 96,
    // page bg color
    bgColor : '#F3F5DF',
    // array of strokes
    strokes : [
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
    ]
};

//
// set up tiles
//
var halfTile = settings.tileSize/2;

var tilesX = cWidth / settings.tileSize;
var tilesY = cHeight / settings.tileSize;

// ------------------------------------------------------------------------- //
// Line
// ------------------------------------------------------------------------- //

function Line( opts ) {

    opts = opts || {};

    // griddy
    this.x = opts.x || ( randomRange(0, tilesX) * settings.tileSize );
    this.y = opts.y || ( randomRange(0, tilesY) * settings.tileSize );

    // griddy but kinda random
    // this.x = opts.x || randomRange(0, cWidth);
    // this.y = opt.y || randomRange(0, cHeight);

    this.dir = opts.dir || randomRange(0, 3);
    this.steps = opts.steps || settings.lineLength;

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

    var tileSize = settings.tileSize;

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
    for (var k = settings.strokes.length - 1; k >= 0; k--) {
        stroke = settings.strokes[k];

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

// used to set new tile counts on resize and tileSize change
function setTileSizes() {
    halfTile = settings.tileSize / 2;
    tilesX = cWidth / settings.tileSize;
    tilesY = cHeight / settings.tileSize;
}


// ------------------------------------------------------------------------- //
// Line drawing
// ------------------------------------------------------------------------- //

// reference for the rectangle
var bgRect;

function drawBg() {
    // svg doesn't have a bg color, using rect instead
    bgRect = canvas.rect( 0, 0, '100%', '100%');
    bgRect.attr({
        fill : settings.bgColor
    });
}

function clearCanvas() {
    // clear all
    canvas.clear();
    // draw bg
    drawBg();
}


function drawManyLines() {

    var line;

    // draw all the lines
    for (var j = 0; j < settings.lineCount; j++) {

        line = new Line();
        line.drawPath();

    }

}


function addStroke() {

    var maxWidthStroke = _.max( settings.strokes, function(stroke) {
        return stroke.width;
    });

    var maxWidth = maxWidthStroke.width;

    var newStrokeIndex = settingsstrokes.length;

    settings.strokes.push({
        color : '#000',
        width : maxWidth + 5,
        cap : 'round'
    });

    var newStroke = settings.strokes[newStrokeIndex];

    // gui
    var folder = gui.addFolder('Stroke ' + (settings.strokes.length) );
    folder.add(newStroke, 'width', 0, 100);
    folder.addColor(newStroke, 'color');
    folder.add(newStroke, 'cap', ['round', 'square', 'butt']);
    folder.open();

}

// ------------------------------------------------------------------------- //
// Modes
// ------------------------------------------------------------------------- //

// starting mode
// var mode = 'draw';
// modes holder
var modes = {};

//
// Draw mode
//
modes.draw = (function() {

    // draws lines
    var lineInterval;

    function onPressDraw(event) {
        // normalize
        normalizeEvent(event);
        // save X and Y
        pointerX = event._canvasX;
        pointerY = event._canvasY;

        // make line
        var line = new Line({
            x : pointerX,
            y : pointerY
        });
        line.drawPath();

        // add event listeners for move
        canvas.mousemove(onMoveDraw);

        // start interval/timeout
        lineInterval = setInterval(function(){
            var line = new Line({
                x : pointerX,
                y : pointerY
            });
            line.drawPath();
            // console.log('x:', pointerX, 'y:', pointerY);
        }, (1000/6) );
    }

    function onMoveDraw(event) {
        // save the current X and Y
        normalizeEvent(event);
        pointerX = event._canvasX;
        pointerY = event._canvasY;
        // console.log(event, 'x:', pointerX, 'y:', pointerY);
    }

    function onReleaseDraw(event) {
        // clear interval
        clearInterval(lineInterval);
        // remove move listeners
        canvas.unmousemove(onMoveDraw);
    }

    function bindEvents() {
        canvas.mousedown(onPressDraw);
        canvas.mouseup(onReleaseDraw);
    }

    function unbindEvents() {
        canvas.unmousedown(onPressDraw);
        canvas.unmouseup(onReleaseDraw);
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


function changeMode() {
    var $this = $(this);
    var newMode = $this.data('mode');
    var activeClass = 'button--group--active';

    $modeBtns.removeClass(activeClass);
    $this.addClass(activeClass);

    settings.mode = newMode;
    onModeChange();
}

function onModeChange(mode) {

    var mode = settings.mode;

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

var pointerX;
var pointerY;

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

    // add an _canvasX and _canvasY that are relative to the canvas
    var canvasLeft = svgWrapper.getBoundingClientRect().left;
    var canvasTop = svgWrapper.getBoundingClientRect().top;

    event._canvasX = event.pageX - canvasLeft;
    event._canvasY = event.pageY - canvasTop;

    return event;
}


function onResize() {
    cWidth = svgWrapper.offsetWidth;
    cHeight = svgWrapper.offsetHeight;
    setTileSizes();
}

function bindEventsGlobal() {
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



    _.each(settings.strokes, function(stroke, index) {
        var folder = gui.addFolder('Stroke ' + (index + 1) );
        folder.add(stroke, 'width', 0, 100);
        folder.addColor(stroke, 'color');
        folder.add(stroke, 'cap', ['round', 'square', 'butt']);
        folder.open();
    });

}

var $modeBtns = $('[data-mode]');

function createController() {

    // Maybe move onModeChange into here?

    $modeBtns = $('[data-mode]');
    $modeBtns.on('mousedown', changeMode);

    var $curveSizeInput = $('#curve-size');
    $curveSizeInput.on('change', function() {
        var $this = $(this);
        var val = $this.val();

        settings.tileSize = Number(val);
        setTileSizes();
    });

    var $lineLengthInput = $('#line-length');
    $lineLengthInput.on('change', function() {
        var $this = $(this);
        var val = $this.val();

        settings.lineLength = val;
    });


    var $drawManyBtn = $('#draw-many');
    $drawManyBtn.on('click', drawManyLines);

    var $lineCountInput = $('#line-count');
    $lineCountInput.on('change', function() {
        var $this = $(this);
        var val = $this.val();

        settings.lineCount = val;
    });

    var $clearCanvasBtn = $('#clear-canvas');
    $clearCanvasBtn.on('click', clearCanvas);

    var $addStrokeBtn = $('#add-stroke');
    $addStrokeBtn.on('click', addStroke);

    // wrapper for the picker
    var $bgColorPickerHolder = $('#bg-color-colorpicker');
    // hide it
    $bgColorPickerHolder.hide();
    // the input
    var $bgColorInput = $('#bg-color');
    // make the picker widget
    var $bgColorPicker = $.farbtastic( $bgColorPickerHolder, function(color) {
        // set the bg color and text color (based on how dark it is)
        $bgColorInput.css({
            backgroundColor : color,
            color : this.hsl[2] > 0.5 ? '#000' : '#fff'
        });
        // set the input value to the color
        $bgColorInput.val(color);
        // set the settings bg color to color
        settings.bgColor = color;
        // set the bg shape's bg color
        bgRect.attr({
            fill : color
        });
    });
    // set the picker color to the bg color
    $bgColorPicker.setColor(settings.bgColor);
    // on focus/blur show and hide
    $bgColorInput.on('focus', function() {
        $bgColorPickerHolder.show();
    }).on('blur', function() {
        $bgColorPickerHolder.hide();
    });


    // var $colorPickers = $('[data-color-picker');

    // $colorPickers.each(function() {
    //     var $input = $(this);

    //     var $colorPicker = $.farbtastic( $('#bg-color-colorpicker'), function(color) {

    //         $input.css({
    //             backgroundColor : color,
    //             color : this.hsl[2] > 0.5 ? '#000' : '#fff'
    //         });
    //         $input.val(color);
    //     })

    //     $colorPicker.setColor(bgColor);

    // });


}

// ------------------------------------------------------------------------- //
// Init
// ------------------------------------------------------------------------- //

function init() {
    onResize();
    createGUI();
    drawBg();
    // drawManyLines();
    bindEventsGlobal();
    createController();
    modes.draw.on();
}

init();