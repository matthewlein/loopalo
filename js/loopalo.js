/* global Modernizr */
/* global Snap */


// ------------------------------------------------------------------------- //
// Helpers
// ------------------------------------------------------------------------- //

function randomRange(low, high) {
    return Math.floor( Math.random() * (1 + high - low) ) + low;
}

function invertColor(color) {

    var RGB = Snap.getRGB(color);

    var invertRGB = 'rgb(' + (255 - RGB.r) + ',' + (255 - RGB.g) + ',' + (255 - RGB.b) + ')';

    return invertRGB;

}

// ------------------------------------------------------------------------- //
// App vars
// ------------------------------------------------------------------------- //

var body = window.document.body;
var canvas = Snap('#svg');
var svgWrapper = document.getElementById('svg-wrapper');
var $svgWrapper = $(svgWrapper);

canvas.attr({
    width : '100%',
    height : '100%',
    // required stuff for saving files
    version : '1.1',
    xmlns : 'http://www.w3.org/2000/svg'
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
    // line opacity
    opacity : 100,
    // page bg color
    bgColor : '#f3f5df',
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

            // store for inverting
            this.path._color = stroke.color;
            this.path._colorInvert = invertColor(stroke.color);

            pathSpeed = pathLength / drawSpeed;

            animatePath(this.path, pathSpeed);
            // add to the group
            this.group.add(this.path);

        }
    }

    // set opacity on group so it works right
    if ( settings.opacity < 100 ) {
        this.group.attr('opacity', (settings.opacity/100) );
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


// ------------------------------------------------------------------------- //
// Filters
// ------------------------------------------------------------------------- //

// var filters = {
//     // invert filter
//     invert : canvas.filter( Snap.filter.invert(1) )
// };
// set to object bounding box for no clipping
// huge sizes are the only way to know if it will work
// filters.invert.attr({
//     filterUnits : 'objectBoundingBox',
//     x : '-300%',
//     y : '-300%',
//     width : '600%',
//     height : '600%'
// });

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

    function on() {
        bindEvents();
        $svgWrapper.addClass('mode--draw');
    }
    function off() {
        unbindEvents();
        $svgWrapper.removeClass('mode--draw');
    }

    // Return
    return {
        on : on,
        off : off
    };

})();

//
// Move mode
//
modes.move = (function() {

    function onGroupOverMove() {

        var paths = this.selectAll('path');

        $.each(paths, function(index, path) {
            path.attr( 'stroke', path._colorInvert );
        });

    }
    function onGroupOutMove() {

        var paths = this.selectAll('path');

        $.each(paths, function(index, path) {
            path.attr( 'stroke', path._color );
        });
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
            group.undrag();
        });
    }

    function on() {
        $svgWrapper.addClass('mode--move');
        bindEvents();
    }
    function off() {
        $svgWrapper.removeClass('mode--move');
        unbindEvents();
    }

    return {
        on : on,
        off : off
    };

})();

