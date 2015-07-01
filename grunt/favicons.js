module.exports = function (grunt) {
	"use strict";

	grunt.config("favicons", {
		options : {
			html : "<%= app %>/index.html",
			HTMLPrefix : "<%= dist %>/images/icons/",
			apple : true,
			regular : true,
			trueColor : true,
			windowsTile : true,
			coast : true,
			firefox : true,
			firefoxRound : true,
			androidHomescreen : true,
			tileBlackWhite : true,
			appleTouchBackgroundColor : "auto",
			tileColor : "auto",
			indent : "\t\t"
		},
		icons: {
		    src: "<%= imgdir %>/logo.png",
		    dest: "<%= dist %>/images/icons"
		}
	});

	grunt.loadNpmTasks("grunt-favicons");
};
