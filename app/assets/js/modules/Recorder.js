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
//		hiddenInput,
//		hiddenDiv,
		cursor,
	    raf,
		target,
		oldTarget,
		selection,
		range,
		style,

		// Constants
		head = document.head || document.getElementsByTagName("head")[0],
		body = document.body || document.getElementsByTagName("body")[0],
		objectPrototype = Object.prototype,
//		number = "Number",
		TEXTAREA = "textarea",
		INPUT = "input",
		rec = new RecorderEvent(),
//		isIE = (function () {
//			var result = false;
//			
//			/* jshint ignore:start */
//			result = new Function("return/*@cc_on!@*/!1")() ||
//	( isNumber(document.documentMode) && document.documentMode <= 10 );
//			/* jshint ignore:end */
//
//			return result;
//		}()),
			
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
			setStyle(cursor, {"zIndex" : -1});
			target = elementFromPoint(queue[frame][1], queue[frame][2]);
			setStyle(cursor, {"zIndex" : "auto"});

			return target;
		},
		elementFromPoint = function (_x, _y) {
			return document.elementFromPoint(_x, _y);
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
		setStyle = function (_elem, _props) {
			var prop;
			for (prop in _props) {
				if (objectPrototype.hasOwnProperty.call(_props, prop)) {
					_elem.style[prop] = _props[prop];
				}
			}
		},
		round = function(_x) {
			return Math.round(_x);
		},
		toLowerCase = function(_string) {
			return _string.toLowerCase();
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
				sX = docElem.scrollLeft || body.scrollLeft;
				sY = docElem.scrollTop || body.scrollTop;
			}
			return {"x" : sX, "y" : sY};
		},
		click = function () {
			queue.push([CLICK, mX, mY, sX, sY]);
		}, 
		paste = function (event) {
			var scr = scroll.call(),
			    rect = document.activeElement.getBoundingClientRect(),
			    x = round(scr.x + rect.left),
			    y = round(scr.y + rect.top);

			if (!!window.clipboardData && !!window.clipboardData.getData) {
				queue.push(
					[PASTE, x, y, window.clipboardData.getData("Text")]
				);
			} else if (!!event.clipboardData && !!event.clipboardData.getData) {
				queue.push(
					[PASTE, x, y, event.clipboardData.getData("text/plain")]
				);
			} else {
				throw new Error("Browser does not support inspection of " + 
						"clipboard data");
			}
		},
		mouseup = function () {
			var activeElement = document.activeElement,
			    anchorNode,
			    focusNode,
			    scr = scroll.call(),
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

				if ( toLowerCase(activeElement.tagName) === TEXTAREA || 
					 toLowerCase(activeElement.tagName) === INPUT ) {
					anchorNode = activeElement;
					focusNode = activeElement;
					aO = activeElement.selectionStart;
					fO = activeElement.selectionEnd;
				} else if ( !!selection.anchorNode && !!selection.focusNode ) {
					anchorNode = selection.anchorNode.nodeType === 3 ? 
						selection.anchorNode.parentNode : selection.anchorNode;
					focusNode = selection.focusNode.nodeType === 3 ? 
						selection.focusNode.parentNode : selection.focusNode;
					aO = selection.anchorOffset;
					fO = selection.focusOffset;
				} else {
					return;
				}

				aRect = anchorNode.getBoundingClientRect();
				fRect = focusNode.getBoundingClientRect();

				aX = round(aX + aRect.left);
				aY = round(aY + aRect.top);

				fX = round(fX + fRect.left);
				fY = round(fY + fRect.top);

				if (fO > aO) {
					queue.push([MOUSEUP, aX, aY, aO, fX, fY, fO]);
				} else {
					queue.push([MOUSEUP, fX, fY, fO, aX, aY, aO]);
				}
			} else if ( !!document.selection ) {
				/* TODO */
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
			var start, end;
			if (frame >= queue.length) {
				frame = 0;
				playing = false;
				setStyle(cursor, {"display" : "none"});
				head.removeChild(style);

				window.cancelAnimationFrame(raf);
				target = oldTarget = raf = undefined;
				return;
			}

			switch (queue[frame][0]) {
				case PASTE:
					console.log(queue[frame]);
					break;
				case MOUSEUP:
					if ( !!window.getSelection || !!document.getSelection ) {
						start = elementFromPoint(
							queue[frame][1], queue[frame][2]
						);
						end = elementFromPoint(
							queue[frame][4], queue[frame][5]
						);

						if ( (toLowerCase(start.tagName) === TEXTAREA ||
							 toLowerCase(start.tagName) === INPUT) && 
							 (toLowerCase(end.tagName) === TEXTAREA ||
							 toLowerCase(end.tagName) === INPUT) &&
							 start === end ) {
							
							end.selectionStart = queue[frame][3];
							end.selectionEnd = queue[frame][6];
							end.focus();

							break;
						}

						start = start.firstChild;
						end = end.firstChild;

						range = document.createRange();
						range.setStart(start, queue[frame][3]);
						range.setEnd(end, queue[frame][6]);

						selection = (window.getSelection || 
									 document.getSelection).call();
						selection.removeAllRanges();
						selection.addRange(range);
						
					} else if ( !!document.selection ) {
						/* TODO */
						void(0);
					}
					break;
				case MOUSEMOVE:
					// Set position of fake cursor
					setStyle(cursor, {
						"left" : queue[frame][1] + "px",
						"top" : queue[frame][2] + "px",
						"display" : "inherit"
					});

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
						  target.nodeValue !== "" ||
						  toLowerCase(target.tagName) === TEXTAREA ||
						  toLowerCase(target.tagName) === INPUT) ) {
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
		var cursorCss = "body, body * {" + 
			"cursor: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUg" +
			"AAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1" +
			"BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVY" +
			"dFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjbQg61aAAAADUlEQ" +
			"VQYV2P4//8/IwAI/QL/+TZZdwAAAABJRU5ErkJggg=='), " + 
			"url('dist/images/blank.cur'), none !important;" + 
			"}";

		window.addEventListener("mousemove", function (event) {
			if ( !!event.pageX && !!event.pageY ) {
				mX = event.pageX;
				mY = event.pageY;
			} else {
				mX = event.clientX + 
					(docElem.scrollLeft || body.scrollLeft) - 
					(docElem.clientLeft || 0);
				mY = event.clientY + 
					(docElem.scrollTop || body.scrollTop) -
					(docElem.clientTop || 0);
			}
		}, false);

		window.addEventListener("scroll", scroll, false);

		style = document.createElement("style");
		style.type = "text/css";
		if (style.styleSheet) {
			style.styleSheet.cssText = cursorCss;
		} else {
			style.insertBefore(
				document.createTextNode(cursorCss), style.lastChild
			);
		}

		// Create cursor and append to DOM
		cursor = document.createElement("img");
		setStyle(cursor, {
			"position" : "absolute",
			"display" : "none"
		});
		cursor.src = "dist/images/cursors/text.png";
		body.insertBefore(cursor, body.lastChild.nextSibling);

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

		setStyle(cursor, {"display" : "none"});

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
		window.removeEventListener("mouseup", mouseup, false);

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
		document.removeEventListener("paste", paste, false);
	};

	Recorder.prototype.play = function () {
		console.log("PLAY");

		if ( !raf ) {
			playing = true;

			head.insertBefore(style, head.lastChild.nextSibling);
			
			raf = window.requestAnimationFrame(play);
		}
	};

	Recorder.prototype.constructor = Recorder;
	
	return Recorder;
});
