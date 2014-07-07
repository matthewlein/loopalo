({
    mainConfigFile: 'main.js',
    // base url for finding files
    baseUrl : './',
    // paths to named modules
    paths : {
        'main' : 'main',
    },

    // name of modules to process, using the path above
    name : 'main',
    // output name of the file
    out : 'main.build.js',

    // uglify settings
    uglify: {
        beautify: true,
        //Skip the processor.ast_mangle() part of the uglify call (r.js 2.0.5+)
        no_mangle: true
    },

    findNestedDependencies: true,
    // kill comments
    preserveLicenseComments: false
    // wrap in an IIFE
    // wrap: true,


})