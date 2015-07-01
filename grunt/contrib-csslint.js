
module.exports = function (grunt) {
	"use strict";

	grunt.config("csslint", {
		dev : {
			options: {
				csslintrc: ".csslintrc",
				verbose: true
			},
			src: ["<%= stylesheets %>"]
		}
	});

	grunt.loadNpmTasks("grunt-contrib-csslint");
};
