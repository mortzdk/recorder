module.exports = function (grunt) {
	"use strict";

	grunt.config("watch", {
		files: [].concat.apply([
			"<%= scripts %>", 
			"<%= lesses %>", 
			"<%= sasses %>", 
			"<%= stylesheets %>", 
			"<%= htmls %>",
			"<%= templates %>"
		]), 
		tasks: "<%= taskdev %>",
		options: {
			spawn: false,
			dateFormat: function (time) {
				grunt.log.writeln("The watch finished in " + time + 
					"ms at " + (new Date()).toString());
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-watch");
};
