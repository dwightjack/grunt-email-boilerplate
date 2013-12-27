/*jshint node:true */
module.exports = function(grunt) {
	"use strict";

	var path = require('path');

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
			dist: 'dist<%= grunt.template.today("yyyymmdd") %>',
			//sources
			src: 'src',
			//where json files are stored
			data: '<%= paths.src %>/data',
			//temporary files
			tmp: '.tmp',
			//pattern to HTML email files
			email: '*.html'
		},


		/**
		 * Hosts Configuration
		 * ===============================
		 */
		hosts: {
			//enter here yout production host details
			production: {
				url: 'http://www.mydomain.com/',
				host: 'remote.host',
				username: 'username',
				password: 'password',
				path: '/path/to/www'
			},
			development: {
				//this is the default development domain
				url: 'http://localhost:8000/',
				host: 'local.host',
				username: 'username',
				password: 'password',
				path: '/path/to/www'
			}
		},


		/**
		 * Cleanup Tasks (used internally)
		 * ===============================
		 */
		clean: {
			dist: ['<%= paths.dist %>', '<%= paths.tmp %>']
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
			}
		},


		/**
		 * SCSS Compilation Tasks
		 * ===============================
		 */
		compass: {

			dev: {
				options: {
					cssDir: '<%= paths.tmp %>/css',
					imagesDir: '<%= paths.tmp %>/images',
					//accepts some compass command line option
					//see https://github.com/gruntjs/grunt-contrib-compass
					config: path.normalize(__dirname + '/vendor/compass-config.rb')
				}
			},

			dist: {
				options: {
					cssDir: '<%= paths.dist %>/css',
					imagesDir: '<%= paths.dist %>/images',
					force: true,
					environment: 'production',
					config: path.normalize(__dirname + '/vendor/compass-config.rb'),
				}
			}
		},


		/**
		 * Static EJS Render Task
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
		 * Environment Related Task
		 * ===============================
		 */
		preprocess: {
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
					dest: '<%= paths.dist %>/'
				}]
			}
		},

		/**
		 * Premailer Parser Tasks
		 * ===============================
		 */
		premailer: {

			dist_html: {
				options: {
					//see https://github.com/dwightjack/grunt-premailer#options
					//css is used to be sure that external CSS files are parsed
					css: ['<%= paths.dist %>/css/*.css'],
					baseUrl: '<%= hosts.production.url %>'
				},
				src: ['<%= paths.dist %>/<%= paths.email %>']

			},
			dist_txt: {
				options: {
					baseUrl: '<%= hosts.production.url %>',
					mode: 'txt'
				},
				files: [{
					expand: true,
					cwd: '<%= paths.dist %>/',
					src: ['<%= paths.email %>'],
					dest: '<%= paths.dist %>/',
					ext: '.txt'
				}]

			},

			dev_html: {
				options: {
					css: ['<%= paths.tmp %>/css/*.css'],
					baseUrl: '<%= hosts.development.url %>'
				},
				src: ['<%= paths.tmp %>/<%= paths.email %>']
			},
			dev_txt: {
				options: {
					baseUrl: '<%= hosts.development.url %>',
					mode: 'txt'
				},
				files: [{
					expand: true,
					cwd: '<%= paths.tmp %>/',
					src: ['<%= paths.email %>'],
					dest: '<%= paths.tmp %>/',
					ext: '.txt'
				}]
			}
		},



		/**
		 * Images Optimization Tasks
		 * ===============================
		 */
		imagemin: {

			dist: {
				files: [{
					expand: true,
					cwd: '<%= paths.tmp %>/images',
					src: ['**/*.{gif,png,jpg}'],
					dest: '<%= paths.dist %>/images'
				}]
			}
		},


		/**
		 * Test Mailer Tasks
		 * ===============================
		 */
		nodemailer: {

			options: {

				/**
				 * Defaults to sendmail
				 * Here follows a Gmail SMTP example transport
				 * @see https://github.com/andris9/Nodemailer
				 */
				/*transport: {
					type: 'SMTP',
					options: {
						service: 'Gmail',
						auth: {
							user: 'john.doe@gmail.com',
							pass: 'password'
						}
					}
				},*/

				from: '<John Doe> john.doe@gmail.com',

				// HTML and TXT email
				// A collection of recipients
				recipients: [{
					email: 'jane.doe@gmail.com',
					name: 'Jane Doe'
				}]
			},

			dist: {
				src: ['<%= paths.dist %>/<%= paths.email %>', '<%= paths.dist %>/<% print(paths.email.replace(/\.html$/, ".txt")); %>']
			},

			dev: {
				src: ['<%= paths.src %>/_tmp.<%= paths.email %>', '<%= paths.src %>/_tmp.<% print(paths.email.replace(/\.html$/, ".txt")); %>']
			}

		},


		/**
		 * Watch Task (used internally)
		 * ===============================
		 */
		watch: {
			compass: {
				files: ['src/scss/**/*.scss'],
				tasks: ['compass:dev']
			},
			html: {
				files: ['src/email.html', 'src/_inc/**/*.html'],
				tasks: ['render:dev', 'devcode:dev']
			}
		},

		/**
		 * Server Tasks (used internally)
		 * ===============================
		 */
		connect: {

			options: {
				hostname: '*',
				port: 8000,
				open: '<%= paths.devDomain %>_tmp.<%= paths.email %>'
			},

			dev: {
				options: {
					base: '<%= paths.src %>'
				}
			},

			send: {
				options: {
					base: '<%= paths.src %>',
					//keep the server on
					keepalive: true
				}
			},

			dist: {
				options: {
					base: '<%= paths.dist %>',
					//keep the server on
					keepalive: true
				}
			}

		}

	});

	grunt.loadTasks(path.normalize(__dirname + '/vendor/tasks'));

	grunt.registerTask('default', 'dev');

	grunt.registerTask('dev', [
		'render:dev',
		'devcode:dev',
		'connect:dev',
		'watch'
	]);

	grunt.registerTask('dist', [
		'clean:dist',
		'imagemin:dist',
		'compass:dist',
		'render:dist',
		'devcode:dist',
		'premailer:dist_html',
		'premailer:dist_txt'
	]);

	grunt.registerTask('send', 'Simulates an email delivery. Either use "send:dev" or "send:dist"', function(env) {
		if (env === 'dev') {
			grunt.task.run([
				'compass:dev',
				'render:dev',
				'devcode:dev',
				'premailer:dev_html',
				'premailer:dev_txt',
				'nodemailer:dev',
				'connect:send'
			]);
		} else if (env === 'dist') {
			grunt.task.run(['dist', 'nodemailer:dist']);
		} else {
			grunt.fail.fatal('Test environment needed. Either use "send:dev" or "send:dist"');
		}
	});

};