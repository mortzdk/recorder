module.exports = function (grunt) {
	"use strict";

	grunt.config("sass", {
		dev : {
			options: {
				trace: true,
				unixNewlines: true,
				loadPath: ["<%= sassdir %>"],
				sourcemap : "none"
			},
			files: {
				"<%= cssdir %>/sass.css" : "<%= sassdir %>/index.scss"
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-sass");
};
