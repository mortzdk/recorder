define([], function () {
	"use strict";

	function RecorderEvent() {}
	RecorderEvent.prototype.constructor = RecorderEvent;

	/**
	 * Fire an event handler to the specified node. Event handlers can detect 
	 * that the event was fired programatically by testing for a 
	 * 'synthetic=true' property on the event object
	 * @param {HTMLNode} node The node to fire the event handler on.
	 * @param {String} eventName The name of the event without the "on" 
	 * (e.g., "focus")
	 */
	RecorderEvent.prototype.fire = function(node, eventName) {

		// Make sure we use the ownerDocument from the provided node to avoid 
		// cross-window problems
		var doc, event, bubbles, eventClass="";

		if (node && node.ownerDocument) {
			doc = node.ownerDocument;
		} else if (node && node.nodeType === 9){
			// the node may be the document itself, nodeType 9 = DOCUMENT_NODE
			doc = node;
		} else {
			throw new Error("Invalid node passed to fireEvent: " + node.id);
		}

		if (node.dispatchEvent) {
			// Different events have different event classes.
			// If this switch statement can't map an eventName to an eventClass,
			// the event firing is going to fail.
			switch (eventName) {
				case "click": // Dispatching of 'click' appears to not work 
				              // correctly in Safari. 
							  // Use 'mousedown' or 'mouseup' instead.
				case "mousedown":
				case "mouseup":
				case "mouseover":
				case "mouseout":
				case "mouseenter":
				case "mouseleave":
					eventClass = "MouseEvents";
					break;
				case "focus":
				case "change":
				case "blur":
				case "select":
					eventClass = "HTMLEvents";
					break;
				default:
					throw "fireEvent: Couldn't find an event class for " + 
						"event '" + eventName + "'.";
			}

			bubbles = eventName === "change" ? false : true;

			event = doc.createEvent(eventClass);
			// All events created as bubbling and cancelable.
			event.initEvent(eventName, bubbles, true); 
			// Allow detection of synthetic events
			event.synthetic = true; 


			// The second parameter says go ahead with the default action
			node.dispatchEvent(event, true);
		} else if (node.fireEvent) {
			// IE-old school style
			event = doc.createEventObject();
			// Allow detection of synthetic events
			event.synthetic = true;

			node.fireEvent("on" + eventName, event);
		} else {
			throw new Error("Browser does not support event triggering");
		}
	};

	return RecorderEvent;
});
