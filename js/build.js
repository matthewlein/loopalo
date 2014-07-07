({
    mainConfigFile: 'main.js',

    // base url for finding files
    baseUrl : './',

    // paths to named modules
    paths : {
        'main' : 'main',
        'almond' : 'almond'
    },

    // ------------------------------------------------------------------------- //
    // Almond build
    // ------------------------------------------------------------------------- //

    // name of modules to process, using the path above
    name : 'almond',
    include : 'main',
    // THIS MAKES THE MAIN MODULE EXECUTE!!!!
    // must be an array
    insertRequire: ['main'],
    // output name of the file
    out : 'main.build-almond.js',


    // ------------------------------------------------------------------------- //
    // RequireJS build
    // ------------------------------------------------------------------------- //

    /*
    // name of modules to process, using the path above
    name : 'main',
    out : 'main.build.js',
    insertRequire: ['main'],
    */

    // uglifies by default
    // uglify settings override
    // uglify: {
    //     beautify: true,
    //     //Skip the processor.ast_mangle() part of the uglify call (r.js 2.0.5+)
    //     no_mangle: true
    // },

    // looks deeper for deps
    findNestedDependencies: true,

    // kill comments
    preserveLicenseComments: false

    // wrap in an IIFE
    // wrap: true,


})