/*
 * EJS render task
 *
 * Copyright (c) 2012 Marco "DWJ" Solazzi
 * Licensed under the MIT license.
 */

/*jshint node:true */
module.exports = function(grunt) {

  "use strict";

  var ejs = require('ejs');
  var path = require('path');
  var fs = require('fs');

  var _ = grunt.utils._;



  var reg_meta = /[\\\^$*+?{}.()|\[\]]/g;
  var open = ejs.open || "<%";
  var close = ejs.close || "%>";
  var PARTIAL_PATTERN_RE = new RegExp(open.replace(reg_meta, "\\$&") +
      "[-=]\\s*partial\\((.+)\\)\\s*" + close.replace(reg_meta, "\\$&"), 'g');

  grunt.registerMultiTask('render', 'Renders an ejs template to palin HTML', function() {
    var options = _.defaults(this.data.options || {}, {
      layout: false,
      filename: this.file.src
    });
    var src = grunt.helper('render', this.file.src, options);

    if (src) {
      grunt.file.write(this.file.dest, src);
      grunt.log.writeln("Rendered HTML file to \"" + this.file.dest + "\"");
    } else {
      grunt.fail.fatal("File \"" + this.file.src + "\" not found");
    }

  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  //reimplementing partials :( ...
  function partial(data, viewname, options) {
    return data.replace(PARTIAL_PATTERN_RE, function (all, view) {
      view = view.match(/['"](.*)['"]/);    // get the view name
      if (!view || view[1] === viewname) {
        return "";
      } else {
        var name = view[1];
        var viewpath = path.join(('root' in options) ? grunt.template.process(options.root) : '.', name);
        var tpl = '';
        try {
          tpl = fs.readFileSync(viewpath, 'utf8');
        } catch (e) {
          console.error("[%s][connect-render] Error: cannot load view partial %s\n%s", new Date(), viewpath, e.stack);
          return "";
        }
        return partial(tpl, view[1]);
      }
    });
  }

  grunt.registerHelper('render', function(filepath, options) {
    var src = '';

    if (fs.existsSync(filepath)) {
      src = grunt.file.read(filepath);
      src = partial(src, null, options || null);
      return ejs.render(src, options || null);
    } else {
      return false;
    }

  });

};