define('canvas', function(require) {

    // test
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
    var $body = $('body');

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
        updatePub();
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

        $body.on('contoller:clearCanvas', clearCanvas);
    }

    // ------------------------------------------------------------------------- //
    // Init
    // ------------------------------------------------------------------------- //

    function init() {
        drawBg();
        bindEventsGlobal();
        onResize();
    }

    init();

    // ------------------------------------------------------------------------- //
    // Return
    // ------------------------------------------------------------------------- //

    var pub = {
        canvas : canvas,
        svgWrapper : svgWrapper,
        $svgWrapper : $svgWrapper,
        setTileSizes : setTileSizes,
        bgRect : bgRect,
        cWidth : cWidth,
        cHeight : cHeight,
        halfTile : halfTile,
        tilesX : tilesX,
        tilesY : tilesY
    };

    function updatePub() {
        if ( !pub ) {
            return;
        }
        pub.cWidth = cWidth;
        pub.cHeight = cHeight;
        pub.halfTile = halfTile;
        pub.tilesX = tilesX;
        pub.tilesY = tilesY;
    }

    return pub;


});