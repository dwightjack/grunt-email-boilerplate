#Grunt Email Boilerplate

A grunt-ready HTML email template based on [HTML Email Boilerplate](http://htmlemailboilerplate.com/).

##Features

* SCSS stylesheets with [Compass](http://compass-style.org/)
* image optimization with [jpegtran](http://jpegclub.org/jpegtran/) and [OptiPNG](http://optipng.sourceforge.net/)
* inlining CSS styles with [Premailer](http://premailer.dialect.ca/)
* HTML templating with [EJS](https://github.com/visionmedia/ejs)
* test email delivery with [NodeMailer](https://github.com/andris9/Nodemailer)

##Requirements

* Node.js >= 0.8.11 ([install wiki](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager))
* Grunt >=0.4.0 (`npm install grunt-cli -g`)
* Ruby >= 1.8.7 ([installers](http://www.ruby-lang.org/en/downloads/))
* Compass >= 0.12.2 (`gem install compass`)
* Premailer >= 1.7.3 (`gem install premailer` and, most of the time, `gem install hpricot`)

## Getting Started

To install the boilerplate 

1. install all dependencies

2. clone this git repo

	`git clone git://github.com/dwightjack/grunt-email-boilerplate.git`

3. install node dependencies:
	
	`cd grunt-email-boilerplate`

	`npm install`

4. Run the development task `grunt dev` (`grunt.cmd dev` on Windows prompt) and start editing email files in `src` folder (`email.html` and `scss/_main.scss`). Default preview URL is `http://localhost:8000`.

## Documentation


###Sources

This boilerplate comes with a customized version of the [HTML Email Boilerplate](http://htmlemailboilerplate.com/).

Sources are located in the `src` folder:

* `email.html`: HTML boilerplate
* `scss/`: SCSS folder
	* `_variables.scss`: boilerplate style variables
	* `_mixins.scss`: mixins and premailer attributes helpers 
	* `_base.scss`: common styles
	* `_media-queries.scss`: optional media queries for responsive emails
	* `_main.scss`: **your email style**
	* `style.scss`: glue stylesheet, don't edit it directly
* `images`: source images of your email
* `css`: destination folder of compiled SCSS sources
* `inc`: optional partials files (requires a `render` task to be set)
* `data`: optional JSON files with variables (requires a `render` task to be set)

###Default Tasks

The boilerplate comes with some predefined tasks to cover average email development needs.

**`dev` Tasks**

This tasks runs a watch trigger for changes to the `scss` folder and starts a static HTTP server at `http://localhost:8000` pointing to the `src` folder.

**`dist` Tasks**

This tasks creates a build from your sources. It creates a folder named `dist{YYYYMMDD}` next to `src`, then compiles your SCSSes and inlines the resulting stylesheet in the HTML source through Premailer. By default, Premailer outputs a text version too. 

Images are optimized with jpegtran and OptiPNG.

**`test` Tasks**

Extends `dist` task by sending the compiled email to any configured recipient and starts a static server at `http://localhost:8000` pointing to the `dist{YYYYMMDD}` folder.

###Tasks Customization

See `Gruntfile.js` source for more options and customizations.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](http://www.gruntjs.com).

## Release History
v0.1.4  
	- compatibility with grunt 0.4+ and contrib plugins

v0.1.3  
	- removed a couple of unneeded deps. Optimized `server` and `render` tasks

v0.1.2  
	- Added support for [ejs](https://github.com/visionmedia/ejs) templating

v0.1.1  
	- Debugging and polishing 

v0.1.0  
	- Initial release

## License
Copyright (c) 2012-2013 Marco Solazzi
Licensed under the MIT license.

