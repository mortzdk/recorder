module.exports = function (grunt) {
	"use strict";

	grunt.config("includeSource", {
		options : {
			templates : {
				html: {
					js: "<script type=\"text/javascript\" " + 
						"src=\"{filePath}\"></script>",
					css: "<link rel=\"stylesheet\" type=\"text/css\" " + 
						 "media=\"all\" href=\"{filePath}\" />",
					tmpl: "<script type=\"text/template\" " + 
						  "src=\"{filePath}\"></script>",
					testjs: "<script type=\"text/javascript\" " + 
						"src=\"{filePath}\" data-cover></script>",
					test: "<script type=\"text/javascript\" " + 
						"src=\"{filePath}\"></script>"
				}
			},
			ordering : "top-down"
		},
		dev : {
			options : {
				basePath: "<%= test %>",
				baseUrl : ""
			},
			files : {
				"<%= test %>/index.html" : "<%= test %>/index.template.html"
			}
		},
		prod : {
			options : {
				basePath: "<%= app %>",
				baseUrl : "",
			},
			files : {
				"<%= app %>/index.html" : "<%= app %>/index.template.html"
			}
		}
	});

	grunt.loadNpmTasks("grunt-include-source");
};
