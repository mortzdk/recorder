module.exports = function (grunt) {
	"use strict";

	grunt.config("htmlmin", {
		options : {	
			removeComments : true,
			removeCommentsFromCDATA : false,
			removeCDATASectionsFromCDATA : false,
			collapseWhitespace : true,
			conservativeCollapse : false,
			preserveLineBreaks : false,
			collapseBooleanAttributes : true,
			removeAttributeQuotes : true,
			removeRedundantAttributes : true,
			preventAttributesEscaping : true,
			useShortDoctype : false,
			removeEmptyAttributes : true,
			removeScriptTypeAttributes : false,
			removeStyleLinkTypeAttributes : false,
			removeOptionalTags : false,
			removeIgnored : false,
			removeEmptyElements : false,
			keepClosingSlash : true,
			caseSensitive : true
		},
		prod : {
			files: {
				"<%= app %>/index.min.html": "<%= app %>/index.html"
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-htmlmin");
};
