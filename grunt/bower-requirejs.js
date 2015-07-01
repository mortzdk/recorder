module.exports = function (grunt) {
	"use strict";

	grunt.config("bowerRequirejs", {
		all : {
			rjsConfig: "<%= jsdir %>/config.js",
			options: {
				excludeDev : "<%= production %>",
				transitive : true
			}
		}
	});

	grunt.loadNpmTasks("grunt-bower-requirejs");
};
