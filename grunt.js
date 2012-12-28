/*jshint node:true */
module.exports = function(grunt) {
	"use strict";

	var path = require('path'),
		_ = ('util' in grunt ? grunt.util : grunt.utils)._;

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



		/**
		 * SCSS Compilation Tasks
		 * ===============================
		 */
		compass: {

			dev: {
				//set the parent folder of scss files
				project_path : '<%= paths.src %>',
				options: {
					//accepts any compass command line option
					//replace mid dashes `-` with underscores `_`
					//ie: --sass-dir => sass_dir
					//see http://compass-style.org/help/tutorials/command-line/
					config: path.normalize(__dirname + '/vendor/compass-config.rb')
				}
			},

			dist: {
				project_path : '<%= paths.dist %>',
				options: {
					force: true,
					environment: 'production',
					sass_dir: '../<%= paths.src %>/scss',
					config: path.normalize(__dirname + '/vendor/compass-config.rb')
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
					root: '<%= paths.src %>' //used as partial basepath
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
		img: {

			dist: {
				//source images folder
				src: '<%= paths.src %>/<%=paths.images %>',
				//optimized images folder
				dest: '<%= paths.dist %>/<%=paths.images %>'
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
			tasks: 'compass:dev'
		},

		/**
		 * Server Tasks (used internally)
		 * ===============================
		 */
		server: {

			dev: {
				port: 8000,
				base: '<%= paths.src %>',
				//dinamically render EJS tags
				//uses the render:dist `options` prop for configuration
				render: 'render.dist'
			},

			dist: {
				port: 8000,
				base: '<%= paths.dist %>',
				//keep the server on
				keepalive: true
			}

		  }

	});

	grunt.loadTasks( path.normalize(__dirname + '/vendor/tasks') );

	grunt.registerTask('default', 'compass:dist');

	grunt.registerTask('dev', 'server:dev watch');

	grunt.registerTask('dist', 'clean:dist img:dist compass:dist render:dist premailer:dist');

	grunt.registerTask('test', 'dist send:dist server:dist');


};
