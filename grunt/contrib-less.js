module.exports = function (grunt) {
	"use strict";

	grunt.config("less", {
		dev : {
			options: {
				paths: ["<%= lessdir %>"],
				ieCompat: true
			},
			files: {
				"<%= cssdir %>/less.css" : "<%= lessdir %>/index.less"
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-less");
};
