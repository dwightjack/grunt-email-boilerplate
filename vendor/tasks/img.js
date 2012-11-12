/*jshint node:true */
module.exports = function( grunt ) {
  'use strict';

  var fs = require('fs'),
    path = require('path'),
    which = require('which'),
    util = ('util' in grunt ? grunt.util : grunt.utils); //grunt 0.4 compat;

  var win32 = process.platform === 'win32';


    var png = ['.png', '.bmp', '.gif', '.pnm', '.tiff'],
        jpegs = ['.jpg', 'jpeg'];

    grunt.registerMultiTask('img', 'Optimizes .png/.jpg images using optipng/jpegtran', function() {
        var cb = this.async(),
            source = this.file.src,
            dest = this.file.dest,
            files = [],
            pngConfig = grunt.config('optipng'),
            jpgConfig = grunt.config('jpegtran'),
            recursive =  grunt.config('recursive') || true;

        if( util.kindOf( source ) === 'string' && path.extname( source ).length === 0 && recursive ) {
            var filesList = [];
            grunt.file.recurse(source,function(abspath){
                if(abspath){
                    filesList.push(abspath);
                }
            });
            files = filesList;
        } else {
            files = grunt.file.expandFiles(source);
        }

        var pngfiles = files.filter(function(file) {
            return !!~png.indexOf(path.extname(file).toLowerCase());
        });

        var jpgfiles = files.filter(function(file) {
            return !!~jpegs.indexOf(path.extname(file).toLowerCase());
        });

        if (dest && !/\/$/.test(dest) ) {
            dest += '/';
        }

        grunt.helper('optipng', pngfiles, pngConfig, dest, function(err) {
            if(err) grunt.log.error(err);

            grunt.helper('jpegtran', jpgfiles, jpgConfig, dest, function(err) {
                if(err) grunt.log.error(err);
                cb();
            });
        });
    });

    grunt.registerHelper('optipng', function(files, opts, output, cb) {
        opts = opts || {};
        cb = cb || function() {};

        grunt.helper('which', 'optipng', function(err, cmdpath) {
            if(err) return grunt.helper('not installed', 'optipng', cb);

            var args = opts.args ? opts.args : [];
                args = args.concat(files);

            if(!files.length) return cb();

            grunt.log.writeln('Running optipng... ' + grunt.log.wordlist(files));

            if ( output ) {
                args.push('-dir', output, '-clobber');
            }

            var optipng = util.spawn({
                cmd: cmdpath,
                args: args
            }, function() {});

            optipng.stdout.pipe(process.stdout);
            optipng.stderr.pipe(process.stderr);
            optipng.on('exit', cb);

        });
    });

    grunt.registerHelper('jpegtran', function(files, opts, output, cb) {
        opts = opts || {};
        cb = cb || function() {};
        opts.args = opts.args ? opts.args : ['-copy', 'none', '-optimize','-outfile','jpgtmp.jpg'];

        grunt.helper('which', 'jpegtran', function(err, cmdpath) {
            if(err) return grunt.helper('not installed', 'jpegtran', cb);
            (function run(file) {
                if(!file) return cb();

                grunt.log.subhead('** Processing: ' + file);

                var jpegtran = util.spawn({
                    cmd: cmdpath,
                    args: opts.args.concat(file)
                }, function() {});

                var outputPath;
                if (output) {
                    outputPath = output + path.basename(file);
                    try {
                        grunt.file.read(outputPath);
                    } catch(err) {
                        grunt.file.write(outputPath);
                    }
                    grunt.log.writeln('Output file: ' + outputPath);
                } else {
                    outputPath = file;
                }

                jpegtran.stdout.pipe(process.stdout);
                jpegtran.stderr.pipe(process.stderr);

                jpegtran.on('exit', function(code) {
                    if(code) return grunt.warn('jpgtran exited unexpectedly with exit code ' + code + '.', code);
                    // output some size info about the file
                    grunt.helper('min_max_stat', 'jpgtmp.jpg', file);
                    // copy the temporary optimized jpg to original file
                    fs.createReadStream('jpgtmp.jpg')
                        .pipe(fs.createWriteStream(outputPath)).on('close', function() {
                            grunt.helper('clear_temp_file', 'jpgtmp.jpg', function() {
                                run(files.shift());
                            });
                    });
                });
            }(files.shift()));
        });
    });

    grunt.registerHelper('clear_temp_file', function(tempFile, callback) {
        var fs = require('fs');

        fs.unlinkSync(tempFile);
        callback();

    });

    // Output some size info about a file, from a stat object.
    grunt.registerHelper('min_max_stat', function(min, max) {
        min = typeof min === 'string' ? fs.statSync(min) : min;
        max = typeof max === 'string' ? fs.statSync(max) : max;
        grunt.log.writeln('Uncompressed size: ' + String(max.size).green + ' bytes.');
        grunt.log.writeln('Compressed size: ' + String(min.size).green + ' bytes minified.');
    });

    grunt.registerHelper('not installed', function(cmd, cb) {
        grunt.verbose.or.writeln();
        grunt.log.write('Running ' + cmd + '...').error();
        grunt.log.errorlns([
            'In order for this task to work properly, :cmd must be',
            'installed and in the system PATH (if you can run ":cmd" at',
            'the command line, this task should work)'
        ].join(' ').replace(/:cmd/g, cmd));
        grunt.log.subhead('Skiping ' + cmd + ' task');
        if(cb) cb();
    });

    // **which** helper, wrapper to isaacs/which package plus some fallback logic
    // specifically for the win32 binaries in vendor/ (optipng.exe, jpegtran.exe)
    grunt.registerHelper('which', function(cmd, cb) {
        if(!win32 || !/optipng|jpegtran/.test(cmd)) return which(cmd, cb);

        var cmdpath = cmd === 'optipng' ? '../bin/optipng.exe' :
          '../bin/jpegtran.exe';


        cb(null, path.normalize(path.join(__dirname, cmdpath)));
    });
};