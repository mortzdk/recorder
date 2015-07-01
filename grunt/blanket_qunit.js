module.exports = function (grunt) {
	"use strict";

	grunt.config("blanket_qunit", {
		all: {
			options: {
				urls: [
					"<%= test %>/index.html?coverage=true&gruntReport"
				],
				threshold: 1
			}
		}
	});

	grunt.loadNpmTasks("grunt-blanket-qunit");
};
