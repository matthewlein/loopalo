define('canvas', function(require) {

    'use strict';

    // ------------------------------------------------------------------------- //
    // Requires
    // ------------------------------------------------------------------------- //

    var Snap = require('snap');
    var $ = require('jquery');
    var _ = require('underscore');

    // ------------------------------------------------------------------------- //
    // App globals
    // ------------------------------------------------------------------------- //
    var globals = require('globals');

    // ------------------------------------------------------------------------- //
    // canvas vars
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

    //
    // set up tiles
    //
    var halfTile = globals.settings.tileSize/2;

    var tilesX = cWidth / globals.settings.tileSize;
    var tilesY = cHeight / globals.settings.tileSize;

    // ------------------------------------------------------------------------- //
    // Getting stuff
    // ------------------------------------------------------------------------- //

    // used to set new tile counts on resize and tileSize change
    function setTileSizes() {
        halfTile = globals.settings.tileSize / 2;
        tilesX = cWidth / globals.settings.tileSize;
        tilesY = cHeight / globals.settings.tileSize;
    }

    function invertColor(color) {

        var RGB = Snap.getRGB(color);
        var invertRGB = 'rgb(' + (255 - RGB.r) + ',' + (255 - RGB.g) + ',' + (255 - RGB.b) + ')';

        return invertRGB;

    }

    // ------------------------------------------------------------------------- //
    // Line
    // ------------------------------------------------------------------------- //

    function Line( opts ) {

        opts = opts || {};

        // griddy
        this.x = opts.x || ( globals.randomRange(0, tilesX) * globals.settings.tileSize );
        this.y = opts.y || ( globals.randomRange(0, tilesY) * globals.settings.tileSize );

        // griddy but kinda random
        // this.x = opts.x || globals.randomRange(0, cWidth);
        // this.y = opt.y || globals.randomRange(0, cHeight);

        this.dir = opts.dir || globals.randomRange(0, 3);
        this.steps = opts.steps || globals.settings.lineLength;

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

        var tileSize = globals.settings.tileSize;

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

        var nextMove = moves[ globals.randomRange( 0, moves.length - 1 ) ];

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
        for (var k = globals.settings.strokes.length - 1; k >= 0; k--) {
            stroke = globals.settings.strokes[k];

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
        if ( globals.settings.opacity < 100 ) {
            this.group.attr('opacity', (globals.settings.opacity/100) );
        }

    };


    // ------------------------------------------------------------------------- //
    // Line drawing
    // ------------------------------------------------------------------------- //

    // reference for the rectangle
    var bgRect;

    function drawBg() {
        // svg doesn't have a bg color, using rect instead
        bgRect = canvas.rect( 0, 0, '100%', '100%');
        bgRect.attr({
            fill : globals.doc.bgColor
        });
    }

    function clearCanvas() {
        // clear all
        canvas.clear();
        // draw bg
        drawBg();
    }

    // ------------------------------------------------------------------------- //
    // Events
    // ------------------------------------------------------------------------- //


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
    // Init
    // ------------------------------------------------------------------------- //

    function init() {
        onResize();
        drawBg();
        bindEventsGlobal();
    }

    init();

    // ------------------------------------------------------------------------- //
    // Return
    // ------------------------------------------------------------------------- //

    var pub = {
        canvas : canvas,
        svgWrapper : svgWrapper,
        $svgWrapper : $svgWrapper,
        clearCanvas : clearCanvas,
        bgRect : bgRect,
        cWidth : cWidth,
        cHeight : cHeight,
        Line : Line
    };

    return pub;


});