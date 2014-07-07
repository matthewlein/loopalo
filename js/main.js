requirejs.config({
    baseUrl: '/js',
    waitSeconds: 45,
    paths: {
        // plugins
        'jquery' : 'lib/jquery-2.1.0.min',
        'snap' : 'lib/snap.svg',
        'colorpicker' : 'lib/farbtastic',
        'sortable' : 'lib/jquery.sortable',
        'FileSaver' : 'lib/FileSaver',
        'localforage' : 'lib/localforage',
        'underscore' : 'lib/underscore-min',
        // modules
        'canvas' : 'modules/canvas',
        'controls' : 'modules/controls',
        'menu' : 'modules/menu',
        'globals' : 'modules/globals',
    },
    shim : {
        // jquery plugins
        'colorpicker' : ['jquery'],
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