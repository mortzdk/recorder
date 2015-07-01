
module.exports = function (grunt) {
	"use strict";

	grunt.config("bower", {
		install: {
			options : {
				targetDir : "<%= dist %>",
				layout: "byType",
				copy: "<%= production %>",
				cleanTargetDir: true,
				bowerOptions : {
					forceLatest: true, // Force latest version on conflict
					production: "<%= production %>"
				},
				install: true,
				verbose: true
			}
		}
	});

	grunt.loadNpmTasks("grunt-bower-task");
};
