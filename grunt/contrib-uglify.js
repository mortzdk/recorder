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
				"<%= testjs %>/<%= pkg.name %>.js" : [
					"<%= testjs %>/<%= pkg.name %>.js"
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
				"<%= dist %>/js/<%= pkg.name %>.min.js" : [
					"<%= testjs %>/<%= pkg.name %>.js"
				]
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
};
