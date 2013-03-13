/*
 * EJS render task
 *
 * Copyright (c) 2012-2013 Marco "DWJ" Solazzi
 * Licensed under the MIT license.
 */

/*jshint node:true */
module.exports = function(grunt) {

  "use strict";

  var ejs = require('ejs'),
	path = require('path'),
	_ = grunt.util._;

	function render (filepath, options) {
		var src = '';

		if (grunt.file.exists(filepath)) {
			src = grunt.file.read(filepath);
			return ejs.render(src, options || null);
		}
		grunt.fail.fatal("File \"" + filepath + "\" not found");
	}


  grunt.registerMultiTask('render', 'Renders an ejs template to plain HTML', function() {
	var options = this.options();

	this.files.forEach(function(file) {
		var contents = file.src.map(function(filepath) {
			options.filename = filepath;
			return render(filepath, options);
		}).join('\n');
		// Write joined contents to destination filepath.
		grunt.file.write(file.dest, contents);
		// Print a success message.
		grunt.log.writeln("Rendered HTML file to \"" + file.dest + "\"");
	});
  });

};