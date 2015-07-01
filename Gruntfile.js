module.exports = function (grunt) {
	"use strict";

	var dev = [
			"clean:dev", 

			// Bower
			"bower:install",

			// CSS
			"less:dev",
			"sass:dev",
			"csslint:dev",
			"concat:css",
			"autoprefixer:dev",

			// Templates
			"concat:templates",

			// HTML
			"htmllint:dev",

			// JS
			"jshint:dev",
			"bowerRequirejs",
			"requirejs",
			"uglify:dev",
			"jshint:test",
			"includeSource:dev",
			"copy:reporter",
			"wiredep:dev",
//			"blanket_qunit",
//			"dalek"
		],
		prod = function () {
			grunt.task.run(
				["clear"]
					.concat(dev)
					.concat(["clean:bower", "clean:rjs", "clean:prod"])
					.concat(["__prod__"])
			);
		},
		clear = [
			"clean:bower", 
			"clean:rjs", 
			"clean:dev", 
			"clean:prod"
		];
	
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		// State
		production : false,
		
		// Tasks
		
		taskdev : dev,

		taskprod : prod,
		
		taskclear : clear,

		// Paths
		app : "app",

		assets : "<%= app %>/assets",
		test : "<%= app %>/test",
		dist : "<%= app %>/dist",
		vendors : "<%= app %>/vendors",
		modules : "node_modules",

		cssdir: "<%= assets %>/css",
		lessdir: "<%= assets %>/less",
		sassdir: "<%= assets %>/sass",
		jsdir: "<%= assets %>/js",
		tmpldir: "<%= assets %>/templates",
		imgdir : "<%= assets %>/images",

		testcss: "<%= test %>/css",
		testjs: "<%= test %>/js",
		testtmpl: "<%= test %>/templates",

		scripts: [
			"Gruntfile.js", 
			"grunt/**/*.js",
			"<%= jsdir %>/**/*.js", 
			"<%= test %>/**/*.js", 
			"!<%= app %>/**/*.min.js", 
		],
		stylesheets: [
			"<%= cssdir %>/**/*.css", 
			"<%= testcss/**/*.css",
			"!<%= app %>/**/*.min.css", 
		],
		htmls: [
			"<%= app %>/*.html", 
			"<%= test %>/*.html",
			"!<%= app %>/*.min.html", 
			"!<%= test %>/*.min.html"
		],
		templates: ["<%= tmpldir %>/**/*.tmpl"],
		lesses: ["<%= lessdir %>/**/*.less"],
		sasses:  ["<%= sassdir %>/**/*.scss"],
	});

	// Temporary task that is used in production
	grunt.registerTask("__prod__", function () {
		grunt.config.set("production", true);
		grunt.task.run([
			"bower:install",

			// Copy
			"copy:prod",

			// HTML
			"includeSource:prod",
			"htmllint:prod",
			"favicons",

			// Prod
			"cssmin",
			"htmlmin",
			"imagemin",
			"uglify:prod"
		]);
	});

	// Unused for now
	//	grunt.loadNpmTasks("grunt-bootlint");
	//	grunt.loadNpmTasks("grunt-favicon");
	//	grunt.loadNpmTasks("grunt-uncss");
	//	grunt.loadNpmTasks("grunt-newer");

	// Load tasks from the grunt folder
	grunt.loadTasks("grunt");

	// "grunt clear" or "grunt clean" clears all temporary and production files
	grunt.registerTask("clear", clear);

	// "grunt dev" or "grunt development" runs development task
	grunt.registerTask("development", function () {
		grunt.task.run(["clear:dev"].concat(dev));
	});
	grunt.registerTask("dev", function () {
		grunt.task.run(["clear:dev"].concat(dev));
	});

	// "grunt prod", "grunt production", "grunt dist" runs production task
	grunt.registerTask("production", prod);
	grunt.registerTask("prod", prod);
	grunt.registerTask("dist", prod);

	// "grunt" or "grunt watch" runs watch
	grunt.registerTask("default", "watch");
};
