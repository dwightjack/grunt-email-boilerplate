/**
 * Premailer Task
 *
 * @param {Object} grunt
 */
/*jshint node:true */
module.exports = function( grunt ) {
  'use strict';

  var _ = grunt.utils._;
  var command = 'premailer';// + (process.platform === 'win32' ? '.bat' : '');
  var template = grunt.template;
  var fs = require('fs');
  var exec  = require('child_process').exec;

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
    var args = optsToArgs( this.data.options );
    var src = this.file.src;
    var dest_html = this.file.dest;
    var dest_txt = dest_html.replace(/\.html?$/, '.txt');


    args.push( src );
    /*var premailer = grunt.utils.spawn({
      cmd: command,
      args: args
    }, function( err, result, code ) {
      if ( /not found/.test( err ) ) {
        grunt.fail.fatal('You need to have Premailer installed.');
      } else {
        console.log(result.result);
      }
      cb( code === 0 || !result.stdout );
    });

    premailer.stdout.pipe( process.stdout );
    premailer.stderr.pipe( process.stderr );*/



    var premailer  = exec('premailer.bat ' + src , function( err, stdout, stderr ) {
      if ( /not found/.test( err ) ) {
        grunt.fail.fatal('You need to have Premailer installed.');
      } else {
        grunt.file.write(dest_html, stdout);
      }
      done();
     // cb( code === 0 || !result.stdout );
    });


  });
};
