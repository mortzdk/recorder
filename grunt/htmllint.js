module.exports = function (grunt) {
	"use strict";

	grunt.config("htmllint", {
		options: {
			htmllintrc : ".htmllintrc",
		},
		dev : {
			src : [
				"<%= test %>/*.html",
				"!<%= test %>/*.min.html"
			]
		},
		prod : {
			src : [
				"<%= app %>/*.html", 
				"!<%= app %>/*.min.html"
			]
		}
	});

	grunt.loadNpmTasks("grunt-htmllint");
};
