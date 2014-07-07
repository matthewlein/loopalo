requirejs.config({
    baseUrl: '/js',
    // probably not needed
    waitSeconds: 45,
    paths: {
        // plugins
        'jquery' : 'lib/jquery-2.1.0.min',
        'snap' : 'lib/snap.svg-min',
        'colorpicker' : 'lib/farbtastic',
        'sortable' : 'lib/jquery.sortable',
        'animationDuration' : 'lib/jquery.animationDuration',
        'FileSaver' : 'lib/FileSaver',
        'localforage' : 'lib/localforage',
        'underscore' : 'lib/underscore-min',
        // modules
        'canvas' : 'modules/canvas',
        'controls' : 'modules/controls',
        'menu' : 'modules/menu',
        'Line' : 'modules/Line',
        'globals' : 'modules/globals',
    },
    shim : {
        // jquery plugins
        'colorpicker' : ['jquery'],
        'sortable' : ['jquery'],
        'animationDuration' : ['jquery'],
        // non AMD
        'snap' : {
            exports: 'Snap'
        },
        'underscore': {
            exports: '_'
        },
        'FileSaver' : {
            exports: 'saveAs'
        }
    }
});



// Start the main app logic.
define('main', function(require) {

    require('canvas');
    require('controls');
    require('menu');

});