/**
 * NodeMailer Task
 *
 * @param {Object} grunt
 */
/*jshint node:true */
module.exports = function( grunt ) {
	'use strict';

	var _ = grunt.utils._;
	var util = require('util');
	var nodemailer = require('nodemailer');


	grunt.registerMultiTask( 'send', 'Send e-mail with NodeMailer', function() {
		var done = this.async(),
				src = [].concat(this.file.src),
				src_html = '',
				src_txt = '',
				options = _.defaults(this.data, {
					transport: null,
					recipients: [],
					from: 'nodemailer <sender@example.com>',
					subject: null
				}),
				transport,
				subject;

		if (_.isObject(options.transport)) {
			transport = nodemailer.createTransport(options.transport.type, options.transport);
		} else {
			transport = nodemailer.createTransport("Sendmail", "/usr/sbin/sendmail");
		}

		src_html = grunt.file.read(src.shift());
		if (src.length) {
			src_txt = grunt.file.read(src.shift());
		}


		var to = _.map(options.recipients, function (el) {
			var args = ['"%s" <%s>'];
			if (typeof el === 'string') {
				args.push(el, el);
			} else {
				 args.push(el.name, el.email);
			}
			return util.format.apply(null, args);
		}).join(',');

		subject = [src_html.match(/<title>([^<]+)<\/title>/)].concat(options.subject);

		subject = _.chain(subject).flatten().compact().last().value();


		// Message object
		var message = {
				// sender info
				from: options.from,
				// Comma separated list of recipients
				to: to,
				// Subject of the message
				subject: subject, //
				// plaintext body
				text: src_txt,
				// HTML body
				html:src_html
		};

		grunt.log.writeln('Sending emails to recipients: ' + to);

		transport.sendMail(message, function(error) {
				if(error){
					grunt.fail.fatal('Error occured: ' + error.message);
						return;
				}
				grunt.log.writeln(('Message sent successfully!').green);
		});


	});


};