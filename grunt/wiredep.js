module.exports = function (grunt) {
	"use strict";

	grunt.config("wiredep", {
		dev : {
			options : {
				devDependencies : true,
				overrides : {
					"blanket" : {
						"main" : [
							"dist/qunit/blanket.js", 
							"dist/qunit/grunt-reporter.js"
						]
					}
				},
				fileTypes : {
					html: {
						block:
	/((\[*)<!--\s*bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi,
						detect: {
							js: /<script.*src=['"]([^'"]+)/gi,
							css: /<link.*href=['"]([^'"]+)/gi
						},
						replace: {
							js: function (filePath) {
								var b = filePath.indexOf("blanket.js"),
								    r = filePath.indexOf(
										"grunt-reporter.js"
									);
								if ( b !== -1) {
									return "\t\t<script " + 
										"type=\"text/javascript\" " + 
										"src=\"" + filePath + "\" " + 
										"data-cover-flags=\"debug\">" +
										"</script>";
								} else if ( r !== -1 ) {
									return "\t\t<script " + 
		"type=\"text/javascript\"><!--//--><![CDATA[//><!--\n" +
		"\t\tif (window.location.href.indexOf(\"gruntReport\") > 0) {\n" +
		"\t\t\tblanket.options(\"reporter\", \"" + filePath + "\")\n" +
		"\t\t}\n" +
		"\t\t//--><!]]></script>";
								} else {
									return "\t\t<script " +
										"type=\"text/javascript\" " + 
										"src=\"" + filePath +"\">" + 
										"</script>";
								}
							},
							css: "\t\t<link rel=\"stylesheet\" " + 
								"type=\"text/css\" " + 
								"media=\"all\" " + 
								"href=\"{{filePath}}\" />"
						}
					}
				}
			},
			src : [
				"<%= test %>/index.html"
			]
		}
	});

	grunt.loadNpmTasks("grunt-wiredep");
};
