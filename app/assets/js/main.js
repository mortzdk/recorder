require([
	"./modules/Recorder"
], function (Recorder) {
	"use strict";
		
	var recorder = new Recorder();

	window.addEventListener("load", function () {
		document.getElementById("record").addEventListener(
			"click", 
			recorder.record,
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
