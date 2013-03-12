/*jshint node:true */
module.exports = function(grunt) {
	"use strict";

	var path = require('path'),
		// ejs render middleware
		ejs_render = require('./vendor/modules/ejs_render'),
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
			src: 'src'
		},


		/**
		 * Cleanup Tasks (used internally)
		 * ===============================
		 */
		clean: {
			dist: ['<%= paths.dist %>']
		},


		copy: {
			gif: {
				src: ['<%= paths.src %>/<%=paths.images %>/**/*.gif'],
				dest: '<%= paths.dist %>/<%=paths.images %>'
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
			dist: {
				src: '<%= paths.src %>/email.html',
				dest: '<%= paths.dist %>/email.html',
				options: {
					data: grunt.file.readJSON('data/data.json'),
					root: '<%= paths.src %>' //used as include basepath
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
				src: '<%= paths.dist %>/email.html',
				// overwrite source file
				dest: '<%= paths.dist %>/email.html',
				options: {
					//accepts any compass command line option
					//replace mid dashes `-` with underscores `_`
					//ie: --base-url => base_url
					//see https://github.com/alexdunae/premailer/wiki/Premailer-Command-Line-Usage
					base_url: 'http://localhost:8000/'
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
				files: {
					//source images folder
					src: '<%= paths.src %>/<%=paths.images %>',
					//optimized images folder
					dest: '<%= paths.dist %>/<%=paths.images %>'
				}
			}
		},


		/**
		 * Test Mailer Tasks
		 * ===============================
		 */
		send: {

			dist: {
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
						"pass": "a.password!"
					}
				},*/
				// HTML and TXT email
				src: ['<%= paths.dist %>/email.html', '<%= paths.dist %>/email.txt'],
				// A collection of recipients
				recipients: [
					{
						email: 'jane.doe@gmail.com',
						name: 'Jane Doe'
					}
				]
			}

		},


		/**
		 * Watch Task (used internally)
		 * ===============================
		 */
		watch: {
			files: ['src/scss/**/*.scss'],
			tasks: ['compass:dev']
		},

		/**
		 * Server Tasks (used internally)
		 * ===============================
		 */
		connect: {

			dev: {
				options: {
					port: 8000,
					base: '<%= paths.src %>',
					//custom middlewares
					middleware: function (connect, options) {
						return [
							//dinamically render EJS tags
							//uses the render:dist `options` prop for configuration
							ejs_render(grunt, grunt.config.get('render.dist') || options),
							// Serve static files.
							connect.static(options.base),
							// Make empty directories browsable.
							connect.directory(options.base)
						];
					}
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

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-compass');

	grunt.loadTasks( path.normalize(__dirname + '/vendor/tasks') );

	grunt.registerTask('default', 'compass:dist');

	grunt.registerTask('dev', ['connect:dev', 'watch']);

	grunt.registerTask('dist', ['clean:dist', 'copy', 'img:dist', 'compass:dist', 'render:dist', 'premailer:dist' ] );

	grunt.registerTask('test', ['dist', 'send:dist', 'connect:dist']);


};
