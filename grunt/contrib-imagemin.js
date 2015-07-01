module.exports = function (grunt) {
	"use strict";

	grunt.config("imagemin", {
		options: {
			optimizationLevel : 3,
			progressive : true,
			interlaced : true
		},
		dynamic: {
			files: [
				{
					expand: true,
					cwd: "<%= imgdir %>",
					src: [
						"**/*.{png,jpg,gif}"
					],
					dest: "<%= dist %>/images/"
				}
			]
		}
	});

	grunt.loadNpmTasks("grunt-contrib-imagemin");
};
