/*jshint node:true */

module.exports = function(grunt) {

  "use strict";


  // Nodejs libs.
  var path = require('path');

  // External libs.
  var ejs = require('ejs');

  var _ = grunt.utils._;

  grunt.registerMultiTask('render', 'Renders an ejs template to palin HTML', function() {
    var options = _.defaults(this.data || {}, {
      params: {}
    });

    var src = grunt.file.read(this.file.src);

    grunt.file.write(this.file.dest, ejs.render(src, options.params) );

    grunt.log.writeln("Rendered HTML file to \"" + this.file.dest + "\"");

  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  /*grunt.registerHelper('render', function(filepath, options) {
    // extracted from rimraf
    var fs = require('fs'),
        path = require('path'),
        lstat = process.platform === "win32" ? "stat" : "lstat",
        lstatSync = lstat + "Sync",
        d = path.resolve( p ),
        s;

    try {
      s = fs[lstatSync](d);
    } catch (er) {
      if (er.code === "ENOENT") { return true; }
      throw er;
    }

    if(!s.isDirectory()) { return fs.unlinkSync(d); }

    fs.readdirSync(d).forEach(function (f) {
      grunt.helper('clean', path.join(d, f));
    });

    fs.rmdirSync(d);
  });*/

};