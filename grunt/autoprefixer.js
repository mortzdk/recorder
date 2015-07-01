module.exports = function (grunt) {
	"use strict";

	grunt.config("autoprefixer", {
		dev : {
			options: {
				browsers: [
					"last 2 versions", 
					"ie 6", 
					"ie 7", 
					"ie 8", 
					"ie 9"
				],
				map: {
					inline: false
				}
			},
			src: "<%= testcss %>/style.css",
			dest: "<%= testcss %>/style.css",
		}
	});

	grunt.loadNpmTasks("grunt-autoprefixer");
};
