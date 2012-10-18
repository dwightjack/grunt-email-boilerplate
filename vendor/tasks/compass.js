/**
 * Compass Task
 *
 * @see https://github.com/yeoman/yeoman/blob/master/cli/tasks/compass.js
 * @param {Object} grunt
 */
/*jshint node:true */
module.exports = function( grunt ) {
  'use strict';

  var _ = grunt.utils._;
  var command = 'compass' + (process.platform === 'win32' ? '.bat' : '');
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

  grunt.registerMultiTask( 'compass', 'Compass task', function() {
    var cb = this.async();
    var args = optsToArgs( this.data.options );
    var project_path = template.process(this.data.project_path || '');

    //check if this folder exists
    if (!fs.existsSync(project_path)) {
      fs.mkdirSync(project_path);
    }

    var compass = grunt.utils.spawn({
      cmd: command,
      args: ['compile', project_path].concat( args )
    }, function( err, result, code ) {
      if ( /not found/.test( err ) ) {
        grunt.fail.fatal('You need to have Compass installed.');
      }
      // Since `compass compile` exits with 1 when it has nothing to compile,
      // we do a little workaround by checking stdout which is then empty
      // https://github.com/chriseppstein/compass/issues/993
      cb( code === 0 || !result.stdout );
    });

    compass.stdout.pipe( process.stdout );
    compass.stderr.pipe( process.stderr );
  });
};
