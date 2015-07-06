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
		hiddenInput,
		hiddenDiv,
		cursor,
	    raf,
		target,
		oldTarget,
		selection,
		range,

		// Constants
		objectPrototype = Object.prototype,
		number = "Number",
		rec = new RecorderEvent(),
		isIE = (function () {
			var result = false
			
			/* jshint ignore:start */
			result = new Function("return/*@cc_on!@*/!1")() || 
			( isNumber(document.documentMode) && document.documentMode <= 10 );
			/* jshint ignore:end */

			return result;
		}()),
			
		// Enumerate Events
		CLICK = 0,
//		MOUSEDOWN = 1,
		MOUSEUP = 2,
		MOUSEMOVE = 3,
//		SCROLL = 4,
		PASTE = 5,

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
		isDecendant = function (_parent, _child) {
			var node = _child.parentNode;
			while ( !!node ) {
				if (node === _parent) {
					return true;
				}
				node = node.parentNode;
			}
			return false;
		},
		isNumber = function (_arg) {
			return typeof _arg === number.toLowerCase() || objectPrototype
				.toString.call(_arg) === "[object " + number + "]";
		},
		setStyle = function (_elem, _props) {
			var prop;
			for (prop in _props) {
				if (objectPrototype.hasOwnProperty.call(_props, prop)) {
					_elem.style[prop] = _props[prop];
				}
			}
		},
		empty = function(_elem) {
			while (_elem.hasChildNodes()) {
				_elem.removeChild(_elem.childNodes[0]);
			}
		},

		// Event handlers
		scroll = function () {
			if ( !!window.scrollX && !!window.scrollY ) {
				sX = window.scrollX;
				sY = window.scrollY;
			} else if ( !!window.pageXOffset && !!window.pageYOffset ) {
				sX = window.pageXOffset;
				sY = window.pageYOffset;
			} else {
				sX = docElem.scrollLeft || document.body.scrollLeft;
				sY = docElem.scrollTop || document.body.scrollTop;
			}
			return {"x" : sX, "y" : sY};
		},
		click = function () {
			queue.push([CLICK, mX, mY, sX, sY]);
		}, 
		paste = function (event) {
			if (isIE) {
				empty(hiddenDiv);
				setTimeout(function() {
					empty(hiddenDiv);
					hiddenInput.value = " ";
					hiddenInput.focus().select() = " ";
				}, 0);
			} else {

			}
			void PASTE;
			if (!!window.clipboardData && !!window.clipboardData.getData) {
				console.log(window.clipboardData.getData("Text"));
			} else if (!!event.clipboardData && !!event.clipboardData.getData) {
				console.log(event.clipboardData.getData("text/plain"));
			} else {
				throw new Error("Browser does not support inspection of " + 
						"clipboard data");
			}
		},
		mouseup = function () {
			var scr = scroll.call(),
			    aRect,
			    aX = scr.x,
			    aY = scr.y,
			    aO,
			    fRect,
			    fX = scr.x,
			    fY = scr.y,
			    fO;

			if ( !!window.getSelection || !!document.getSelection ) {
				selection = (window.getSelection || document.getSelection)
					.call();

				if ( !selection.anchorNode || !selection.focusNode ) {
					return;
				}

				aRect = selection.anchorNode.parentNode.getBoundingClientRect();
				fRect = selection.focusNode.parentNode.getBoundingClientRect();

				aX += aRect.left;
				aY += aRect.top;
				aO = selection.anchorOffset;

				fX += fRect.left;
				fY += fRect.top;
				fO = selection.focusOffset;

				if (fO > aO) {
					queue.push([MOUSEUP, aX, aY, aO, fX, fY, fO]);
				} else {
					queue.push([MOUSEUP, fX, fY, fO, aX, aY, aO]);
				}
			} else if ( !!document.selection ) {
				range = window.selection.createRange();

				aRect = range.getBoundingClientRect();

				//queue.push([MOUSEUP, aX, aY, fX, fY]);
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
					if ( !!window.getSelection || !!document.getSelection ) {
						range = document.createRange();
						range.setStart(
							document.elementFromPoint(
								queue[frame][1], queue[frame][2]
							).firstChild,
							queue[frame][3]
						);
						range.setEnd(
							document.elementFromPoint(
								queue[frame][4], queue[frame][5]
							).firstChild,
							queue[frame][6]
						);

						selection = (window.getSelection || 
							document.getSelection).call();
						selection.removeAllRanges();
						selection.addRange(range);
					}
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

					cursor.src = "dist/images/cursors/default.png";
					if (target.nodeName === "A") {
						// ANCHOR Element
						cursor.src = "dist/images/cursors/pointer.png";
					} else if ( target.nodeType === 3 || 
						 (target.childNodes.length === 1 && 
						  target.childNodes[0].nodeType === 3 &&
						  target.nodeValue !== "") ) {
						// TEXT Element
						cursor.src = "dist/images/cursors/text.png";
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
		var hiddenCss = {
			position : "absolute",
			bottom : 0,
			left : 0,
			width : "1px",
			height : "1px",
			display : "block",
			fontSize : 1,
			zIndex : -1,
			color : "transparent",
			background : "transparent",
			overflow : "hidden",
			padding : 0,
			resize : "none",
			outline : "none",
			WebkitUserSelect : "text",
			userSelect : "text"
		};

		window.addEventListener("mousemove", function (event) {
			if ( !!event.pageX && !!event.pageY ) {
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

		window.addEventListener("scroll", scroll, false);

		hiddenInput = document.createElement("input");
		hiddenInput.value = "";
		hiddenInput.type = "text";

		hiddenDiv = document.createElement("div");
		hiddenDiv.contenteditable = "true";

		setStyle(hiddenInput, hiddenCss);
		setStyle(hiddenDiv, hiddenCss);

		document.body.insertBefore(hiddenInput, 
				document.body.lastChild.nextSibling);
		document.body.insertBefore(hiddenDiv, 
				document.body.lastChild.nextSibling);

		// Create cursor and append to DOM
		cursor = document.createElement("img");
		setStyle(cursor, {
			position : "absolute",
			display : "none"
		});
		cursor.src = "dist/images/cursors/text.png";
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

		cursor.style.display = "none";

		/* MouseEvents */
		window.addEventListener("click", click, false);
		// window.addEventListener("dblclick", dblclick, false);
		// window.addEventListener("contextmenu", contextmenu, false);
		window.addEventListener("mouseup", mouseup, false);

		// Drag and Drop
		// window.addEventListener("drag", drag, false);
		// window.addEventListener("dragstart", dragstart, false);
		// window.addEventListener("dragend", dragend, false);
		// window.addEventListener("dragover", dragover, false);
		// window.addEventListener("dragenter", dragenter, false);
		// window.addEventListener("dragleave", dragleave, false);
		// window.addEventListener("drop", drop, false);
	
		/* TouchEvents */
		// window.addEventListener("touchstart", touchstart, false);
		// window.addEventListener("touchmove", touchmove, false);
		// window.addEventListener("touchend", touchend, false);
		// window.addEventListener("touchenter", touchenter, false);
		// window.addEventListener("touchleave", touchleave, false);
		// window.addEventListener("touchcancel", touchcancel, false);

		/* KeyEvents */
		// window.addEventListener("keypress", keypress, false);
		// window.addEventListener("keydown", keydown, false);
		// window.addEventListener("keyup", keyup, false);
		
		/* HTMLEvents */
		// window.addEventListener("change", change, false);
		// window.addEventListener("blur", blur, false);
		// window.addEventListener("focus", focus, false);
		// window.addEventListener("resize", resize, false);
		// window.addEventListener("reset", reset, false);
		// window.addEventListener("copy", copy, false);
		// window.addEventListener("cut", cut, false);
		document.addEventListener("paste", paste, false);
		// window.addEventListener("submit", submit, false);

		raf = window.requestAnimationFrame(move);
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

		/* MouseEvents */
		window.removeEventListener("click", click, false);
		// window.removeEventListener("dblclick", dblclick, false);
		// window.removeEventListener("contextmenu", contextmenu, false);
		window.removeEventListener("mouseup", click, false);

		// Drag and Drop
		// window.removeEventListener("drag", drag, false);
		// window.removeEventListener("dragstart", dragstart, false);
		// window.removeEventListener("dragend", dragend, false);
		// window.removeEventListener("dragover", dragover, false);
		// window.removeEventListener("dragenter", dragenter, false);
		// window.removeEventListener("dragleave", dragleave, false);
		// window.removeEventListener("drop", drop, false);
	
		/* TouchEvents */
		// window.removeEventListener("touchstart", touchstart, false);
		// window.removeEventListener("touchmove", touchmove, false);
		// window.removeEventListener("touchend", touchend, false);
		// window.removeEventListener("touchenter", touchenter, false);
		// window.removeEventListener("touchleave", touchleave, false);
		// window.removeEventListener("touchcancel", touchcancel, false);

		/* KeyEvents */
		// window.removeEventListener("keypress", keypress, false);
		// window.removeEventListener("keydown", keydown, false);
		// window.removeEventListener("keyup", keyup, false);
		
		/* HTMLEvents */
		// window.removeEventListener("copy", copy, false);
		// window.removeEventListener("cut", cut, false);
		document.removeEventListener("beforepaste", paste, false);
		document.removeEventListener("paste", paste, false);
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
//			
			raf = window.requestAnimationFrame(play);
		}
	};

	Recorder.prototype.constructor = Recorder;
	
	return Recorder;
});
