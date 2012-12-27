/*
 * grunt-contrib-server
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */
/*jshint node:true */
'use strict';

module.exports = function(grunt) {

	// Nodejs libs.
	var path = require('path');

	// External libs.
	var connect = require('connect');
	var render = require('connect-render');

	var _ = grunt.utils._;

	grunt.registerMultiTask('server', 'Start a static web server.', function() {
		// Merge task-specific options with these defaults.
		var options = _.defaults(this.data || {}, {
			port: 8000,
			hostname: 'localhost',
			base: '.',
			keepalive: false,
			params: {},
			render: false
		});

		// Connect requires the base path to be absolute.
		var base = path.resolve( grunt.template.process(options.base) );

		// Sweet, sweet middleware.
		var middleware = [];

		if (options.render === true) {
			middleware.push(
				render({
					root: base,
					layout: false,
					cache: false, // `false` for debug
					helpers: {}
				}),

				function (req, res, next) {
					var filename;
					if (/\.html$/.test(req.url)) {
						res.render(path.basename(req.url), options.params);
					} else {
						next();
					}
				}
			);
		}

		middleware.push(
			// Serve static files.
			connect.static(base),
			// Make empty directories browsable. (overkill?)
			connect.directory(base)
		);

		// If --debug was specified, enable logging.
		if (grunt.option('debug')) {
			connect.logger.format('grunt', ('[D] server :method :url :status ' +
				':res[content-length] - :response-time ms').magenta);
			middleware.unshift(connect.logger('grunt'));
		}

		// Start server.
		grunt.log.writeln('Starting static web server on ' + options.hostname + ':' + options.port + '.');
		connect.apply(null, middleware).listen(options.port, options.hostname);

		// So many people expect this task to keep alive that I'm adding an option
		// for it. Running the task explicitly as grunt:keepalive will override any
		// value stored in the config. Have fun, people.
		if (this.flags.keepalive || options.keepalive) {
			// This is now an async task. Since we don't store a handle to the "done"
			// function, this task will never, ever, ever terminate. Have fun!
			//this.async();
			grunt.log.write('Waiting forever...');
		}
	});

};