webpackJsonp([0],[
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = debounce;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 3 */
/***/ (function(module, exports) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308,
    NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Creates a function that invokes `func`, with the `this` binding and arguments
 * of the created function, while it's called less than `n` times. Subsequent
 * calls to the created function return the result of the last `func` invocation.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {number} n The number of calls at which `func` is no longer invoked.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * jQuery(element).on('click', _.before(5, addContactToList));
 * // => Allows adding up to 4 contacts to the list.
 */
function before(n, func) {
  var result;
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  n = toInteger(n);
  return function() {
    if (--n > 0) {
      result = func.apply(this, arguments);
    }
    if (n <= 1) {
      func = undefined;
    }
    return result;
  };
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = before;


/***/ }),
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_lodash_debounce_index_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_lodash_debounce_index_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_lodash_debounce_index_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__saKnife_js__ = __webpack_require__(0);
/** 
 * Exports scrollTrigger class.
 * @module src/scrollTrigger
 * @requires module:src/saKnife saKnife
 */


/** 
 * Yet another scroll trigger js tool.
 * When an element gets to a certain point in the viewport (crosses a trigger line) run a function.
 * @class scrollTrigger
 * @param {object} options
 * @property {function|string} activeFn - null (default) | Function to run when 'element' becomes active.
 * @property {string} eventName - Custom event name 
 * @property {function|string} inactiveFn - null (default) | Function to run when 'element' becomes inactive.
 * @property {string} position - 'center' (default), 'top', 'bottom' | Position of trigger line.
 * @property {number} offset - Trigger line numerical offset.
 * @property {function|string} probeFn - null (default) | Function to run on scroll.
 * @property {object} scope - Object containing functions.
 * @property {string} selector - 'Element' selector. Must be data-*.
 * @example
 * An example invocation showing default parameters, except the functions obviously.
 * const ST = new scrollTrigger({
    activeFn: (stElement) => { 
        // Do something cool...
    },
    eventName: 'scrollTrigger',
    inactiveFn: (stElement) => {
        // Maybe do another thing that's also cool...
    },
    offset: 0,
    position: 'center',
    probeFn: (docScrolledPercent) => {
        // You could do another thing. But beware this function will run on EACH scroll event.
    },
    scope: {} // If 
 });
 * 
 */
class scrollTrigger {
    constructor(override) {
        // Merge overrides and defaults into options object
        this.options =  Object.assign({
            activeFn: null,
            selector: '[data-scroll-trigger]',
            eventName: 'scrollTrigger',
            inactiveFn: null,
            position: 'center',
            probeFn: null,
            offset: 0,
            scope: {}
        }, override);
        // Get window and document size
        this.window = __WEBPACK_IMPORTED_MODULE_1__saKnife_js__["a" /* default */].winSize();
        this.options.triggerLine = this._getTriggerLine(this.options.position);

        // Check if user provided functions are functions
        [
            this.options.activeFn, 
            this.options.inactiveFn, 
            this.options.probeFn
        ].forEach( fn => fn = this._checkFunction(fn));
        // Find elements and add them to array
        this.elements = scrollTrigger.generateElementsObj(this.options.selector);
        this.onScrollResize();
        if (this.elements.length > 0) {
            window.addEventListener('scroll', __WEBPACK_IMPORTED_MODULE_0__node_modules_lodash_debounce_index_js___default()(() => {
                this.onScrollTrigger();
            }, 100));
        }
        if (this.options.probeFn !== false) {
            window.addEventListener('scroll', () => {
                this.onScrollProbe();
            });
        }
        window.addEventListener('resize', __WEBPACK_IMPORTED_MODULE_0__node_modules_lodash_debounce_index_js___default()(() => {
            this.onScrollResize();
        }, 200));
    }
    /**
     * Scroll Trigger Elements wrapper
     * @typedef {object} stElement
     * @property {NodeElement} el - Element
     * @property {number} offset - Element offsetObject.
     * @property {bool} active - True/False if is element is active.
     * @property {number} index - Index. Nuff' said.
     */
    /**
     * Generate elements array. Each element is wrapped in a an stElement object.
     * The idea is to precalculate offset position, so that scrolling performance is not impacted
     * by multiple calls to getBoundingClientRect().
     * @param {string} selector - Elements selector.
     * @returns {array} elementArray - An array of stElements
     */
    static generateElementsObj(selector) {
        const elements = document.querySelectorAll(selector);
        let elArray = [];
        elements.forEach((element, index) => {
            let newElement = {
                el: element,
                offset: __WEBPACK_IMPORTED_MODULE_1__saKnife_js__["a" /* default */].offset(element),
                active: false,
                index
            };
            elArray.push(newElement);
        });
        return elArray;
    }
    _checkFunction(possibleFunc) {
        if (possibleFunc == null) {
            return false;
        } else  {
            if (typeof(possibleFunc) === 'function') {  
                return possibleFunc;
            }
            if (typeof(this.options.scope[possibleFunc]) === 'function') {
                return this.options.scope[possibleFunc];
            }
            return false;            
        }
    }
    _getTriggerLine(position) {
        switch(position) {
        case 'top':
            return 0;
        case 'bottom':
            return this.window.height;
        case 'center':
        default:
            return this.window.vCenter;
        }
    }
    onScrollTrigger() {
        let changed = [];
        this.elements.forEach(element => {
            const scrolled = window.scrollY + this.options.triggerLine,
                bottomTrigger = element.offset.top + element.el.offsetHeight,
                checks = {
                    afterTop: element.offset.top <= scrolled,
                    beforeBottom: scrolled <= bottomTrigger
                };
            let elChanged = null;
            // active | inactive
            if (checks.afterTop && checks.beforeBottom) {
                elChanged = this._toggleActiveInactive(element, true);
            }
            else if (element.active === true) {
                elChanged = this._toggleActiveInactive(element, false);
            }
            elChanged != null ? changed.push(elChanged) : null;  
        });
        if (this.options.event && changed.length > 0) {
            window.dispatchEvent(new CustomEvent(this.options.eventName, {
                detail: changed
            }));
        }
    }
    onScrollProbe() {
        let percentScrolled = __WEBPACK_IMPORTED_MODULE_1__saKnife_js__["a" /* default */].round((window.scrollY) / 
            (this.window.documentHeight - this.window.height), 4);
        this.options.probeFn(percentScrolled);
    }
    onScrollResize() {
        this.window = __WEBPACK_IMPORTED_MODULE_1__saKnife_js__["a" /* default */].winSize();
        this.options.triggerLine = this._getTriggerLine(this.options.position);
        this.elements.forEach(element => {
            element.offset = __WEBPACK_IMPORTED_MODULE_1__saKnife_js__["a" /* default */].offset(element.el);
        });
    }
    /**
     * @private
     */
    _toggleActiveInactive(element, active) {
        // set active
        if (element.active === false && active === true) {
            if (this.options.event !== true && this.options.activeFn !== false)
                this.options.activeFn(element);
               
            element.active = true;
            return element;
        }
        // set inactive
        else if (element.active === true && active === false) {
            if (this.options.event !== true && this.options.inactiveFn !== false)
                this.options.inactiveFn(element);
            
            element.active = false;
            return element;
        }
        return null;
    }
}
/* harmony default export */ __webpack_exports__["a"] = (scrollTrigger);

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/** */
class svgLine {
    constructor(options) {
        const style = getComputedStyle(options.path);
        
        this.el = Object.assign({
            length: parseFloat(style['stroke-dasharray']),
            height: options.path.viewportElement.viewBox.baseVal.height,
            ratios: [],
            triggers: {},
            triggerPad: 0
        }, options);
        
        this.el.triggers.info = [];

        if (this.el.triggers.points != null) {
            this.el.ratios = this.getRatios(this.el.triggers.points);
        }
    }
    pathLength(percent){
        const l = this.el.length,
            offset = l * percent,
            newLength = l - offset,
            changePath = () => {
                requestAnimationFrame(() => {
                    this.el.path.style.strokeDashoffset = newLength;
                });
                reCheck();
            },
            reCheck = () => {
                var changed = [];
                this.el.triggers.info.forEach((length, index) => {
                    if (offset >= (length.val - this.el.triggerPad)) {
                        if (length.active !== true) {
                            length.active = true;
                            changed.push({
                                index: index,
                                active: true
                            });
                        }
                    } else {
                        if (length.active !== false) {
                            length.active = false;
                            changed.push({
                                index: index,
                                active: false
                            });
                        }
                    }
                });
                if (changed.length > 0) {
                    this.el.path.dispatchEvent(new CustomEvent('svgTrigger', {
                        detail: changed
                    }));
                }
            };

        changePath();
        return newLength;
    }
    getRatios(triggerPoints) {
        const points = this.el.path.points;
        let ratios = [],
            ys = [];
        triggerPoints.forEach((triggerPoint) => {
            let y = points.getItem(triggerPoint).y,
                newRatio = 0;
            ys.push(y);

            newRatio = (y / this.el.height) * 100;
            ratios.push(newRatio);
        });
        return ratios;
    }
    setRatios(ratios) {
        const triggerPoints = this.el.triggers.points,
            oldRatios = this.el.ratios;
        let points = this.el.path.points,
            diffs = [],
            triggerInfo = this.el.triggers.info;
            
        if (triggerPoints != null) {
            ratios.forEach((ratio, i) => {
                let triggerIndex = triggerPoints[i],
                    y = points.getItem(triggerIndex).y,
                    ratioDiff = ratio / oldRatios[i],
                    newY = 0;

                newY = y * ratioDiff;

                changeTriggerPoint(triggerIndex, i, newY);
                diffs.push(newY);
            });

            this.el.ratios = ratios;
            this.el.length = triggerInfo[triggerInfo.length - 1].val;
        }
        function changeTriggerPoint(triggerIndex, index, diff) {
            const trigger = points.getItem(triggerIndex);
            let prevTriggerIndex = index > 0 ? triggerPoints[index - 1] : 0,
                prevPoint = ((triggerIndex - 1) >= 0) ? points.getItem(triggerIndex - 1) : null,
                nextPoint = ((triggerIndex + 1) < points.numberOfItems - 1) ? points.getItem(triggerIndex + 1) : null,
                info = triggerInfo[index] != null ? triggerInfo[index] : {};

            if (info.prevOffset == null && prevPoint != null) {
                if (prevTriggerIndex !== triggerIndex - 1)
                    info.prevOffset = getOffset(prevPoint, trigger);
                else 
                    prevPoint = null;
            }
            if (info.nextOffset == null && nextPoint != null) {
                info.nextOffset = getOffset(nextPoint, trigger);
                if (info.nextOffset > Math.abs(info.prevOffset)) 
                    nextPoint = null;
            }

            if (triggerIndex < (points.numberOfItems - 1))
                trigger.y = diff;

            if (prevPoint != null)
                prevPoint.y = trigger.y + info.prevOffset;
            if (nextPoint != null)
                nextPoint.y = trigger.y + info.nextOffset;

            triggerInfo[index] = Object.assign({
                active: false,
                inactive: true
            }, info);
            triggerInfo[index].val = calculateSectionLength();

            function getOffset(point1, point2) {
                return point1.y - point2.y;
            }
            function calculateSectionLength() {
                let pointIndex = prevTriggerIndex + 1,
                    length = 0;

                for (pointIndex; pointIndex <= triggerIndex; pointIndex++) {                
                    length += svgLine.distance(points.getItem(pointIndex - 1), points.getItem(pointIndex));
                }
                if (index > 0)
                    length += triggerInfo[index - 1].val;

                return length;
            }
        }
    }
    static distance(pointSet1, pointSet2) {
        const dx = pointSet2.x - pointSet1.x, 
            dy = pointSet2.y - pointSet1.y;
        return Math.hypot(dx, dy);
    }
}
/* harmony default export */ __webpack_exports__["a"] = (svgLine);

/***/ }),
/* 8 */,
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_scrollTrigger_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_svgLine_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_saKnife_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_modules_lodash_debounce_index_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_modules_lodash_debounce_index_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__node_modules_lodash_debounce_index_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__node_modules_lodash_before_index_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__node_modules_lodash_before_index_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__node_modules_lodash_before_index_js__);
__webpack_require__(2);





