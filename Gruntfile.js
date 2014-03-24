module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // don't watch node_modules
    // used in watch files below
    var excludes = [
        '!**/node_modules/**'
    ];

    grunt.initConfig({

        connect: {
            server: {
                options: {
                    port: 9001,
                    // open a browser
                    open : true,
                    // inject livereload.js into the pages
                    livereload : true
                }
            }
        },

        sass: {
            compile: {
                options: {
                    // expanded for dev
                    style: 'expanded',
                    // compressed for prod
                    // style: 'compressed',
                    // if you're using compass
                    compass : true,
                    // line numbers of scss in the css for debugging
                    // lineNumbers : true,
                    // set up sourcemaps, requires SASS 3.3 and Compass 1.0alpha?
                    sourcemap : true
                },
                files: {
                    // list your css and corresponding scss pages here
                    // I usually just import all partials into style.scss
                    'css/style.css' : 'sass/style.scss'
                }
            }
        },

        watch : {
            options: {
                livereload: true
            },
            // make a subtask for each filetype to selectively run tasks and livereload
            html: {
                files: [
                    '**/*.html',
                    excludes[0]
                ]
            },
            js: {
                files: [
                    '**/*.js',
                    excludes[0]
                ]
            },
            css: {
                files: [
                    'css/*.css',
                    excludes[0]
                ]
            },
            // don't livereload sass because we livereload the css
            sass: {
                options: {
                    livereload: false
                },
                files: [
                    'sass/*.scss',
                    excludes[0]
                ],
                // compile on change
                tasks: ['sass']
            }
        }

    });

    // Default task(s).
    grunt.registerTask('default', [
        'connect',
        'watch'
    ]);

};