//
// Erase mode
//
modes.erase = (function() {

    function onGroupOverErase() {
        var paths = this.selectAll('path');

        $.each(paths, function(index, path) {
            path.attr( 'stroke', path._colorInvert );
        });
    }
    function onGroupOutErase() {
        var paths = this.selectAll('path');

        $.each(paths, function(index, path) {
            path.attr( 'stroke', path._color );
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

    function on() {
        $svgWrapper.addClass('mode--erase');
        bindEvents();
    }
    function off() {
        $svgWrapper.removeClass('mode--erase');
        unbindEvents();
    }

    return {
        on : on,
        off : off
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

var $modeBtns;
var $bgColorPicker;

function controller() {

    // menu button
    var $menu = $('#menu');
    var $menuBtn = $('#menu-button');
    $menuBtn.on('click', function() {
        $menuBtn.toggleClass('button--active');
        $menu.toggleClass('menu--open');
    });

    // Maybe move onModeChange into here?

    // mode buttons
    $modeBtns = $('[data-mode]');
    $modeBtns.on('mousedown', changeMode);

    // curve size field
    var $curveSizeInput = $('#curve-size');
    $curveSizeInput.val(settings.tileSize);
    $curveSizeInput.on('change', function() {
        var $this = $(this);
        var val = $this.val();

        settings.tileSize = Number(val);
        setTileSizes();
    });

    // line length field
    var $lineLengthInput = $('#line-length');
    $lineLengthInput.val(settings.lineLength);
    $lineLengthInput.on('change', function() {
        var $this = $(this);
        var val = $this.val();

        settings.lineLength = val;
    });

    // draw many lines button
    var $drawManyBtn = $('#draw-many');
    $drawManyBtn.on('click', drawManyLines);

    // line count field
    var $lineCountInput = $('#line-count');
    $lineCountInput.val(settings.lineCount);
    $lineCountInput.on('change', function() {
        var $this = $(this);
        var val = $this.val();

        settings.lineCount = val;
    });

    // opacity slider field
    var $opacityRange = $('#line-opacity');
    var $opacityInput = $('#line-opacity-input');
    $opacityRange.val(settings.opacity);
    $opacityInput.val(settings.opacity);
    $opacityRange.on('input change', function() {
        var $this = $(this);
        var val = $this.val();
        $opacityInput.val(val);
        settings.opacity = val;
    });
    $opacityInput.on('change', function() {
        var $this = $(this);
        var val = $this.val();
        $opacityRange.val(val);
    });



    // clear canvas
    var $clearCanvasBtn = $('#clear-canvas');
    $clearCanvasBtn.on('click', clearCanvas);

    // add stroke button
    var $addStrokeBtn = $('#add-stroke');
    $addStrokeBtn.on('click', addStroke);

    // shift up/down for 10 increment
    $('.controller').on('keydown','input[type="number"]', function(event) {

        var $this = $(this);

        var key = event.which;
        // shift key jump by 10
        var step = this.step || 1;
        var increment = event.shiftKey ? ( step * 10 ) : step;

        if (key === 38 || key === 40) {
            // only prevent on these keys
            event.preventDefault();
            // if key is up, positive, otherwise its down and go negative
            increment = (key === 38) ? increment : -(increment);
            var num = Number( $this.val() ) + increment;

            // make sure its not below min or above max
            var min = Number( $this.attr('min') );
            var max = Number( $this.attr('max') );
            if ( !!$this.attr('min') && num < min) {
                num = min;
            } else if ( !!$this.attr('min') && num > max ) {
                num = max;
            }
            $this.val( num );
        }

        // trigger change to update settings
        $this.trigger('change');

    });




    //
    // Color Pickers
    //

    // wrapper for the picker
    var $bgColorPickerHolder = $('#bg-color-colorpicker');
    // hide it
    $bgColorPickerHolder.hide();
    // the input
    var $bgColorInput = $('#bg-color');
    // make the picker widget
    $bgColorPicker = $.farbtastic( $bgColorPickerHolder, function(color) {
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


    // make strokes
    _.each(settings.strokes, function(stroke, index) {
        makeStrokeHTML(stroke);
    });

}


//
// Strokes
//

var $strokeList = $('#strokes-list');

// remakes the strokes array
function rebuildStrokeSettings() {

    settings.strokes = [];

    $strokeList.children('.stroke').each(function(index) {
        var $this = $(this);
        var color = $this.find('[data-stroke-color]').data('strokeColor');
        var width = $this.find('[data-stroke-width]').data('strokeWidth');
        var cap = $this.find('[data-stroke-cap]').data('strokeCap');

        // casting
        width = Number(width);

        settings.strokes[index] = {
            color : color,
            width : width,
            cap : cap
        };

    });
}



var strokeTemplate = [
    '<li class="stroke">',
        '<div class="colorpicker-holder" data-color-picker></div>',
        '<input type="text" class="stroke-color input--color" value="{{color}}" data-stroke-color="{{color}}">',
        '<input type="number" class="stroke-width" value="{{width}}" data-stroke-width="{{width}}">',
        '<select name="" id="" class="stroke-cap" data-stroke-cap="{{cap}}">',
            '<option value="round">Round</option>',
            '<option value="square">Square</option>',
            '<option value="butt">Butt</option>',
        '</select>',
        '<button class="stroke-delete" data-stroke-delete>x</button>',
    '</li>'
// join with newline or no??? hmmm
].join('\n');

function addStroke() {

    var maxWidthStroke = _.max( settings.strokes, function(stroke) {
        return stroke.width;
    });

    var maxWidth = maxWidthStroke.width;

    var newStrokeIndex = settings.strokes.length;

    settings.strokes.push({
        color : '#000000',
        width : maxWidth + 5,
        cap : 'round'
    });

    var newStroke = settings.strokes[newStrokeIndex];

    makeStrokeHTML(newStroke);

}

function makeStrokeHTML(stroke) {

    var width = stroke.width;
    var color = stroke.color;
    var cap = stroke.cap;

    // replace placeholders
    var strokeHTML = strokeTemplate.replace(new RegExp('{{color}}', 'g' ) , color)
                                   .replace(new RegExp('{{width}}', 'g' ), width)
                                   .replace(new RegExp('{{cap}}', 'g' ), cap);

    // make the HTML findable
    var $strokeHTML = $(strokeHTML);
    // select the correct option
    $strokeHTML.find('option[value="' + cap + '"]').prop('selected', true);


    // wrapper for the picker
    var $colorPickerHolder = $strokeHTML.find('[data-color-picker]');
    // hide it
    $colorPickerHolder.hide();
    // find the input
    var $colorInput = $strokeHTML.find('[data-stroke-color]');
    // make the picker widget
    var $colorPicker = $.farbtastic( $colorPickerHolder, function(color) {
        // set the bg color and text color (based on how dark it is)
        $colorInput.css({
            backgroundColor : color,
            color : this.hsl[2] > 0.5 ? '#000' : '#fff'
        });
        // set the input value to the color
        $colorInput.val(color);
        $colorInput.trigger('change');
    });
    // set the picker color to the stroke color
    $colorPicker.setColor(color);
    // on focus/blur show and hide
    $colorInput.on('focus', function() {
        $colorPickerHolder.show();
    }).on('blur', function() {
        $colorPickerHolder.hide();
    });

    // delete button
    var $deleteStroke = $strokeHTML.find('[data-stroke-delete]');
    $deleteStroke.on('click', function() {
        if ( $('#strokes-list').children().length > 1 ) {
            $strokeHTML.remove();
            rebuildStrokeSettings();
        }
    });

    //
    // Change events update data
    //

    $strokeHTML.on('change keyup', function(event) {

        var $this = $(this);

        var width = $this.find('[data-stroke-width]').val();
        var cap = $this.find('[data-stroke-cap] > :selected').val();
        var color = $this.find('[data-stroke-color]').val();

        $this.find('[data-stroke-color]').data('strokeColor', color);
        $this.find('[data-stroke-width]').data('strokeWidth', width);
        $this.find('[data-stroke-cap]').data('strokeCap', cap);

        rebuildStrokeSettings();

    });

    $strokeList.append($strokeHTML);
}


function updateSettingsUI() {

    // curve size field
    var $curveSizeInput = $('#curve-size');
    $curveSizeInput.val(settings.tileSize);

    // line length field
    var $lineLengthInput = $('#line-length');
    $lineLengthInput.val(settings.lineLength);

    // line count field
    var $lineCountInput = $('#line-count');
    $lineCountInput.val(settings.lineCount);

    // opacity slider field
    var $opacityRange = $('#line-opacity');
    var $opacityInput = $('#line-opacity-input');
    $opacityRange.val(settings.opacity);
    $opacityInput.val(settings.opacity);

    // Color Picker
    $bgColorPicker.setColor(settings.bgColor);

    // clear strokes
    $strokeList.children().remove();

    // make strokes
    _.each(settings.strokes, function(stroke, index) {
        makeStrokeHTML(stroke);
    });

}

//
// Menu
//

function menu() {

    var $exportBtn = $('#export-button');
    $exportBtn.on( 'click', exportSVG );

    // stores the saved
    var savedSettings = [];
    var $savedSettingsUI = $('#settings-list');
    // stored index of currently selected item
    var selectedIndex;

    //
    // Setup
    //
    function getSavedSettings() {
        localforage.getItem('savedSettings', function(data) {
            if (!!data) {
                savedSettings = data;
            }
            buildSettingsUI();
        });
    }
    function buildSettingsUI() {
        $.each(savedSettings, function(index, item) {
            var $li = $('<li class="settings-list__item">' + item.name + '</li>');
            $li.data('name', item.name);
            $savedSettingsUI.append($li);
        });
        $savedSettingsUI.on('click', 'li', function() {
            var $this = $(this);

            // deal with classes
            var selectedClass = 'settings-list__item--active';
            $this.siblings().removeClass(selectedClass);
            $this.addClass(selectedClass);
            $loadSettingsBtn.prop('disabled', false);
            $deleteSettingsBtn.prop('disabled', false);

            // set index
            selectedIndex = $this.index();
        });
    }
    getSavedSettings();

    // clearing the selection
    function clearSettingSelection() {
        selectedIndex = null;
        $savedSettingsUI.children().removeClass('settings-list__item--active');
        $loadSettingsBtn.prop('disabled', true);
        $deleteSettingsBtn.prop('disabled', true);
    }

    //
    // Save
    //
    var $saveSettingsBtn = $('#save-settings');
    $saveSettingsBtn.on('click', saveSettings);

    function saveSettings() {

        var name = prompt('Name:');

        savedSettings.push({
            name : name,
            settings : settings
        });
        localforage.setItem('savedSettings', savedSettings, function(){
            var $li = $('<li class="settings-list__item">' + name + '</li>');
            $li.data('name', name);
            $savedSettingsUI.append($li);
            clearSettingSelection();
        });
    }

    //
    // Load
    //
    var $loadSettingsBtn = $('#load-settings');
    $loadSettingsBtn.prop('disabled', true);
    $loadSettingsBtn.on('click', loadSettings);

    function loadSettings() {
        // get from storage
        localforage.getItem('savedSettings', function(data) {
            // set new settings
            settings = data[selectedIndex].settings;
            // update the controller
            updateSettingsUI();
            clearSettingSelection();
        });
    }

    //
    // Delete
    //

    var $deleteSettingsBtn = $('#delete-settings');
    $deleteSettingsBtn.prop('disabled', true);
    $deleteSettingsBtn.on('click', deleteSettings);

    function deleteSettings() {

        // remove the settings from the array
        savedSettings.splice(selectedIndex, 1);

        // save the changed settings array
        localforage.setItem('savedSettings', savedSettings, function(){
            // remove the UI element
            $savedSettingsUI.children().eq(selectedIndex).remove();
            clearSettingSelection();
        })

    }

    //
    // Clear
    //
    var $clearSettingsBtn = $('#clear-settings');
    $clearSettingsBtn.on('click', clearSettings);

    function clearSettings() {
        localforage.setItem('savedSettings', null, function() {
            // remove UI list
            $savedSettingsUI.children().remove();
            clearSettingSelection();
            // settings list is empty
            savedSettings = [];
        })
    }

}

function exportSVG() {

    var SVGstring = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + (new XMLSerializer).serializeToString(canvas.node);

    // uses FileSaver script
    saveAs(
        new Blob(
            [SVGstring],
            {type: 'image/svg+xml;charset=' + document.characterSet}
        ), 'loopalo' + Date.now() + '.svg'
    );
}

// ------------------------------------------------------------------------- //
// Init
// ------------------------------------------------------------------------- //

function init() {
    onResize();
    drawBg();
    // drawManyLines();
    bindEventsGlobal();
    controller();
    menu();
    modes.draw.on();
}

init();
