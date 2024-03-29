'use strict';
/*jshint camelcase: false */
/*global module:false */
module.exports = function(grunt) {
  grunt.initConfig({
    // uglify: {
    //   'dist/built.min.js': 'dist/built.js'
    // },
 /*
      This is the bower grunt task
    */
    bower: {
      install: {
         options: {
            targetDir: "./dependencies",
            layout: 'byType',
            install: true,
						cleanTargetDir: false,
            cleanBowerDir: true,
            bowerOptions: {}
         }
      }
    },
    /*
      Perform any necessary copies to get the app structure the way we want it.
    */
    copy: {
      build: {
        files: {
          'build/assets/css/bootstrap.css': 'dependencies/css/bootstrap/bootstrap.min.css',
          'build/assets/js/modernizr.js': 'dependencies/js/modernizr/modernizr-1.7.min.js'
        }
      }
    },
		/* Since Handlebars runtime does not attach the Handlebars object to window, 
		  we must do it here with a string replacement.  Ember requires the module to 
			be attached to the window.
		*/
		'string-replace': {
		  dist: {
		    files: {
		      'dependencies/js/handlebars/handlebars.runtime.min.js': 'dependencies/js/handlebars/handlebars.runtime.min.js'
		    },
		    options: {
		      replacements: [{
		        pattern: 'var Handlebars=',
		        replacement: 'var Handlebars=window.Handlebars='
		      }]
		    }
		  }
		},
    /* 
       A simple ordered concatenation strategy.
       This will start at app/app.js and begin
       adding dependencies in the correct order
       writing their string contents into
       'build/application.js'

       Additionally it will wrap them in evals
       with @ sourceURL statements so errors, log
       statements and debugging will reference
       the source files by line number.

       You would set this option to false for 
       production.
    */
    neuter: {
      options: {
        includeSourceURL: true
      },
      'build/application.js': 'app/app.js',
			'build/splash-application.js': 'app/splash.js'
    },

    /*
      Watch files for changes.

      Changes in dependencies/ember.js or application javascript
      will trigger the neuter task.

      Changes to any templates will trigger the ember_templates
      task (which writes a new compiled file into dependencies/)
      and then neuter all the files again.
    */
    watch: {
      application_code: {
        files: ['dependencies/ember/ember.js', 'app/**/*.js'],
        tasks: ['neuter']
      },
      handlebars_templates: {
        files: ['app/**/*.hbs', 'app/**/**/*.hbs'],
        tasks: ['emberTemplates', 'neuter']
      }
    },

    /* 
      Runs all .html files found in the test/ directory through PhantomJS.
      Prints the report in your terminal.
    */
    qunit: {
      all: ['test/**/*.html']
    },

    /* 
      Reads the projects .jshintrc file and applies coding
      standards. Doesn't lint the dependencies or test
      support files.
    */
    jshint: {
      all: ['Gruntfile.js', 'app/**/*.js', 'test/**/*.js', '!dependencies/*.*', '!test/support/*.*'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    /* 
      Finds Handlebars templates and precompiles them into functions.
      The provides two benefits:

      1. Templates render much faster
      2. We only need to include the handlebars-runtime microlib
         and not the entire Handlebars parser.

      Files will be written out to dependencies/compiled/templates.js
      which is required within the project files so will end up
      as part of our application.

      The compiled result will be stored in
      Ember.TEMPLATES keyed on their file path (with the 'app/templates' stripped)
    */
    emberTemplates: {
      options: {
        templateName: function(sourceFile) {
          return sourceFile.replace(/app\/templates\//, '');
        }
      },
      'dependencies/compiled/templates.js': ["app/templates/**/*.hbs", "app/templates/**/**/*.hbs"]
    },

    /*
      Find all the <whatever>_test.js files in the test folder.
      These will get loaded via script tags when the task is run.
      This gets run as part of the larger 'test' task registered
      below.
    */
    build_test_runner_file: {
      all: ['test/**/*_test.js']
    }
  });
  
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-neuter');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ember-templates');
  grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-string-replace');
  
  /*
    A task to build the test runner html file that get place in
    /test so it will be picked up by the qunit task. Will
    place a single <script> tag into the body for every file passed to
    its coniguration above in the grunt.initConfig above.
  */
  grunt.registerMultiTask('build_test_runner_file', 'Creates a test runner file.', function(){
    var tmpl = grunt.file.read('test/support/runner.html.tmpl');
    var renderingContext = {
      data: {
        files: this.filesSrc.map(function(fileSrc){
          return fileSrc.replace('test/', '');
        })
      }
    };
    grunt.file.write('test/runner.html', grunt.template.process(tmpl, renderingContext));
  });
  
  /*
    A task to run the application's unit tests via the command line.
    It will
      - convert all the handlebars templates into compile functions
      - combine these files + application files in order
      - lint the result
      - build an html file with a script tag for each test file
      - headlessy load this page and print the test runner results
  */
  grunt.registerTask('test', ['emberTemplates', 'string-replace', 'neuter', 'jshint', 'build_test_runner_file', 'qunit']);

  /*
    Default task. Compiles templates, retrieves bower packages, performs any copying, neuters application code, and begins
    watching for changes.  Order matters here.
  */
  grunt.registerTask('default', ['emberTemplates', 'bower', 'copy', 'string-replace', 'neuter', 'watch']);
};
