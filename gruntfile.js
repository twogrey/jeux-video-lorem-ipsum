module.exports = function (grunt) {
	const sass = require('sass');

	/**
   * [Just-in-time plugin loader: improve speed tasks]
   */
	require('jit-grunt')(grunt, {
		htmllint: 'grunt-html'
	});

	/**
   * [Paths]
   */
	const jsPath = 'assets/js/';
	const cssPath = 'assets/css/';

	/**
   * [PostCSS Plugins]
   */
	const autoprefixer = require('autoprefixer');
	const cssnano = require('cssnano');
	const mqsort = require('node-css-mqpacker');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		/**
     * [Task for keeping multiple browsers & devices in sync when building websites]
     */
		browserSync: {
			bsFiles: {
				src: [
					`${cssPath}**/*.css`,
					`${jsPath}**/*.js`,
					`index.html`,
				],
			},
			options: {
				watchTask: true,
				proxy: 'http://localhost/jeux-video-lorem-ipsum/',
			},
		},
		/**
     * [Minify HTML]
     */
		htmlmin: {
			options: {
				removeComments: true,
				collapseWhitespace: true,
				collapseInlineTagWhitespace: false,
			},
			dist: {
				files: {
		      'index.html': 'index.unmin.html'
		    }
			}
		},
		/**
     * [HTML Validation]
     */
    htmllint: {
		  options: {
		  	noLangDetect: true,
		  	force: true,
		    errorlevels: ['error']
		  },
    	all: [ 'index.unmin.html' ]
    },
		/**
	   * [Sass compiler]
	   */
		sass: {
			options: {
				implementation: sass,
				sourceMap: true,
				sourceComments: true,
				outputStyle: 'expanded',
			},
			dist: {
				files: [ {
					expand: true,
					src: [ '**/*.scss' ],
					cwd: cssPath,
					dest: cssPath,
					ext: '.css',
				} ],
			},
		},
		shell: {
			options: {
				failOnError: false,
			},
			/**
       * [Stylelint]
       */
			lint: {
				command: `stylelint "${cssPath}**/*.scss" --config ${cssPath}.stylelintrc --fix`,
			},
		},
		/**
     * [Apply several post-processors to CSS using PostCSS]
     */
		postcss: {
			dist: {
				options: {
					map: {
						inline: false, // save all sourcemaps as separate files...
						annotation: `${cssPath}/sourcemaps/`, // ...to the specified directory
					},
					processors: [
						/**
	           * [Adds vendor prefixes, using data from Can I Use]
	           */
						autoprefixer({
							overrideBrowserslist : [ 'last 2 Chrome versions', 'last 2 Firefox versions', 'last 2 Edge versions', 'last 2 Safari versions', 'last 2 iOS versions', 'last 2 ChromeAndroid versions' ],
						}),
						/**
		         * [Pack same CSS media query rules]
		         */
						mqsort({
	          	sort: true
	          }),
						/**
	           * [Optimize CSS size]
	           */
						cssnano({
							safe: true,
						}),
					],
				},
				files: [ {
					expand: true,
					cwd: cssPath,
					src: [ 'styles.css' ],
					dest: cssPath,
					ext: '.min.css',
				} ],
			},
		},
		/**
     * [Validate files with JSHint]
     */
		jshint: {
			options: {
				esversion: 6,
			},
			dist: [ `${jsPath}**/*.js`, `!${jsPath}**/*.transpiled.js`, `!${jsPath}**/*.min.js`, `!${jsPath}**/demo.js` ],
		},
		/**
     * [Babel transpiler]
     */
		babel: {
			options: {
				presets: [ '@babel/preset-env' ],
			},
			dist: {
				files: [ {
					expand: true,
					src: [ '**/*.js' ],
					cwd: jsPath,
					dest: jsPath,
					ext: '.transpiled.js',
				} ],
			},
		},
		/**
     * [Minify JavaScript files]
     */
		uglify: {
			dist: {
				files: [ {
					expand: true,
					src: [ '**/*.transpiled.js' ],
					cwd: jsPath,
					dest: jsPath,
					ext: '.min.js',
				} ],
			},
		},
		/**
	   * [Run tasks whenever watched files change]
	   */
		watch: {
			options: {
				spawn: false,
			},
			html: {
				files: '**/*.html',
				tasks: [ 'htmllint', 'htmlmin' ],
			},
			style: {
				files: [ `${cssPath}**/*.scss` ],
				tasks: [ 'sass', 'postcss' ],
			},
			js: {
				files: [ `${jsPath}**/*.js` ],
				tasks: [ 'jshint', 'babel', 'uglify' ],
			},
		},
	});

	grunt.registerTask('default', [ 'browserSync', 'watch' ]);

	grunt.registerTask('build:html', [ 'htmllint', 'htmlmin' ]);

	grunt.registerTask('lint:css', [ 'shell:lint' ]);

	grunt.registerTask('build:css', [ 'sass', 'postcss' ]);

	grunt.registerTask('build:js', [ 'jshint', 'babel', 'uglify' ]);

	grunt.registerTask('build', [ 'build:html', 'build:css', 'build:js' ]);
};