/** 
    Home page scripts.
    @function 
    @requires src/saKnife
    @requires src/scrollTrigger    
    @requires node_modules/lodash.debounce
    @requires node_modules/lodash.before
*/
const homeInit = () => {
    'use strict';
    const BODY = document.querySelector('body'),
        CONTAINER = document.querySelector('.bg-line'),
        SECTIONS = document.querySelectorAll('.section'),
        ST = new __WEBPACK_IMPORTED_MODULE_0__src_scrollTrigger_js__["a" /* default */]({ probeFn: bindScrollToLine }),
        LINE = new __WEBPACK_IMPORTED_MODULE_1__src_svgLine_js__["a" /* default */]({
            svg: CONTAINER.querySelector('.bg-line__svg'),
            path: CONTAINER.querySelector('.bg-line__path'),
            pathSelector: '.bg-line__path',
            triggers: {
                points: [1, 4, 7, 10, 11]
            }
        }),
        MARKERS = CONTAINER.querySelectorAll('.bg-line__point'); // needs same # of trigger points
    let sectionRatios = getSectionRatios(),
        addPrevious = __WEBPACK_IMPORTED_MODULE_4__node_modules_lodash_before_index_js___default()(2, function (active) {
            let index = 1;
            if (active > 1) {
                for (index = 1; index < active; index ++) {
                    MARKERS[index - 1].classList.add('bg-line__point--active');
                }
            }
        }),
        activeEvent = null;

    LINE.el.path.addEventListener('svgTrigger', (event) => {
        activeEvent = event;

        event.detail.forEach((eventMark) => {
            let marker = MARKERS[eventMark.index];
            if (eventMark.active === true) {
                sectionInactive(eventMark.index);
                sectionActive(eventMark.index + 1);

                addPrevious(eventMark.index);
                marker.classList.add('bg-line__point--active');
            } 
            else {
                sectionInactive(eventMark.index + 1);
                sectionActive(eventMark.index);

                marker.classList.remove('bg-line__point--active');
            }
        });
    });

    LINE.setRatios(sectionRatios.topArr);

    ST.onScrollProbe();

    if (activeEvent === null)
        sectionActive(0);

    window.addEventListener('resize', __WEBPACK_IMPORTED_MODULE_3__node_modules_lodash_debounce_index_js___default()(onResize, 250));

    function onResize() {
        sectionRatios = getSectionRatios();

        LINE.setRatios(sectionRatios.topArr);
        ST.onScrollProbe();
    }
    function getSectionRatios() {
        let cHeight = CONTAINER.offsetHeight,
            posArr = [], // top position array
            ratios = [], // ratio calculation array
            topArr = []; // top calculation array

        SECTIONS.forEach((element, index) => {
            let marker = MARKERS[index],
                ratio = element.offsetHeight / cHeight,
                lastTop = (index === 0) ? 0 : topArr[topArr.length - 1],
                top = (ratio * 100) + lastTop; // top calculation
            
            marker.style.top = top + '%';
            posArr.push(element.getBoundingClientRect());
            topArr.push(top);
            ratios.push(__WEBPACK_IMPORTED_MODULE_2__src_saKnife_js__["a" /* default */].round(ratio, 6));
        });
        
        return { cHeight, posArr, ratios, topArr };
    }
    function bindScrollToLine(percent) {      
        LINE.pathLength(percent);
    }
    function sectionActive(index) {
        if (index >= 0 && index < SECTIONS.length) {
            SECTIONS[index].classList.add('focused');
            BODY.classList.add(`section-${index}`);    
        }
    }
    function sectionInactive(index) {
        if (index >= 0 && index < SECTIONS.length) {
            SECTIONS[index].classList.remove('focused');
            BODY.classList.remove(`section-${index}`);
        }
    }
};
window.addEventListener('load', homeInit);


/***/ }),
/* 10 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })
],[9]);
//# sourceMappingURL=home.js.map