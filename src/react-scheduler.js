/** @license React v16.4.0
 * react-scheduler.development.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.ReactScheduler = {})));
}(this, (function (exports) { 'use strict';

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

/**
 * Simple, lightweight module assisting with the detection and context of
 * Worker. Helps avoid circular dependencies and allows code to reason about
 * whether or not they are in a Worker, even if they never include the main
 * `ReactWorker` dependency.
 */
var ExecutionEnvironment = {

  canUseDOM: canUseDOM,

  canUseWorkers: typeof Worker !== 'undefined',

  canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),

  canUseViewport: canUseDOM && !!window.screen,

  isInWorker: !canUseDOM // For now, this is true - might change in the future.

};

var ExecutionEnvironment_1 = ExecutionEnvironment;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

var emptyFunction_1 = emptyFunction;

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */





/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction_1;

{
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

var warning_1 = warning;

{
  if (ExecutionEnvironment_1.canUseDOM && typeof requestAnimationFrame !== 'function') {
    warning_1(false, 'React depends on requestAnimationFrame. Make sure that you load a ' + 'polyfill in older browsers. https://fb.me/react-polyfills');
  }
}

/**
 * A scheduling library to allow scheduling work with more granular priority and
 * control than requestAnimationFrame and requestIdleCallback.
 * Current TODO items:
 * X- Pull out the scheduleWork polyfill built into React
 * X- Initial test coverage
 * X- Support for multiple callbacks
 * - Support for two priorities; serial and deferred
 * - Better test coverage
 * - Better docblock
 * - Polish documentation, API
 */

// This is a built-in polyfill for requestIdleCallback. It works by scheduling
// a requestAnimationFrame, storing the time for the start of the frame, then
// scheduling a postMessage which gets scheduled after paint. Within the
// postMessage handler do as much work as possible until time + frame rate.
// By separating the idle call into a separate event tick we ensure that
// layout, paint and other browser work is counted against the available time.
// The frame rate is dynamically adjusted.

var hasNativePerformanceNow = typeof performance === 'object' && typeof performance.now === 'function';

exports.now = void 0;
if (hasNativePerformanceNow) {
  exports.now = function () {
    return performance.now();
  };
} else {
  exports.now = function () {
    return Date.now();
  };
}

// TODO: There's no way to cancel, because Fiber doesn't atm.
exports.scheduleWork = void 0;
exports.cancelScheduledWork = void 0;

if (!ExecutionEnvironment_1.canUseDOM) {
  var callbackIdCounter = 0;
  // Timeouts are objects in Node.
  // For consistency, we'll use numbers in the public API anyway.
  var timeoutIds = {};

  exports.scheduleWork = function (callback, options) {
    var callbackId = callbackIdCounter++;
    var timeoutId = setTimeout(function () {
      callback({
        timeRemaining: function () {
          return Infinity;
        },

        didTimeout: false
      });
    });
    timeoutIds[callbackId] = timeoutId;
    return callbackId;
  };
  exports.cancelScheduledWork = function (callbackId) {
    var timeoutId = timeoutIds[callbackId];
    delete timeoutIds[callbackId];
    clearTimeout(timeoutId);
  };
} else {
  // We keep callbacks in a queue.
  // Calling scheduleWork will push in a new callback at the end of the queue.
  // When we get idle time, callbacks are removed from the front of the queue
  var pendingCallbacks = [];

  var _callbackIdCounter = 0;
  var getCallbackId = function () {
    _callbackIdCounter++;
    return _callbackIdCounter;
  };

  // When a callback is scheduled, we register it by adding it's id to this
  // object.
  // If the user calls 'cancelScheduledWork' with the id of that callback, it will be
  // unregistered by removing the id from this object.
  // Then we skip calling any callback which is not registered.
  // This means cancelling is an O(1) time complexity instead of O(n).
  var registeredCallbackIds = {};

  // We track what the next soonest timeoutTime is, to be able to quickly tell
  // if none of the scheduled callbacks have timed out.
  var nextSoonestTimeoutTime = -1;

  var isIdleScheduled = false;
  var isAnimationFrameScheduled = false;

  var frameDeadline = 0;
  // We start out assuming that we run at 30fps but then the heuristic tracking
  // will adjust this value to a faster fps if we get more frequent animation
  // frames.
  var previousFrameTime = 33;
  var activeFrameTime = 33;

  var frameDeadlineObject = {
    didTimeout: false,
    timeRemaining: function () {
      var remaining = frameDeadline - exports.now();
      return remaining > 0 ? remaining : 0;
    }
  };

  var safelyCallScheduledCallback = function (callback, callbackId) {
    if (!registeredCallbackIds[callbackId]) {
      // ignore cancelled callbacks
      return;
    }
    try {
      callback(frameDeadlineObject);
      // Avoid using 'catch' to keep errors easy to debug
    } finally {
      // always clean up the callbackId, even if the callback throws
      delete registeredCallbackIds[callbackId];
    }
  };

  /**
   * Checks for timed out callbacks, runs them, and then checks again to see if
   * any more have timed out.
   * Keeps doing this until there are none which have currently timed out.
   */
  var callTimedOutCallbacks = function () {
    if (pendingCallbacks.length === 0) {
      return;
    }

    var currentTime = exports.now();
    // TODO: this would be more efficient if deferred callbacks are stored in
    // min heap.
    // Or in a linked list with links for both timeoutTime order and insertion
    // order.
    // For now an easy compromise is the current approach:
    // Keep a pointer to the soonest timeoutTime, and check that first.
    // If it has not expired, we can skip traversing the whole list.
    // If it has expired, then we step through all the callbacks.
    if (nextSoonestTimeoutTime === -1 || nextSoonestTimeoutTime > currentTime) {
      // We know that none of them have timed out yet.
      return;
    }
    nextSoonestTimeoutTime = -1; // we will reset it below

    // keep checking until we don't find any more timed out callbacks
    frameDeadlineObject.didTimeout = true;
    for (var i = 0, len = pendingCallbacks.length; i < len; i++) {
      var currentCallbackConfig = pendingCallbacks[i];
      var _timeoutTime = currentCallbackConfig.timeoutTime;
      if (_timeoutTime !== -1 && _timeoutTime <= currentTime) {
        // it has timed out!
        // call it
        var _callback = currentCallbackConfig.scheduledCallback;
        safelyCallScheduledCallback(_callback, currentCallbackConfig.callbackId);
      } else {
        if (_timeoutTime !== -1 && (nextSoonestTimeoutTime === -1 || _timeoutTime < nextSoonestTimeoutTime)) {
          nextSoonestTimeoutTime = _timeoutTime;
        }
      }
    }
  };

  // We use the postMessage trick to defer idle work until after the repaint.
  var messageKey = '__reactIdleCallback$' + Math.random().toString(36).slice(2);
  var idleTick = function (event) {
    if (event.source !== window || event.data !== messageKey) {
      return;
    }
    isIdleScheduled = false;

    if (pendingCallbacks.length === 0) {
      return;
    }

    // First call anything which has timed out, until we have caught up.
    callTimedOutCallbacks();

    var currentTime = exports.now();
    // Next, as long as we have idle time, try calling more callbacks.
    while (frameDeadline - currentTime > 0 && pendingCallbacks.length > 0) {
      var latestCallbackConfig = pendingCallbacks.shift();
      frameDeadlineObject.didTimeout = false;
      var latestCallback = latestCallbackConfig.scheduledCallback;
      var newCallbackId = latestCallbackConfig.callbackId;
      safelyCallScheduledCallback(latestCallback, newCallbackId);
      currentTime = exports.now();
    }
    if (pendingCallbacks.length > 0) {
      if (!isAnimationFrameScheduled) {
        // Schedule another animation callback so we retry later.
        isAnimationFrameScheduled = true;
        requestAnimationFrame(animationTick);
      }
    }
  };
  // Assumes that we have addEventListener in this environment. Might need
  // something better for old IE.
  window.addEventListener('message', idleTick, false);

  var animationTick = function (rafTime) {
    isAnimationFrameScheduled = false;
    var nextFrameTime = rafTime - frameDeadline + activeFrameTime;
    if (nextFrameTime < activeFrameTime && previousFrameTime < activeFrameTime) {
      if (nextFrameTime < 8) {
        // Defensive coding. We don't support higher frame rates than 120hz.
        // If we get lower than that, it is probably a bug.
        nextFrameTime = 8;
      }
      // If one frame goes long, then the next one can be short to catch up.
      // If two frames are short in a row, then that's an indication that we
      // actually have a higher frame rate than what we're currently optimizing.
      // We adjust our heuristic dynamically accordingly. For example, if we're
      // running on 120hz display or 90hz VR display.
      // Take the max of the two in case one of them was an anomaly due to
      // missed frame deadlines.
      activeFrameTime = nextFrameTime < previousFrameTime ? previousFrameTime : nextFrameTime;
    } else {
      previousFrameTime = nextFrameTime;
    }
    frameDeadline = rafTime + activeFrameTime;
    if (!isIdleScheduled) {
      isIdleScheduled = true;
      window.postMessage(messageKey, '*');
    }
  };

  exports.scheduleWork = function (callback, options) {
    var timeoutTime = -1;
    if (options != null && typeof options.timeout === 'number') {
      timeoutTime = exports.now() + options.timeout;
    }
    if (nextSoonestTimeoutTime === -1 || timeoutTime !== -1 && timeoutTime < nextSoonestTimeoutTime) {
      nextSoonestTimeoutTime = timeoutTime;
    }

    var newCallbackId = getCallbackId();
    var scheduledCallbackConfig = {
      scheduledCallback: callback,
      callbackId: newCallbackId,
      timeoutTime: timeoutTime
    };
    pendingCallbacks.push(scheduledCallbackConfig);

    registeredCallbackIds[newCallbackId] = true;
    if (!isAnimationFrameScheduled) {
      // If rAF didn't already schedule one, we need to schedule a frame.
      // TODO: If this rAF doesn't materialize because the browser throttles, we
      // might want to still have setTimeout trigger scheduleWork as a backup to ensure
      // that we keep performing work.
      isAnimationFrameScheduled = true;
      requestAnimationFrame(animationTick);
    }
    return newCallbackId;
  };

  exports.cancelScheduledWork = function (callbackId) {
    delete registeredCallbackIds[callbackId];
  };
}

Object.defineProperty(exports, '__esModule', { value: true });

})));
