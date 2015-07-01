module.exports = function (grunt) {
	"use strict";

	grunt.config("concat", {
		css : {
			src : [
				"<%= stylesheets %>"
			],
			dest: "<%= testcss %>/style.css"
		},
		templates : {
			src : [
				"<%= templates %>"
			],
			dest: "<%= testtmpl %>/templates.tmpl"
		}
	});

	grunt.loadNpmTasks("grunt-contrib-concat");
};
