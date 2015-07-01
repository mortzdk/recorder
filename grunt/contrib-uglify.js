module.exports = function (grunt) {
	"use strict";

	grunt.config("uglify", {
		options : {
			quoteStyle : 2,
			preserveComments : "some", // use @preserve, @cc_on
		},
		dev : {
			options : {
				compress : false,
				mangle : false,
				beautify : true,
				sourceMap : true
			},
			files: {
				"<%= testjs %>/scripts.js" : [
					"<%= testjs %>/scripts.js"
				]
			}
		},
		prod : {
			options: {
				mangle : {
					except : ["jQuery"]
				},
				mangleProperties : true,
				reserveDOMProperties : true,
				exceptionsFiles : [".mangle.json"],
				report : "gzip",
				sourceMap : true,
				compress : true
			},
			files: {
				"<%= dist %>/js/scripts.min.js" : [
					"<%= testjs %>/scripts.js"
				]
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
};
