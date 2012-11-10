/*jshint node:true */
module.exports = function(grunt) {
	"use strict";

	var path = require('path'),
		_ = grunt.utils._;

	// Project configuration.
	grunt.initConfig({

		pkg: '<json:package.json>',

		meta: {
			banner: ''
		},

		paths: {
			images: 'images',
			dist: 'dist<%= grunt.template.today("yyyymmdd") %>',
			src: 'src'
		},

		compass: {

			dev: {
				project_path : '<%= paths.src %>',
				options: {
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


		premailer: {
			dist: {
				src: '<%= paths.src %>/email.html',
				dest: '<%= paths.dist %>/email.html',
				options: {
					base_url: 'http://www.test.it/'
				}
			}
		},


		img: {
			dist: {
				src: '<%= paths.src %>/<%=paths.images %>',
				dest: '<%= paths.dist %>/<%=paths.images %>'
			}
		},

		send: {
			dist: {
				transport: {
					"type": "SMTP",
					"service": "Gmail",
					"auth": {
					    "user": "john.doe@gmail.com",
					    "pass": "a.password!"
					}
				},
				src: ['<%= paths.dist %>/email.html', '<%= paths.dist %>/email.txt'],
				recipients: [
					{
						email: 'jane.doe@gmail.com',
						name: 'Jane Doe'
					}
				]
			}

		},



		watch: {
			files: ['scss/**/*.scss'],
			tasks: 'compass:dev'
		},

		server: {

			dev: {
				port: 8000,
				base: '<%= paths.src %>'
			},

			dist: {
				port: 8000,
				base: '<%= paths.dist %>'
			}

		  }

	});

	grunt.loadTasks( path.normalize(__dirname + '/vendor/tasks') );

	// Default task.
	grunt.registerTask('default', 'compass:dist');

	grunt.registerTask('dev', 'server:dev watch');

	grunt.registerTask('dist', 'img:dist compass:dist premailer:dist');

	grunt.registerTask('test', 'dist send:dist');


};
