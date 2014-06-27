define('globals', function(require) {

    'use strict';

    var globals = {};

    // ------------------------------------------------------------------------- //
    // Helper fns
    // ------------------------------------------------------------------------- //

    globals.randomRange = function(low, high) {
        return Math.floor( Math.random() * (1 + high - low) ) + low;
    }

    // ------------------------------------------------------------------------- //
    // Vars
    // ------------------------------------------------------------------------- //

    // the document state
    globals.doc = {
        // starting mode
        mode : 'draw',
        // page bg color
        bgColor : '#f3f5df',
    };

    globals.settings = {
        // number of lines drawn
        lineCount : 30,
        // how long each line is
        lineLength : 70,
        // how big are loops and straights
        tileSize : 96,
        // line opacity
        opacity : 100,
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


    return globals;


});