module.exports = function(grunt) {

    require('time-grunt')(grunt);

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // don't watch node_modules
    // used in watch files below
    var excludes = [
        '!**/node_modules/**'
    ];

    grunt.initConfig({

        // add excludes to the grunt object
        excludes : excludes,

        // deletes dist/
        clean : ['dist/'],

        // copies fresh clean clean into dist/
        copy : {
            all : {
                files : [
                    {
                        expand : true,
                        src : ['css/**', 'img/**', 'js/**', 'fonts/**', 'index.html', '.htaccess'],
                        dest : 'dist/'
                    }
                ]
            }
        },

        requirejs : {
            prod : {
                options : {
                    baseUrl: 'dist/js',
                    mainConfigFile: 'dist/js/main.js',
                    name: 'almond',
                    include: 'main',
                    insertRequire : ['main'],
                    out: 'dist/js/main.<%= grunt.config.get("now") %>.js'
                }
            }
        },

        // process the index page
        processhtml : {
            options : {
                data : {
                    now : '<%= grunt.config.get("now") %>'
                }
            },
            prod : {
                files: {
                    'dist/index.html': ['dist/index.html']
                }
            },
        },


        // stores secrets off source control
        superSecrets: grunt.file.readJSON('superSecrets.json'),

        // upload to prod
        rsync : {
            prod : {
                options: {
                    src: 'dist/',
                    dest: 'httpdocs/',
                    host:'<%= superSecrets.host %>',
                    syncDestIgnoreExcl: true,
                    recursive: true
                }
            }
        },

        // local server
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

        // compile sass
        sass: {
            compile: {
                options: {
                    // expanded for dev
                    style: 'expanded',
                    // compressed for prod
                    // style: 'compressed',
                    // if you're using compass
                    compass : true,
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

        // watch files
        watch : {
            options: {
                // spawn: false,
                livereload: true
            },
            // make a subtask for each filetype to selectively run tasks and livereload
            html: {
                files: [
                    '**/*.html',
                    '<%= excludes %>'
                ]
            },
            js: {
                files: [
                    '**/*.js',
                    '<%= excludes %>'
                ]
            },
            css: {
                files: [
                    'css/*.css',
                    '<%= excludes %>'
                ]
            },
            // don't livereload sass because we livereload the css
            sass: {
                options: {
                    livereload: false
                },
                files: [
                    'sass/*.scss',
                    '<%= excludes %>'
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


    grunt.registerTask('build', [], function() {
        grunt.loadNpmTasks('grunt-contrib-requirejs');
        grunt.loadNpmTasks('grunt-processhtml');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-contrib-clean');

        // set now variable for script versioning
        grunt.config.set('now', grunt.template.today('yyyy-mm-dd-HH.MM.ss') );
        grunt.task.run('clean', 'copy', 'requirejs', 'processhtml');
    });


    grunt.registerTask('copee', [], function() {
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.task.run('clean', 'copy');
    });

    // publish live
    grunt.registerTask('publish', [], function() {
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-contrib-requirejs');
        grunt.loadNpmTasks('grunt-processhtml');
        grunt.loadNpmTasks('grunt-rsync');

        // set now variable for script versioning
        grunt.config.set('now', grunt.template.today('yyyy-mm-dd-HH.MM.ss') );

        grunt.task.run('copy', 'requirejs', 'processhtml', 'rsync', 'clean');
    });

};