/**
 * Premailer Task
 *
 * @param {Object} grunt
 */
/*jshint node:true */
module.exports = function( grunt ) {
  'use strict';

  var _ = grunt.utils._;
  var command = 'ruby' + (process.platform === 'win32' ? '.exe' : '');
  var template = grunt.template;
  var fs = require('fs');

  function optsToArgs( opts ) {
    var args = [];

    Object.keys( opts ).forEach(function( el ) {
      var val = opts[ el ];

      el = el.replace( /_/g, '-' );

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
    var done = this.async();
    var args = ['vendor/premailer-parser.rb'].concat(optsToArgs(this.data.options));
    var src = grunt.file.read(this.file.src);
    var dest_html = this.file.dest;
    var dest_txt = dest_html.replace(/\.html?$/, '.txt');
    var tmpFile = template.process('<%= paths.dist %>/_tmp_email.html');

    //copy content to the temp file
    grunt.file.write(tmpFile, src);


    args.push('--file-in', tmpFile, '--file-out-html', dest_html, '--file-out-txt', dest_txt);

    var premailer = grunt.utils.spawn({
      cmd: command,
      args: args
    }, function( err, result, code ) {
      if ( /not found/.test( err ) ) {
        grunt.fail.fatal('You need to have Premailer installed.');
      }
      //remove the tmp file
      fs.unlinkSync(tmpFile);
      done( code === 0 );
    });

    premailer.stdout.pipe( process.stdout );
    premailer.stderr.pipe( process.stderr );

  });
};