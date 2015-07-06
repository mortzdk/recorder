/* global docElem:false */
require([], function () {
	"use strict";

	/**
	 * @license addEventListener polyfill 1.0 / Eirik Backer / MIT Licence
	 * https://gist.github.com/2864711/946225eb3822c203e8d6218095d888aac5e1748e
	 */
	if ( (!window.addEventListener || !window.removeEventListener) && 
		 (!!window.attachEvent && !!window.detachEvent) ) {

		var listenersPropName = "x-ms-event-listeners";

		/**
		 * @param {*} value
		 * @return {boolean}
		 */
		var isCallable = function (value) {
			return typeof value === "function";
		};
		/**
		 * @param {!Window|HTMLDocument|Node} self
		 * @param {EventListener|function(!Event):(boolean|undefined)} 
		 * listener
		 * @return {!function(Event)|undefined}
		 */
		var getListener = function (self, listener) {
			var listeners = listener[listenersPropName];
			if (listeners) {
				var lis;
				var i = listeners.length-1;
				while (i > -1) {
					lis = listeners[i];
					if (lis[0] === self) {
						return lis[1];
					}
					i -= 1;
				}
			}
		};
		/**
		 * @param {!Window|HTMLDocument|Node} self
		 * @param {EventListener|function(!Event):(boolean|undefined)} 
		 * listener
		 * @param {!function(Event)} callback
		 * @return {!function(Event)}
		 */
		var setListener = function (self, listener, callback) {
			var listeners = listener[listenersPropName] || 
				(listener[listenersPropName] = []);
			return getListener(self, listener) || 
				(listeners[listeners.length] = [self, callback], callback);
		};
		/**
		 * @param {string} methodName
		 */
		var docHijack = function (methodName) {
			var old = document[methodName];
			document[methodName] = function (v) {
				return addListen(old(v));
			};
		};
		/**
		 * @this {!Window|HTMLDocument|Node}
		 * @param {string} type
		 * @param {EventListener|function(!Event):(boolean|undefined)} 
		 * listener
		 * @param {boolean=} useCapture
		 */
		var addEvent = function (type, listener /*, useCapture*/) {
			if (isCallable(listener)) {
				var self = this;

				type = ("blur" === type) ? "focusout" : type;
				type = ("focus" === type) ? "focusin" : type;
				
				self.attachEvent(
					"on" + type,
					setListener(self, listener, function (e) {
						e = e || window.event;
						e.preventDefault = e.preventDefault || 
							function () { e.returnValue = false; };
						e.stopPropagation = e.stopPropagation || 
							function () { e.cancelBubble = true; };
						e.target = e.target || e.srcElement || docElem;
						e.currentTarget = e.currentTarget || self;
						e.timeStamp = e.timeStamp || (new Date()).getTime();
						listener.call(self, e);
					})
				);
			}
		};
		/**
		 * @this {!Window|HTMLDocument|Node}
		 * @param {string} type
		 * @param {EventListener|function(!Event):(boolean|undefined)} 
		 * listener
		 * @param {boolean=} useCapture
		 */
		var removeEvent = function (type, listener/*, useCapture*/) {
			if (isCallable(listener)) {
				var self = this;
				var lis = getListener(self, listener);
				if (lis) {
					self.detachEvent("on" + type, lis);
				}
			}
		};
		/**
		 * @param {!Node|NodeList|Array} obj
		 * @return {!Node|NodeList|Array}
		 */
		var addListen = function (obj) {
			var i = obj.length-1;
			if (i > -1) {
				while (i > -1) {
					obj[i].addEventListener = addEvent;
					obj[i].removeEventListener = removeEvent;
					i -= 1;
				}
			} else {
				obj.addEventListener = addEvent;
				obj.removeEventListener = removeEvent;
			}
			return obj;
		};

		addListen([document, window]);
		if ("Element" in window) {
			/**
			 * IE8
			 */
			var element = window.Element;
			element.prototype.addEventListener = addEvent;
			element.prototype.removeEventListener = removeEvent;
		} else {
			/**
			 * IE < 8
			 */
			//Make sure we also init at domReady
			document.attachEvent("onreadystatechange", function () {
				addListen(document.all);
			});
			docHijack("getElementsByTagName");
			docHijack("getElementById");
			docHijack("createElement");
			addListen(document.all);
		}
	}
});
