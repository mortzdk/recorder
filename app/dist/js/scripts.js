(function(window, document, location, navigator, undefined) {
    "use strict";
    var modulesRecorder;
    (function() {
        /**
        * @license addEventListener polyfill 1.0 / Eirik Backer / MIT Licence
        * https://gist.github.com/2864711/946225eb3822c203e8d6218095d888aac5e1748e
        */
        if ((!window.addEventListener || !window.removeEventListener) && window.attachEvent && window.detachEvent) {
            var listenersPropName = "x-ms-event-listeners";
            var isCallable = function(value) {
                return typeof value === "function";
            };
            var getListener = function(self, listener) {
                var listeners = listener[listenersPropName];
                if (listeners) {
                    var lis;
                    var i = listeners.length - 1;
                    while (i) {
                        lis = listeners[i];
                        if (lis[0] === self) {
                            return lis[1];
                        }
                        i -= 1;
                    }
                }
            };
            var setListener = function(self, listener, callback) {
                var listeners = listener[listenersPropName] || (listener[listenersPropName] = []);
                return getListener(self, listener) || (listeners[listeners.length] = [ self, callback ], 
                callback);
            };
            var docHijack = function(methodName) {
                var old = document[methodName];
                document[methodName] = function(v) {
                    return addListen(old(v));
                };
            };
            var addEvent = function(type, listener) {
                if (isCallable(listener)) {
                    var self = this;
                    self.attachEvent("on" + type, setListener(self, listener, function(e) {
                        e = e || window.event;
                        e.preventDefault = e.preventDefault || function() {
                            e.returnValue = false;
                        };
                        e.stopPropagation = e.stopPropagation || function() {
                            e.cancelBubble = true;
                        };
                        e.target = e.target || e.srcElement || document.documentElement;
                        e.currentTarget = e.currentTarget || self;
                        e.timeStamp = e.timeStamp || new Date().getTime();
                        listener.call(self, e);
                    }));
                }
            };
            var removeEvent = function(type, listener) {
                if (isCallable(listener)) {
                    var self = this;
                    var lis = getListener(self, listener);
                    if (lis) {
                        self.detachEvent("on" + type, lis);
                    }
                }
            };
            var addListen = function(obj) {
                var i = obj.length - 1;
                if (i) {
                    while (i) {
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
            addListen([ document, window ]);
            if ("Element" in window) {
                var element = window.Element;
                element.prototype.addEventListener = addEvent;
                element.prototype.removeEventListener = removeEvent;
            } else {
                document.attachEvent("onreadystatechange", function() {
                    addListen(document.all);
                });
                docHijack("getElementsByTagName");
                docHijack("getElementById");
                docHijack("createElement");
                addListen(document.all);
            }
        }
    })();
    (function() {
        var lastFrame, queue, timer, vendor, _i, _len, _ref1, requestAnimationFrame = window.requestAnimationFrame, cancelAnimationFrame = window.cancelAnimationFrame, method = "native", now = Date.now || function() {
            return new Date().getTime();
        }, _ref = [ "webkit", "moz", "o", "ms" ];
        for (_i = 0, _len = _ref.length; _i < _len; _i += 1) {
            vendor = _ref[_i];
            if (!requestAnimationFrame || !cancelAnimationFrame) {
                requestAnimationFrame = window[vendor + "RequestAnimationFrame"];
                cancelAnimationFrame = window[vendor + "CancelAnimationFrame"];
            }
        }
        if (!requestAnimationFrame || !cancelAnimationFrame) {
            method = "timer";
            lastFrame = 0;
            queue = timer = undefined;
            requestAnimationFrame = function(callback) {
                var fire, nextFrame, time;
                if (!!queue) {
                    queue.push(callback);
                    return;
                }
                time = now();
                nextFrame = Math.max(0, 16.66 - (time - lastFrame));
                queue = [ callback ];
                lastFrame = time + nextFrame;
                fire = function() {
                    var cb, q, _j, _len1;
                    q = queue;
                    queue = undefined;
                    for (_j = 0, _len1 = q.length; _j < _len1; _j += 1) {
                        cb = q[_j];
                        cb(lastFrame);
                    }
                };
                timer = setTimeout(fire, nextFrame);
            };
            cancelAnimationFrame = function() {
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
                if (!!_ref1 && !!_ref1.now) {
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
        requestAnimationFrame.now = !!_ref1 && !!_ref1.now ? function() {
            return window.performance.now();
        } : now;
        requestAnimationFrame.method = method;
        window.requestAnimationFrame = requestAnimationFrame;
        window.cancelAnimationFrame = cancelAnimationFrame;
    })();
    modulesRecorder = function() {
        var mX = 0, mY = 0, sX = 0, sY = 0, de = document.documentElement, queue = [], cursor = document.createElement("img"), raf;
        function Recorder() {
            window.addEventListener("mousemove", function(event) {
                if (!!event.pageX || !!event.pageY) {
                    mX = event.pageX;
                    mY = event.pageY;
                } else {
                    mX = event.clientX + (de.scrollLeft || document.body.scrollLeft) - (de.clientLeft || 0);
                    mY = event.clientY + (de.scrollTop || document.body.scrollTop) - (de.clientTop || 0);
                }
            }, false);
            window.addEventListener("scroll", function() {
                if (!!window.pageXOffset && !!window.pageYOffset) {
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
        Recorder.prototype.record = function() {
            var add = function() {
                queue.push([ mX, mY, sX, sY ]);
                raf = window.requestAnimationFrame(add);
            };
            if (!!raf) {
                window.cancelAnimationFrame(raf);
                raf = undefined;
            }
            queue.length = 0;
            console.log("RECORD");
            console.log(raf);
            raf = window.requestAnimationFrame(add);
            cursor.style.display = "none";
        };
        Recorder.prototype.stop = function() {
            console.log("STOP");
            console.log(raf);
            if (!!raf) {
                window.cancelAnimationFrame(raf);
                raf = undefined;
            }
        };
        Recorder.prototype.play = function() {
            var i = 0, play = function() {
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
            if (!raf) {
                raf = window.requestAnimationFrame(play);
            }
        };
        Recorder.prototype.constructor = Recorder;
        return Recorder;
    }();
    (function(Recorder) {
        var recorder = new Recorder();
        window.addEventListener("load", function() {
            document.getElementById("record").addEventListener("click", recorder.record, false);
            document.getElementById("stop").addEventListener("click", recorder.stop, false);
            document.getElementById("play").addEventListener("click", recorder.play, false);
        }, false);
    })(modulesRecorder);
})(window, window.document, window.location, window.navigator, void 0);
//# sourceMappingURL=scripts.js.map