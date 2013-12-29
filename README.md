#Grunt Email Boilerplate

A grunt-ready HTML email template based on [HTML Email Boilerplate](http://htmlemailboilerplate.com/).

##Features

* SCSS stylesheets with [Compass](http://compass-style.org/)
* image optimization with [jpegtran](http://jpegclub.org/jpegtran/) and [OptiPNG](http://optipng.sourceforge.net/)
* inlining CSS styles with [grunt-premailer](https://github.com/dwightjack/grunt-premailer) and [Premailer](http://premailer.dialect.ca/)
* HTML templating with [EJS](https://github.com/visionmedia/ejs) and [more](https://github.com/dwightjack/grunt-ejs-render) 
* Environment specific code blocks in HTML with [grunt-devcode](https://github.com/livedata/grunt-devcode) (a custom version, actually)
* test email delivery with [grunt-nodemailer](https://github.com/dwightjack/grunt-nodemailer) and [NodeMailer](https://github.com/andris9/Nodemailer)

##Requirements

* Node.js >= 0.10.20 ([install wiki](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager))
* Grunt-cli >= 0.1.7 and Grunt >=0.4.2 (`npm install grunt-cli -g`)
* Ruby >= 1.9.3 ([installers](http://www.ruby-lang.org/en/downloads/))
* Compass >= 0.12.2 (`gem install compass`)
* Premailer >= 1.7.9 (`gem install premailer` and, most of the time, `gem install hpricot`)

## Getting Started

To install the boilerplate 

1. install all dependencies

2. clone this git repo

	`git clone git://github.com/dwightjack/grunt-email-boilerplate.git`

3. install node dependencies:
	
	`cd grunt-email-boilerplate`

	`npm install`

4. Run the development task `grunt dev` and start editing email files in `src` folder (by default `email.html` and `scss/_main.scss`). By default, Grunt will try to open the email preview in your default browser; alternatively, preview URL is `http://localhost:8000/`.

## 0.2 to 0.3 Changes

Version 0.3 introduces several changes to included plugins, tasks and folders' structure:

* **System changes**
** Boilerplate now requires Node.js >= 0.10.20, Ruby >= 1.9.3, Premailer >= 1.7.9 and Grunt >=0.4.2
* **Files and folder changes** 
** `data` folder moved into `src`
** intermediate files (as `_tmp.email.html`) are now stored in a temporary folder (`tmp` by default)
** build folder `dist` is no more suffixed with current date 
* **Tasks and configuration changes**
** Updated all tasks to latest versions
** Removed `distDomain` and `devDomain` paths in favor of dedicated `hosts` configuration object
** Removed `paths.images` configuration
** Boilerplate now allows multiple email files (`paths.email === '*.html'`)
** Removed `grunt-devcode` in favor of [`grunt-preprocess`](https://github.com/jsoverson/grunt-preprocess)
** Using `grunt-contrib-compass` watch option instead of a `watch` sub-task.
** Enabled `livereload` feature
** `send` task only allows testing on development environment. Transitory solution while looking for better integration with production environments.



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
* `inc`: optional partials files (requires a `render` task to be set)
* `data`: optional JSON files with variables (requires a `render` task to be set)

###Default Tasks

The boilerplate comes with some predefined tasks to cover average email development needs.

**`dev` Tasks**

This tasks runs a watch trigger for changes to sources inside the `src` folder and starts a static HTTP server at `http://localhost:8000` pointing to the `tmp` folder where processed resources are store.

NOTE: This tasks doesn't apply any style inlining.

**`dist` Tasks**

This tasks creates a build from your sources. It creates a folder named `dist` next to `src`, then compiles your SCSSes and inlines the resulting stylesheet in the HTML source through Premailer. By default, Premailer outputs a text version too. 

Images are optimized with jpegtran and OptiPNG.

**`send` Tasks** (was `test` before v0.2.3)

Extends `dev` by sending the compiled email to any configured recipient.

###Tasks Customization

See `Gruntfile.js` source for more options and customizations.

###Tips and Tricks

1) **Connecting from a machine other than localhost**

By default tasks refer to `http://localhost:8000` as the test URL, anyway you may connect to the test server by pointing to its IP (e.g.: `http://192.168.0.10:8000`) or to any other registered alias.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](http://www.gruntjs.com).

## Release History
v0.2.4  
	- updated [grunt-premailer](https://github.com/dwightjack/grunt-premailer) to v0.2.0.

v0.2.3  
	- bugfixes and updates, send task moved to [external grunt plugin](https://github.com/dwightjack/grunt-nodemailer), premailer task moved to [external grunt plugin](https://github.com/dwightjack/grunt-premailer). `send` task renamed to `nodemailer`, `test` renamed to `send` as in [generator-htmlemail](https://github.com/jahvi/generator-htmlemail).

v0.2.2  
	- better test handling. Updated dependencies.

v0.2.1  
	- render task moved to [external grunt plugin](https://github.com/dwightjack/grunt-ejs-render).

v0.2  
	- `ejs` templates are now statically rendered in development stage by the `watch` task. Added `open` and `devcode` tasks. Fixed some issues with the `imagemin` task.

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

