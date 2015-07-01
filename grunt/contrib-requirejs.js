module.exports = function (grunt) {
	"use strict";

	grunt.config("requirejs", {
		all : {
			options : {
				name: "main",
				baseUrl: "<%= jsdir %>",
				mainConfigFile: "<%= jsdir %>/config.js",
				paths : {
					modules: "./modules",
					classes: "./classes",
					shims: "./shims"
				},
				optimize: "none",
				optimizeCss: "none",
				useStrict: true,
				skipModuleInsertion: true,
				findNestedDependencies: true,
				out : "<%= testjs %>/scripts.js",
				onModuleBundleComplete: function(data) {
					var fs = require("fs"),
					amdclean = require("amdclean"),
					outputFile = data.path;

					fs.writeFileSync(
						outputFile, 
						amdclean.clean({
							filePath: outputFile,
							escodegen: {
								comment: true,
								format: {
									indent: {
										style: "    ",
										adjustMultilineComment: true,
										base : 1
									},
									newline: "\n",
									space: " ",
									quotes: "double"
								}
							},
							prefixMode : "camelCase",
							createAnonymousAMDModule: true,
							wrap : {
								start : ";(function (window, document, " + 
										  "location, navigator, undefined) {" +
										  "\n\t\"use strict\";\n\n",
								end : "\n}(window, window.document, " + 
										"window.location, window.navigator, " + 
										"void(0)));"
							}
						})
					);
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-requirejs");
};
