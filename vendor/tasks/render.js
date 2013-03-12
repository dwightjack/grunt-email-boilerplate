/*
 * EJS render task
 *
 * Copyright (c) 2012 Marco "DWJ" Solazzi
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
		} else {
			return false;
		}

	}


  grunt.registerMultiTask('render', 'Renders an ejs template to palin HTML', function() {
	var options = this.options({
	  filename: this.file.src
	});
	var src = render(this.file.src, options);

	if (src) {
	  grunt.file.write(this.file.dest, src);
	  grunt.log.writeln("Rendered HTML file to \"" + this.file.dest + "\"");
	} else {
	  grunt.fail.fatal("File \"" + this.file.src + "\" not found");
	}

  });

};