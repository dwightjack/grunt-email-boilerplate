/**
 * Premailer Task
 *
 * Copyright (c) 2013 Marco "DWJ" Solazzi
 * Licensed under the MIT license.
 */
/*jshint node:true */
module.exports = function( grunt ) {
  'use strict';

  var util = grunt.util,
      _ = util._,
      command = 'ruby' + (process.platform === 'win32' ? '.exe' : ''),
      template = grunt.template,
      path = require('path');

  function optsToArgs( opts ) {
    var args = [];

    Object.keys( opts ).forEach(function( el ) {
      var val = opts[ el ];

      el = el.replace(/[A-Z]/g, function(match) {
        return '-' + match.toLowerCase();
      });

      if ( val === true ) {
        args.push( '--' + el );
      }

      if ( _.isString( val ) ) {
        args.push( '--' + el, template.process(val) );
      }

      if( _.isArray( val ) ) {
        val.forEach(function( subval ) {
          args.push( '--' + el, subval );
        });
      }
    });

    return args;
  }

  grunt.registerMultiTask( 'premailer', 'Compass task', function() {
    var args = ['vendor/premailer-parser.rb'].concat(optsToArgs(this.data.options));

    grunt.util.async.forEach(this.files, function (file, next) {

      var src = file.src.filter(function(filepath) {
        // Remove nonexistent files (it's up to you to filter or warn here).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read and return the file's source.
        return grunt.file.read(filepath);
      }).join('\n');

      if (_.isEmpty(src)) {
        grunt.fail.fatal('Nothing to parse');
      }

      var dest_html = file.dest;
      var dest_txt = dest_html.replace(/\.html?$/, '.txt');
      var tmpFile = path.join( path.dirname(dest_html), '_tmp_premailer.html' );
      var batchAgs = args.concat(['--file-in', tmpFile, '--file-out-html', dest_html, '--file-out-txt', dest_txt]);
      var premailer;
      //copy content to the temp file
      grunt.file.write(tmpFile, src);

      premailer = util.spawn({
          cmd: command,
          args: batchAgs
      }, function( err, result, code ) {
        if ( err ) {
          grunt.fail.fatal(err);
        }
        //remove the tmp file
        grunt.file.delete(tmpFile);

        premailer.stdout.pipe( process.stdout );
        premailer.stderr.pipe( process.stderr );
        next( code === 0 );
      });

    }.bind(this), this.async());


  });
};