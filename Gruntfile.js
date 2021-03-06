module.exports = function(grunt) {

    require('time-grunt')(grunt);

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.initConfig({

        // stores secrets off source control
        superSecrets: grunt.file.readJSON('superSecrets.json'),

        // deletes dist/
        clean : ['dist/'],

        // copies fresh clean clean into dist/
        copy : {
            all : {
                files : [
                    {
                        expand : true,
                        src : [
                            'css/**',
                            'img/**',
                            '*.png',
                            'favicon.ico',
                            'browserconfig.xml',
                            'js/**',
                            'fonts/**',
                            'index.html',
                            '.htaccess'
                        ],
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
                    // this makes the modules run!
                    insertRequire : ['main'],
                    out: 'dist/js/main.js'
                    //out: 'dist/js/main.<%= grunt.config.get("now") %>.js'
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

        rev: {
            options: {
                // encoding: 'utf8',
                // algorithm: 'md5',
                // length: 8
            },
            assets: {
                files: [{
                    src: [
                        'dist/css/style.css',
                        'dist/fonts/**/*.{eot,svg,svgz,ttf,woff}',
                        'dist/img/**/*.{jpg,jpeg,gif,png,svg}',
                        'dist/js/main.js'
                    ]
                }]
            }
        },

        usemin: {
            html: ['dist/index.html'],
            css: ['dist/css/*.css'],
            options: {
                assetsDirs: ['dist/**'],
                patterns: {
                    // might be needed for ? fonts names? seems to work without it.
                    // css: [
                    //     [ /(?:src=|url\(\s*)['"]?([^'"\)\?#]+)['"]?\s*\)?/gm, 'Update the CSS to reference our revved images']
                    // ]
                }
            }
        },



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
            dev: {
                files: {
                    // list your css and corresponding scss pages here
                    // I usually just import all partials into style.scss
                    'css/style.css' : 'sass/style.scss'
                }
            },
            prod: {
                options: {
                    // compressed for prod
                    style: 'compressed',
                    sourcemap : false
                },
                files: {
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
                    'index.html'
                ]
            },
            js: {
                files: [
                    '**/*.js'
                ]
            },
            css: {
                files: [
                    'css/*.css'
                ]
            },
            // don't livereload sass because we livereload the css
            sass: {
                options: {
                    livereload: false
                },
                files: [
                    'sass/*.scss'
                ],
                // compile on change
                tasks: ['sass:dev']
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
        grunt.loadNpmTasks('grunt-rev');
        grunt.loadNpmTasks('grunt-usemin');

        grunt.task.run('clean', 'sass:prod', 'copy', 'requirejs', 'processhtml', 'rev', 'usemin');
    });


    grunt.registerTask('copee', [], function() {
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-contrib-clean');

        grunt.task.run('clean', 'copy');
    });

    // publish live
    grunt.registerTask('publish', [], function() {
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-rsync');

        grunt.task.run('build', 'rsync', 'clean');
    });

};
