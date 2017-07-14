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
/* 3 */,
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
 * @property {string} eventName - Custom event name 
 * @property {number} offset - Trigger line numerical offset.
 * @property {string} position - 'center' (default), 'top', 'bottom' | Position of trigger line.
 * @property {bool} probe - false (default).
 * @property {string} selector - 'Element' selector. Must be data-*.
 * @example
 * An example invocation showing default parameters, except the functions obviously.
 * const ST = new scrollTrigger({
    eventName: 'scrollTrigger',
    offset: 0,
    position: 'center',
    probe: false,
    selector: '[data-scroll-trigger]'
 });
 * 
 */
class scrollTrigger {
    constructor(override) {
        // Merge overrides and defaults into options object
        this.options =  Object.assign({
            selector: '[data-scroll-trigger]',
            eventName: 'scrollTrigger',
            eventNameProbe: 'scrollProbe',
            offset: 0,
            position: 'center',
            probe: false
        }, override);
        // Get window and document size
        this.window = __WEBPACK_IMPORTED_MODULE_1__saKnife_js__["a" /* default */].winSize();
        this.options.triggerLine = this._getTriggerLine(this.options.position);

        // Find elements and add them to array
        this.elements = scrollTrigger.generateElementsObj(this.options.selector);
        this.onScrollResize();
        if (this.elements.length > 0) {
            window.addEventListener('scroll', __WEBPACK_IMPORTED_MODULE_0__node_modules_lodash_debounce_index_js___default()(() => {
                this.onScrollTrigger();
            }, 100));
        }
        if (this.options.probe !== false) {
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
        
        window.dispatchEvent(new CustomEvent(this.options.eventNameProbe, {
            detail: percentScrolled
        }));
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
            element.active = true;
            return element;
        }
        // set inactive
        else if (element.active === true && active === false) {         
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
/** 
 * Exports svgLine class.
 * @module src/svgLine 
 */
/** 
 * A plugin-less way to manipulate the svg path in the home background.
 * @class svgLine 
 */
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
        this.active = 0;
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
            };         
        this.offset = offset;
        changePath();

        return newLength;
    }
    reCheck() {
        const checkActive = (index) => {
            const checkForward = (index) => {
                    let nextTrigger = infoArray[index];
                    if (index === infoArray.length) {
                        return index;
                    }
                    if (this.offset === this.el.length) {
                        return infoArray.length;
                    }
                    if (this.offset >= (nextTrigger.val - this.el.triggerPad)) {
                        if (index < infoArray.length - 1) {
                            return checkForward(index + 1);
                        } else {
                            return index;
                        }
                    } else {
                        return index;
                    }
                },
                checkPrev = (index) => {
                    let prevTrigger,
                        prevIndex = index - 1;
                    if (index > 0) {
                        prevTrigger = infoArray[prevIndex];
                        if (this.offset < (prevTrigger.val - this.el.triggerPad)) {
                            if (prevIndex > 0)
                                return checkPrev(index - 1);
                            else 
                                return prevIndex;
                        } else {
                            return index;
                        }
                    } else {
                        return index;
                    }
                },
                infoArray =  this.el.triggers.info;
            let next = checkForward(index);
            if (next !== index) {
                return next;
            } else {
                return checkPrev(index);
            }
        };
        this.active = checkActive(this.active);
        return this.active;
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

            triggerInfo[index] = info;
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__node_modules_lodash_pull_index_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__node_modules_lodash_pull_index_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__node_modules_lodash_pull_index_js__);
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
        ST = new __WEBPACK_IMPORTED_MODULE_0__src_scrollTrigger_js__["a" /* default */]({ probe: true }),
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
        active = 0,
        activeMarkers = [],
        inactiveMarkers = [ 0, 1, 2, 3, 4, 5 ];

    LINE.setRatios(sectionRatios.topArr);

