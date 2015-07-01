module.exports = function (grunt) {
	"use strict";

	grunt.config("clean", {
		bower : [
			"<%= vendors %>"
		],
		rjs : [
			"<%= jsdir %>/config.js"
		],
		dev : [
			"<%= cssdir %>/sass.css",
			"<%= cssdir %>/less.css",
			"<%= testcss %>",
			"<%= testjs %>",
			"<%= testtmpl %>",
			"<%= test %>/index.html"
		],
		prod : [
			"<%= app %>/dist",
			"<%= app %>/index.min.html",
			"<%= app %>/index.html"
		]
	});

	grunt.loadNpmTasks("grunt-contrib-clean");
};
