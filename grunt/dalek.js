module.exports = function (grunt) {
	"use strict";

	grunt.config("dalek", {
		options : {
			reporter : [
				"console"
			],
			browser : [
				"phantomjs"
//				"chrome",
//				"firefox",
//				"ie"
			],
			force : true
		},
		files : {
			"src": [
				"<%= test %>/e2e/*.js"
			]
		}
	});

	grunt.loadNpmTasks("grunt-dalek");
};
