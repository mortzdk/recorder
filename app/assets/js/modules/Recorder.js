/* global docElem:false */
define([
	"../modules/RecorderEvent",
	"../shims/EventListener", 
	"../shims/AnimationFrame"
], function (RecorderEvent) {
	"use strict";

	var mX = 0, 
	    mY = 0,
	    sX = 0,
	    sY = 0,
		frame = 0,
		playing = false,
	    queue = [],
		cursor,
	    raf,
		target,
		oldTarget,
		rec = new RecorderEvent(),
			
		// Enumerate Events
		CLICK = 0,
//		MOUSEDOWN = 1,
		MOUSEUP = 2,
		MOUSEMOVE = 3,
//		SCROLL = 4,
//
		// Helper functions
		getTarget = function () {
			window.scrollTo(queue[frame][3], queue[frame][4]);

			// Get target element, and place cursor below all elements
			cursor.style.zIndex = -1;
			target = document.elementFromPoint(
				queue[frame][1], 
				queue[frame][2]
			);
			cursor.style.zIndex = "auto";

			return target;
		},
		isDecendant = function (parent, child) {
			var node = child.parentNode;
			while ( !!node ) {
				if (node === parent) {
					return true;
				}
				node = node.parentNode;
			}
			return false;
		},

		// Event handlers
		click = function () {
			queue.push([CLICK, mX, mY, sX, sY]);
		}, 
		mouseup = function () {
			if ( !!window.getSelection ) {
				console.log("GET");
				console.log(window.getSelection());
			} else if ( !!document.selection ) {
				console.log(document.selection.createRange());
			} else {
				throw new Error("Browser does not support selection");
			}
		},
		move = function () {
			queue.push([MOUSEMOVE, mX, mY, sX, sY]);
			raf = window.requestAnimationFrame(move);
		},
		play = function () {
			if (frame >= queue.length) {
				frame = 0;
				playing = false;
				cursor.style.display = "none";
				document.body.className = "";

				window.cancelAnimationFrame(raf);
				target = oldTarget = raf = undefined;
				return;
			}

			switch (queue[frame][0]) {
				case MOUSEUP:
					break;
				case MOUSEMOVE:
					// Set position of fake cursor
					cursor.style.left = queue[frame][1] + "px";
					cursor.style.top = queue[frame][2] + "px";
					cursor.style.display = "inherit";

					// Get target that cursor points on
					target = getTarget();
					if ( !target ) {
						break;
					}

					// If target has changed
					if (oldTarget !== target) {
						if ( !!oldTarget ) {
							rec.fire(oldTarget, "mouseout");			
							if ( !isDecendant(target, oldTarget) &&
								 !isDecendant(oldTarget, target) ) {
								rec.fire(oldTarget, "mouseleave");			
								rec.fire(target, "mouseenter");
							}
						}

						rec.fire(target, "mouseover");

						oldTarget = target;
					}

					break;
				case CLICK:
					target = getTarget();

					if ( !!target ) {
						rec.fire(target, "click");			
					}
					break;
			}

			frame += 1;
			raf = window.requestAnimationFrame(play);
		};		
		

	function Recorder() {

		window.addEventListener("mousemove", function (event) {
			if ( !!event.pageX || !!event.pageY ) {
				mX = event.pageX;
				mY = event.pageY;
			} else {
				mX = event.clientX + 
					(docElem.scrollLeft || document.body.scrollLeft) - 
					(docElem.clientLeft || 0);
				mY = event.clientY + 
					(docElem.scrollTop || document.body.scrollTop) -
					(docElem.clientTop || 0);
			}
		}, false);

		window.addEventListener("scroll", function () {
			if ( !!window.pageXOffset && !!window.pageYOffset ) {
				sX = window.pageXOffset;
				sY = window.pageYOffset;
			} else {
				sX = docElem.scrollLeft || document.body.scrollLeft;
				sY = docElem.scrollTop || document.body.scrollTop;
			}
		}, false);

		// Create cursor and append to DOM
		cursor = document.createElement("img");
		cursor.style.position = "absolute";
		cursor.style.display = "none";
		cursor.src = "dist/images/cursor.png";
		cursor.className = "cursor";
		document.body.insertBefore(cursor, document.body.lastChild.nextSibling);

	}

	Recorder.prototype.start = function () {
		console.log("START");

		if ( playing ) {
			return;
		}

		if ( !!raf ) {
			window.cancelAnimationFrame(raf);
			raf = undefined;
		}

		// Reset array
		queue.length = 0;

		window.addEventListener("click", click, false);
		window.addEventListener("mouseup", mouseup, false);

		raf = window.requestAnimationFrame(move);

		cursor.style.display = "none";

	};
	
	Recorder.prototype.stop = function () {
		console.log("STOP");

		if ( playing ) {
			return;
		}

		if ( !!raf ) {
			window.cancelAnimationFrame(raf);
			raf = undefined;
		}

		window.removeEventListener("click", click);
	};

	Recorder.prototype.play = function () {
		console.log("PLAY");

		if ( !raf ) {
			playing = true;
			document.body.className = "hide-cursor";
//		document.body.style.cursor = "none";
//		document.body.style.cursor = 
//			"url('data:image/png;base64," + 
//			"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4" + 
//			"c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdE" + 
//			"VYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjbQg61aAAAADUlEQVQYV2P4/" + 
//			"/8/IwAI/QL/+TZZdwAAAABJRU5ErkJggg==')," + 
//			"url('images/blank.cur')," + 
//			"none !important";
			raf = window.requestAnimationFrame(play);
		}
	};

	Recorder.prototype.constructor = Recorder;
	
	return Recorder;
});
