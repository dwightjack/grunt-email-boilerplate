/*jshint node:true */
module.exports = function(grunt) {
	"use strict";

	var path = require('path'),
		_ = grunt.utils._;

	// Project configuration.
	grunt.initConfig({
		meta: {
			version: '0.1.0',
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
				options: {}
			}
		},


		img: {
			dist: {
				src: '<%= paths.src %>/<%=paths.images %>',
				dest: '<%= paths.dist %>/<%=paths.images %>'
			}
		},



		watch: {
			files: ['scss/**/*.scss'],
			tasks: 'compass:dev'
		}

		/*,
		jshint: {
			options: {
				curly: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				boss: true,
		regexdash: true,
		wsh: true,
		trailing: true,
		sub: true,
		smarttabs: true,
		expr: true,
		undef: true,
		browser: true
			},
			globals: {
				jQuery: true,
				same: true
			}
		},
		uglify: {}*/
	});

	grunt.loadTasks( path.normalize(__dirname + '/vendor/tasks') );

	// Default task.
	grunt.registerTask('default', 'compass:dist');


	grunt.registerTask('dist', 'img:dist compass:dist premailer:dist');


};
