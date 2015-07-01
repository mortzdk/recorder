module.exports = function (grunt) {
	"use strict";

	grunt.config("copy", {
		reporter : {
			src : "<%= modules %>/grunt-blanket-qunit/reporter/" + 
					"grunt-reporter.js",
			dest : "<%= vendors %>/blanket/dist/qunit/grunt-reporter.js"
		},
		prod : {
			files :[
				{
					expand: true,
					cwd: "<%= testcss %>", 
					src: ["**"], 
					dest: "<%= dist %>/css/"
				},
				{
					expand: true,
					cwd: "<%= testjs %>", 
					src: ["**"], 
					dest: "<%= dist %>/js/"
				},
				{
					expand: true,
					cwd: "<%= testtmpl %>", 
					src: ["**"], 
					dest: "<%= dist %>/templates/"
				},
				{
					expand: true,
					cwd: "<%= imgdir %>", 
					src: ["**"], 
					dest: "<%= dist %>/images/"
				}
			]
		}
	});

	grunt.loadNpmTasks("grunt-contrib-copy");
};
