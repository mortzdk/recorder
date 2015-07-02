require([
	"./modules/Recorder"
], function (Recorder) {
	"use strict";
		
	var recorder = new Recorder();

	window.addEventListener("load", function () {
		document.getElementById("start").addEventListener(
			"click", 
			recorder.start,
			false
		);

		document.getElementById("stop").addEventListener(
			"click", 
			recorder.stop,
			false
		);

		document.getElementById("play").addEventListener(
			"click", 
			recorder.play,
			false
		);
	}, false);
});
