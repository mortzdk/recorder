module.exports = function (grunt) {
	"use strict";

	grunt.config("cssmin", {
		options: {
			sourceMap: true
		},
		target: {
			files : [
				{
					expand : true,
					cwd: "<%= testcss %>",
					src: ["style.css"],
					dest: "<%= dist %>/css/",
					ext: ".min.css"
				}
			]
		}
	});

	grunt.loadNpmTasks("grunt-contrib-cssmin");
};
