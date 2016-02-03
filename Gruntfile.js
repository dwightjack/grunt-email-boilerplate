/*jshint node:true */
module.exports = function(grunt) {
    'use strict';

    var path = require('path');
    var transports = grunt.file.exists('config/nodemailer-transport.json') ? grunt.file.readJSON('config/nodemailer-transport.json') : {};
    var litmusConf = grunt.file.exists('config/litmus.json') ? grunt.file.readJSON('config/litmus.json') : {};
    var hostsConf = grunt.file.exists('config/hosts.json') ? grunt.file.readJSON('config/hosts.json') : {};

    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        /* rigt now this is useless... */
        meta: {
            banner: ''
        },

        /**
         * Project Paths Configuration
         * ===============================
         */
        paths: {
            //where to store built files
            dist: 'dist',
            //sources
            src: 'src',
            //where json files are stored
            data: '<%= paths.src %>/data',
            //temporary files
            tmp: 'tmp',
            //pattern to HTML email files
            email: '*.html'
        },


        /**
         * Hosts Configuration
         * ===============================
         */
        hosts: hostsConf,


        /**
         * Cleanup Tasks (used internally)
         * ===============================
         */
        clean: {
            all: ['dist*', '<%= paths.tmp %>']
        },


        /**
         * Copy image files Tasks (used internally)
         * ===============================
         */
        copy: {
            images: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.src %>/images',
                    src: ['**/*.{gif,png,jpg}'],
                    dest: '<%= paths.tmp %>/images'
                }]
            },

            images_dist: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.src %>/images',
                    src: ['**/*.{gif,png,jpg}'],
                    dest: '<%= paths.dist %>/images'
                }]
            }

        },


        /**
         * SCSS Compilation Tasks (used internally)
         * ===============================
         */
        compass: {

            options: {
                //default options for development and watch environment
                //accepts some compass command line option
                //see https://github.com/gruntjs/grunt-contrib-compass
                config: path.normalize(__dirname + '/vendor/compass-config.rb'),
                cssDir: '<%= paths.tmp %>/css',
                imagesDir: '<%= paths.tmp %>/images',
                bundleExec: grunt.file.exists(path.normalize(process.cwd() + 'Gemfile'))
            },

            watch: {
                options: {
                    watch: true
                }
            },

            dev: {},

            dist: {
                options: {
                    cssDir: '<%= paths.dist %>/css',
                    imagesDir: '<%= paths.dist %>/images',
                    force: true,
                    environment: 'production'
                }
            }
        },


        /**
         * Static EJS Render Tasks (used internally)
         * ===============================
         */
        render: {
            options: {
                data: ['<%= paths.data %>/*.json'],
            },

            html: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.src %>/',
                    src: ['<%= paths.email %>'],
                    dest: '<%= paths.tmp %>/'
                }]
            }
        },

        /**
         * Environment Related Tasks (used internally)
         * FIXME: DEPRECATED
         * ===============================
         */
        /*preprocess: {
            options: {
                inline: true
            },
            dev: {
                src: ['<%= paths.tmp %>/<%= paths.email %>']
            },
            dist: {
                options: {
                    context: {
                        PRODUCTION: true
                    }
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.tmp %>/',
                    src: ['<%= paths.email %>'],
                    dest: '<%= paths.tmp %>/'
                }]
            }
        },*/


        /**
         * Section comment block
         * ===============================
         */
        htmlrefs: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.tmp %>/',
                    src: ['<%= paths.email %>'],
                    dest: '<%= paths.tmp %>/'
                }]
            }
        },



        /**
         * Premailer Parser Tasks (used internally)
         * ===============================
         */
        premailer: {
            options: {
                preserveStyles: true
            },

            dist_html: {
                options: {
                    //see https://github.com/dwightjack/grunt-premailer#options
                    //css is used to be sure that external CSS files are parsed
                    css: ['<%= paths.dist %>/css/*.css'],
                    baseUrl: '<%= hosts.production.url %>/',
                    preserveStyles: false
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.tmp %>/',
                    src: ['<%= paths.email %>'],
                    dest: '<%= paths.dist %>/'
                }]

            },
            dist_txt: {
                options: {
                    baseUrl: '<%= hosts.production.url %>/',
                    mode: 'txt'
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.tmp %>/',
                    src: ['<%= paths.email %>'],
                    dest: '<%= paths.dist %>/',
                    ext: '.txt'
                }]

            },

            dev_html: {
                options: {
                    css: ['<%= paths.tmp %>/css/*.css'],
                    baseUrl: '<%= hosts.development.url %>:<%= hosts.development.port %>/'
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.tmp %>/',
                    src: ['<%= paths.email %>'],
                    dest: '<%= paths.tmp %>/',
                    //need this since nokogiri breaks when src and dest are the same file
                    rename: function (src, dest) {
                        return '<%= paths.tmp %>/parsed-' + dest;
                    }
                }]
            },
            dev_txt: {
                options: {
                    baseUrl: '<%= hosts.development.url %>:<%= hosts.development.port %>/',
                    mode: 'txt'
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.tmp %>/',
                    src: ['<%= paths.email %>'],
                    dest: '<%= paths.tmp %>/',
                    ext: '.txt',
                    //need this since nokogiri breaks when src and dest are the same file
                    rename: function (src, dest) {
                        return '<%= paths.tmp %>/parsed-' + dest;
                    }
                }]
            }
        },



        /**
         * Images Optimization Tasks (used internally)
         * ===============================
         */
        imagemin: {
            options: {
                progressive: false
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.dist %>/images',
                    src: ['**/*.{gif,png,jpg}'],
                    dest: '<%= paths.dist %>/images'
                }]
            }
        },


        htmlmin: {
            dist: {
                options: {
                    keepClosingSlash: true,
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    minifyCSS: {
                        noAdvanced: true,
                        compatibility: 'ie8'
                    }
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.dist %>/',
                    src: ['<%= paths.email %>'],
                    dest: '<%= paths.dist %>/'
                }]
            }
        },


        /**
         * Test Mailer Tasks (used internally)
         * ===============================
         */
        nodemailer: {

            options: {

                /**
                 * Defaults to sendmail
                 * You may create a transport configuration file under `config` folder.
                 * (ie: `config/nodemailer-transport.json`)
                 * @see https://github.com/andris9/Nodemailer
                 *
                 * Here follows a Gmail SMTP example:
                 * {
                 *  "type": "SMTP",
                 *  "options": {
                 *      "service": "Gmail",
                 *      "auth": {
                 *          "user": "john.doe@gmail.com",
                 *          "pass": "password"
                 *      }
                 *  }
                 * }
                 */
                /* ,*/
                transport: transports,

                message: {
                    from: '<John Doe> john.doe@gmail.com'
                },


                // HTML and TXT email
                // A collection of recipients
                recipients: [{
                    email: 'marco.solazzi@gmail.com',
                    name: 'Jane Doe'
                }]
            },

            dist: {
                src: ['<%= paths.dist %>/<%= paths.email %>']
            },

            dev: {
                src: ['<%= paths.tmp %>/parsed-<%= paths.email %>']
            }

        },


        /**
         * Watch Tasks (used internally)
         * ===============================
         */
        watch: {
            html: {
                files: ['<%= paths.src %>/<%= paths.email %>', '<%= paths.src %>/inc/**/*.html', '<%= paths.data %>'],
                tasks: ['render']
            },
            images: {
                files: ['<%= paths.src %>/images/**/*.{gif,png,jpg}'],
                tasks: ['copy:images']
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: [
                    '<%= paths.tmp %>/css/**/*.css',
                    '<%= paths.tmp %>/<%= paths.email %>',
                    '<%= paths.tmp %>/images/**/*.{gif,png,jpg}'
                ]
            }
        },


        /**
         * Concurrent Task (used internally)
         * ===============================
         */
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            dev: ['watch', 'compass:watch']
        },


        /**
         * Server Tasks (used internally)
         * ===============================
         */
        connect: {

            options: {
                hostname: '*',
                port: '<%= hosts.development.port %>',
                open: '<%= hosts.development.url %>:<%= hosts.development.port %>/',
                base: ['<%= paths.tmp %>']
            },

            dev: {
                options: {
                    livereload: true
                }
            },

            send_dev: {
                options: {
                    //keep the server on
                    keepalive: true
                }
            }

        },


        /**
         * Remote testing
         * ===============================
         */
        litmus: {
            options: litmusConf,
            dist: {
                options: {
                    //checkout https://yourprofilekey.litmus.com/emails/clients.xml
                    //for client list
                    //see https://github.com/jeremypeter/grunt-litmus for details
                    clients: ['iphone5s', 'chromegmailnew']
                },
                src: ['<%= paths.dist %>/<%= paths.email %>']
            }
        },


        /**
         * Deploy via FTP
         * ===============================
         */
        rsync: {
            options: {
                recursive: true,
                compareMode: 'checksum',
                syncDestIgnoreExcl: true,
                args: ['--verbose', '--progress', '--cvs-exclude'],
            },

            dist: {
                options: {
                    src: '<%= paths.dist %>/',
                    dest: '<%= hosts.production.path %>',
                    host: '<%= hosts.production.username %>@<%= hosts.production.host %>'
                }
            }
        },


        /**
         * Deploy via rsync
         * ===============================
         */
        'ftp-deploy': {
            dist: {
                auth: {
                    host: '<%= hosts.production.host %>',
                    port: 21,
                    username: '<%= hosts.production.username %>',
                    password: '<%= hosts.production.password %>',
                    authKey: false
                },
                src: '<%= paths.dist %>',
                dest: '<%= hosts.production.path %>'
            }
        }
    });

    grunt.registerTask('default', 'dev');

    //(used internally)
    grunt.registerTask('base_dev', [
        'clean',
        'copy:images',
        'compass:dev',
        'render'
    ]);


    grunt.registerTask('dev', [
        'base_dev',
        'connect:dev',
        'concurrent'
    ]);


    grunt.registerTask('dist', [
        'clean',
        'copy:images_dist',
        'imagemin',
        'compass:dist',
        'render',
        'htmlrefs:dist',
        'premailer:dist_html',
        'premailer:dist_txt',
        'htmlmin:dist'
    ]);

    grunt.registerTask('send', 'Simulates an email delivery.', function(target) {
        if (Object.keys(transports).length === 0) {
            grunt.fail.fatal('You need to setup nodemailer transport by adding/editing config/nodemailer-transport.json');
        }
        if (target === 'dist') {
            grunt.task.run(['deploy', 'nodemailer:dist']);
        } else {
            grunt.task.run([
                'base_dev',
                'premailer:dev_html',
                'premailer:dev_txt',
                'nodemailer:dev',
                'connect:send_dev'
            ]);
        }
    });

    grunt.registerTask('ftp', 'ftp-deploy alias', function (target) {
        grunt.task.run(['ftp-deploy', target].filter(Boolean).join(':'));
    });


    grunt.registerTask('deploy', 'Deploy compiled email to remote host.', function() {
        var deployTask = grunt.config.get('hosts.production.deploy');
        var taskList = ['dist'];
        if (!deployTask) {
            grunt.fail.fatal('No deploy method found. Did you configured your config/hosts.json?');
        }
        if (['ftp', 'rsync', 'none'].indexOf(deployTask) === -1) {
            grunt.fail.fatal('Deploy methods may be either "ftp", "rsync" or "none". "' + deployTask + '" was passed in.');
        }
        if (deployTask !== 'none') {
            taskList.push(deployTask + ':dist');
        }
        grunt.task.run(taskList);

    });

    grunt.registerTask('test', 'Production email testing', function () {
        if (Object.keys(litmusConf).length === 0) {
            grunt.fail.fatal('You need to setup your Litmus account details by adding/editing config/litmus.json');
        }
        grunt.task.run(['deploy', 'litmus:dist']);
    });

};
