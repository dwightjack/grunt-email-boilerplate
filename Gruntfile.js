/*jshint node:true */
module.exports = function(grunt) {
	"use strict";

	var path = require('path'),
		_ = grunt.util._;

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
			//images folder name
			images: 'images',
			//where to store built files
			dist: 'dist<%= grunt.template.today("yyyymmdd") %>',
			//sources
			src: 'src',
			//main email file
			email: 'email.html'
		},


		/**
		 * Cleanup Tasks (used internally)
		 * ===============================
		 */
		clean: {
			dist: ['<%= paths.dist %>']
		},


		/**
		 * Copy gif files Tasks (used internally)
		 * ===============================
		 */
		copy: {
			gif: {
				files: [{
					expand: true,
					cwd: '<%= paths.src %>/<%=paths.images %>',
					src: ['**/*.gif'],
					dest: '<%= paths.dist %>/<%=paths.images %>'
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
					//set the parent folder of scss files
					basePath : '<%= paths.src %>',
					//accepts some compass command line option
					//see https://github.com/gruntjs/grunt-contrib-compass
					config: path.normalize(__dirname + '/vendor/compass-config.rb')
				}
			},

			dist: {
				options: {
					basePath : '<%= paths.dist %>',
					force: true,
					environment: 'production',
					config: path.normalize(__dirname + '/vendor/compass-config.rb'),
					sassDir: '../<%= paths.src %>/scss'
				}
			}
		},


		/**
		 * Static EJS Render Task
		 * ===============================
		 */
		render: {
			options: {
				data: 'data/data.json',
			},
			dev: {
				src: '<%= paths.src %>/<%= paths.email %>',
				dest: '<%= paths.src %>/_tmp.<%= paths.email %>'
			},
			dist: {
				src: '<%= paths.src %>/<%= paths.email %>',
				dest: '<%= paths.dist %>/<%= paths.email %>'
			}
		},

		/**
		 * Environment Related Task
		 * ===============================
		 */
		devcode: {
			options: {
				html: true, // html files parsing?
				js: false, // javascript files parsing?
				css: false, // css files parsing?
				clean: true, // removes devcode comments even if code was not removed
				block: {
					open: 'devcode', // with this string we open a block of code
					close: 'endcode' // with this string we close a block of code
				},
				dest: 'dev' // default destination which overwrittes environment variable
			},
			dev: { // settings for task used with 'devcode:dev'
				options: {
					source: '<%= paths.src %>/',
					dest: '<%= paths.src %>/',
					env: 'development',
					filter: function (filepath) {
						return path.basename(filepath) !== grunt.template.process('<%= paths.email %>');
					}
				}
			},
			dist: { // settings for task used with 'devcode:dist'
				options: {
					source: '<%= paths.dist %>/',
					dest: '<%= paths.dist %>/',
					env: 'production'
				}
			}
		},

		/**
		 * Premailer Parser Tasks
		 * ===============================
		 */
		premailer: {

			dist: {
				//source file path
				src: '<%= paths.dist %>/<%= paths.email %>',
				// overwrite source file
				dest: '<%= paths.dist %>/<%= paths.email %>',
				options: {
					//accepts any compass command line option
					//replace mid dashes `-` with camelCase
					//ie: --base-url => baseUrl
					//see https://github.com/alexdunae/premailer/wiki/Premailer-Command-Line-Usage
					baseUrl: '<%= paths.distDomain %>'
				}
			}
		},



		/**
		 * Images Optimization Tasks
		 * ===============================
		 */
		imagemin: {

			dist: {
				options: {
					optimizationLevel: 3
				},
				files: [{
					expand: true,
					cwd: '<%= paths.src %>/<%=paths.images %>',
					src: ['**/*'],
					dest: '<%= paths.dist %>/<%=paths.images %>'
				}]
			}
		},


		/**
		 * Test Mailer Tasks
		 * ===============================
		 */
		send: {

			dist: {

				src: ['<%= paths.dist %>/<%= paths.email %>', '<%= paths.dist %>/email.txt'],

				options: {

					/**
					 * Defaults to sendmail
					 * Here follows a Gmail SMTP exeample trasport
					 * @see https://github.com/andris9/Nodemailer
					 */
					/*transport: {
						"type": "SMTP",
						"service": "Gmail",
						"auth": {
							"user": "john.doe@gmail.com",
							"pass": "password"
						}
					},*/
					// HTML and TXT email
					// A collection of recipients
					recipients: [
						{
							email: 'jane.doe@gmail.com',
							name: 'Jane Doe'
						}
					]
				}
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
		 * Open Browser (used internally)
		 * ===============================
		 */
		open: {
			dev : {
				path: 'http://localhost:8000/_tmp.<%= paths.email %>'
			}
		},

		/**
		 * Server Tasks (used internally)
		 * ===============================
		 */
		connect: {

			dev: {
				options: {
					port: 8000,
					base: '<%= paths.src %>'
				}
			},

			dist: {
				options: {
					port: 8000,
					base: '<%= paths.dist %>',
					//keep the server on
					keepalive: true
				}
			}

		  }

	});

	[
		'grunt-contrib-connect',
		'grunt-contrib-watch',
		'grunt-contrib-copy',
		'grunt-contrib-imagemin',
		'grunt-contrib-clean',
		'grunt-contrib-compass',
		'grunt-open',
		'grunt-ejs-render'
	].forEach(grunt.loadNpmTasks);

	grunt.loadTasks( path.normalize(__dirname + '/vendor/tasks') );

	grunt.registerTask('default', 'compass:dist');

	grunt.registerTask('dev', ['render:dev', 'devcode:dev', 'connect:dev', 'open:dev', 'watch']);

	grunt.registerTask('dist', ['clean:dist', 'copy', 'imagemin:dist', 'compass:dist', 'render:dist', 'devcode:dist', 'premailer:dist'] );

	grunt.registerTask('test', ['dist', 'send:dist', 'connect:dist']);


};
