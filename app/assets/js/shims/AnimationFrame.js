require([], function () {
	"use strict";

	var lastFrame, 
    	queue, 
    	timer, 
    	vendor, 
    	_i, 
    	_len, 
    	_ref1,
    	requestAnimationFrame = window.requestAnimationFrame,
		cancelAnimationFrame = window.cancelAnimationFrame,
    	method = "native", 
    	now  = Date.now || function() {
    		return new Date().getTime();
    	}, 
    	_ref = ["webkit", "moz", "o", "ms"];
	
	for (_i = 0, _len = _ref.length; _i < _len; _i+=1) {
		vendor = _ref[_i];
		if ( !requestAnimationFrame || !cancelAnimationFrame ) {
			requestAnimationFrame = window[vendor + "RequestAnimationFrame"];
			cancelAnimationFrame = window[vendor + "CancelAnimationFrame"];
		}
	}

	if ( !requestAnimationFrame || !cancelAnimationFrame ) {
		method = "timer";
		lastFrame = 0;
		queue = timer = undefined;
		requestAnimationFrame = function(callback) {
			var fire, nextFrame, time;
			if ( !!queue ) {
				queue.push(callback);
				return;
			}
			time = now();
			nextFrame = Math.max(0, 16.66 - (time - lastFrame));
			queue = [callback];
			lastFrame = time + nextFrame;
			fire = function() {
				var cb, q, _j, _len1;
				q = queue;
				queue = undefined;
				for (_j = 0, _len1 = q.length; _j < _len1; _j+=1) {
					cb = q[_j];
					cb(lastFrame);
				}
			};
			timer = setTimeout(fire, nextFrame);
		};
		cancelAnimationFrame = function () {
			if (!!timer) {
				clearTimeout(timer);
				timer = undefined;
			}
		};
	}
	requestAnimationFrame(function(time) {
		var offset, _ref1;
		if (time < 1e12) {
			_ref1 = window.performance;
			if ( !!_ref1 && !!_ref1.now ) {
				requestAnimationFrame.now = function() {
					return window.performance.now();
				};
				requestAnimationFrame.method = "native-highres";
			} else {
				offset = now() - time;
				requestAnimationFrame.now = function() {
					return now() - offset;
				};
				requestAnimationFrame.method = "native-highres-noperf";
			}
		} else {
			requestAnimationFrame.now = now;
		}
	});
	_ref1 = window.performance;
	requestAnimationFrame.now = (!!_ref1 && !!_ref1.now) ? 
		function() { return window.performance.now(); } : now;
	requestAnimationFrame.method = method;
	window.requestAnimationFrame = requestAnimationFrame;
	window.cancelAnimationFrame = cancelAnimationFrame;
});
