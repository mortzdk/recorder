define(["../shims/EventListener", "../shims/AnimationFrame"], function () {
	"use strict";

	var mX = 0, 
	    mY = 0,
	    sX = 0,
	    sY = 0,
	    de = document.documentElement,
	    queue = [],
		cursor = document.createElement("img"),
	    raf;

	function Recorder() {
		window.addEventListener("mousemove", function (event) {
			if ( !!event.pageX || !!event.pageY ) {
				mX = event.pageX;
				mY = event.pageY;
			} else {
				mX = event.clientX + 
					(de.scrollLeft || document.body.scrollLeft) - 
					(de.clientLeft || 0);
				mY = event.clientY + 
					(de.scrollTop || document.body.scrollTop) -
					(de.clientTop || 0);
			}
		}, false);

		window.addEventListener("scroll", function () {
			if ( !!window.pageXOffset && !!window.pageYOffset ) {
				sX = window.pageXOffset;
				sY = window.pageYOffset;
			} else {
				sX = de.scrollLeft || document.body.scrollLeft;
				sY = de.scrollTop || document.body.scrollTop;
			}
		}, false);

		cursor.src = "dist/images/cursor.png";
		cursor.className = "cursor";

		document.body.appendChild(cursor);
	}

	Recorder.prototype.record = function () {
		var add = function () {
			queue.push([mX, mY, sX, sY]);

			raf = window.requestAnimationFrame(add);
		};

		if ( !!raf ) {
			window.cancelAnimationFrame(raf);
			raf = undefined;
		}

		// Reset array
		queue.length = 0;

		console.log("RECORD");
		console.log(raf);

		raf = window.requestAnimationFrame(add);

		cursor.style.display = "none";
	};
	
	Recorder.prototype.stop = function () {
		console.log("STOP");
		console.log(raf);
		if ( !!raf ) {
			window.cancelAnimationFrame(raf);
			raf = undefined;
		}
	};

	Recorder.prototype.play = function () {
		var i = 0,
		    play = function () {
				cursor.style.display = "inherit";
				if (i < queue.length) {
					cursor.style.left = queue[i][0] + "px";
					cursor.style.top = queue[i][1] + "px";
					window.scrollTo(queue[i][2], queue[i][3]);
					i += 1;

					raf = window.requestAnimationFrame(play);
				} else {
					window.cancelAnimationFrame(raf);
					raf = undefined;
					console.log(queue);
				}
			};

		console.log("PLAY");
		console.log(raf);

		if ( !raf ) {
			raf = window.requestAnimationFrame(play);
		}
	};

	Recorder.prototype.constructor = Recorder;
	
	return Recorder;
});