    window.addEventListener('resize', __WEBPACK_IMPORTED_MODULE_3__node_modules_lodash_debounce_index_js___default()(onResize, 250));

    window.addEventListener('scrollProbe', changeLine);
    window.addEventListener('scrollProbe', __WEBPACK_IMPORTED_MODULE_3__node_modules_lodash_debounce_index_js___default()(reCheckLine, 50));

    ST.onScrollProbe();
    if (active === 0)
        sectionActive(active);

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
    function changeLine(event) {
        LINE.pathLength(event.detail);
    }
    function reCheckLine() {
        let newActive = LINE.reCheck();
        
        if (active !== newActive) {
            toggleActive(active, newActive);

            addMarkers(newActive);
            removeMarkers(newActive);

            active = newActive;
        }
        function addMarkers(active) {
            let toChange = inactiveMarkers.filter( m => m <= active);
            __WEBPACK_IMPORTED_MODULE_4__node_modules_lodash_pull_index_js___default()(inactiveMarkers, ...toChange);
            activeMarkers = activeMarkers.concat(toChange);
            toChange.forEach( i => {
                if (i > 0)
                    MARKERS[i - 1].classList.add('bg-line__point--active');
            });
        }
        function removeMarkers(active) {
            let toChange = activeMarkers.filter( m => m > active);
            __WEBPACK_IMPORTED_MODULE_4__node_modules_lodash_pull_index_js___default()(activeMarkers, ...toChange);
            inactiveMarkers = inactiveMarkers.concat(toChange);
            toChange.forEach( i => {
                if (i > 0)
                    MARKERS[i - 1].classList.remove('bg-line__point--active');
            });
        }
    }
    function toggleActive(inactive, active) {
        requestAnimationFrame(() => {
            if (inactive < SECTIONS.length)
                sectionInactive(inactive);
            if (active < SECTIONS.length)
                sectionActive(active);
        });
    }
    function sectionActive(index) {
        SECTIONS[index].classList.add('focused');
        BODY.classList.add(`section-${index}`);
    }
    function sectionInactive(index) {
        SECTIONS[index].classList.remove('focused');
        BODY.classList.remove(`section-${index}`);       
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


/***/ }),
/* 11 */,
/* 12 */,
/* 13 */
/***/ (function(module, exports) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex(array, baseIsNaN, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * This function is like `baseIndexOf` except that it accepts a comparator.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOfWith(array, value, fromIndex, comparator) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (comparator(array[index], value)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * The base implementation of `_.pullAllBy` without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to remove.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns `array`.
 */
function basePullAll(array, values, iteratee, comparator) {
  var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
      index = -1,
      length = values.length,
      seen = array;

  if (array === values) {
    values = copyArray(values);
  }
  if (iteratee) {
    seen = arrayMap(array, baseUnary(iteratee));
  }
  while (++index < length) {
    var fromIndex = 0,
        value = values[index],
        computed = iteratee ? iteratee(value) : value;

    while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
      if (seen !== array) {
        splice.call(seen, fromIndex, 1);
      }
      splice.call(array, fromIndex, 1);
    }
  }
  return array;
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Removes all given values from `array` using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * **Note:** Unlike `_.without`, this method mutates `array`. Use `_.remove`
 * to remove elements from an array by predicate.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {...*} [values] The values to remove.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
 *
 * _.pull(array, 'a', 'c');
 * console.log(array);
 * // => ['b', 'b']
 */
var pull = baseRest(pullAll);

/**
 * This method is like `_.pull` except that it accepts an array of values to remove.
 *
 * **Note:** Unlike `_.difference`, this method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {Array} values The values to remove.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
 *
 * _.pullAll(array, ['a', 'c']);
 * console.log(array);
 * // => ['b', 'b']
 */
function pullAll(array, values) {
  return (array && array.length && values && values.length)
    ? basePullAll(array, values)
    : array;
}

module.exports = pull;


/***/ })
],[9]);
//# sourceMappingURL=home.js.map