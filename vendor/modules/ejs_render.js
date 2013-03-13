/*jshint node:true */
/*global grunt*/
function ejs_render (grunt, options) {

	"use strict";

	var path = require('path'),
		url	= require('url'),
		fs	= require('fs'),
		ejs = require('ejs'),
		_ = grunt.util._;

	return function (req, res, next) {

		var file;

		//only process html requests
		if (!/\.html$/.test(req.url)) {
			return next();
		}
		//ensure it's a proper path
		options.root = grunt.template.process(options.root || options.base);

		file = path.join(options.root, url.parse(req.url).pathname);
		fs.readFile(file, 'utf8', function(err, str){
			if (err) { return next(err); }
			try {
				str = ejs.render(str, _.extend({filename: file}, options));
				res.setHeader('Content-Type', 'text/html');
				res.setHeader('Content-Length', Buffer.byteLength(str));
				res.end(str);
			} catch (err) {
				next(err);
			}
		});
	};
}

module.exports = ejs_render;