/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function whichTransitionEvent(){
  const el = document.createElement('fakeelement'),
        transitions = {
          transition: 'transitionend',
          OTransition: 'oTransitionEnd',
          MozTransition: 'transitionend',
          WebkitTransition: 'webkitTransitionEnd'
        };
  let t;

  for(t in transitions){
    if( el.style[t] !== undefined ){
      return transitions[t];
    }
  }
}
const saKnife = {
  transitionEvent: whichTransitionEvent(),
  offset: (el) => {
    const rect = el.getBoundingClientRect(),
          body = document.body.getBoundingClientRect();

    return {
      top: Math.abs(body.top) + rect.top,
      left: Math.abs(body.left) + rect.left
    }
  },
  winSize: () => {
    const e = document.documentElement,
      g = document.querySelector('body'),
      width = e.clientWidth||g.clientWidth,
      height = e.clientHeight||g.clientHeight;
    return {
      width,
      height,
      vCenter: height / 2,
      hCenter: width / 2,
      documentHeight: g.offsetHeight,
      documentWidth: g.offsetWidth
    }
  },
  hasClass: (el, className) => {
    let response = false;
    
    if (el.classList)
      response = el.classList.contains(className);
    else
      response = new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    
    return response;
  },
  round: (value, decimals) => Number(Math.round(value+'e'+decimals)+'e-'+decimals)
}
/* harmony default export */ __webpack_exports__["a"] = (saKnife);

/***/ }),
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__saKnife_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_lodash_debounce_index_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_lodash_debounce_index_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__node_modules_lodash_debounce_index_js__);



class scrollTrigger {
  constructor(override) {
    "use strict";
    const options = createOptions(override),
          st = this;
    let scrollTimeout = null,
        resizeTimeout = null;

    st.elements = [];
    st.window = __WEBPACK_IMPORTED_MODULE_0__saKnife_js__["a" /* default */].winSize();
    st.onScrollTrigger = onScrollTrigger;
    st.onScrollResize = onScrollResize;
    
    generateElementsObj();
    
    window.addEventListener('scroll', onScrollProbe);
    window.addEventListener('scroll', __WEBPACK_IMPORTED_MODULE_1__node_modules_lodash_debounce_index_js___default()(onScrollTrigger, 100));
    window.addEventListener('resize', __WEBPACK_IMPORTED_MODULE_1__node_modules_lodash_debounce_index_js___default()(onScrollResize, 100));
    
    // Private
    function createOptions(override) {
      let options = Object.assign({
        scope: {},
        dataName: 'data-scroll-trigger',
        probe: null
      }, override);
    
      options.selector = '[' + options.dataName + ']';
      
      return options;
    }
    function generateElementsObj() {
      const elements = document.querySelectorAll(options.selector);

      elements.forEach((element, index) => {
        function checkOverride(override) {
          if (Array.isArray(options.scope[override])) {
            return options.scope[override];
          } 
          else {
            try {
              eval('override = ' + override);
            }
            catch (e) {
              alert('Eval error!!!');
              return false;
            }
            if (Array.isArray(override))
              return override;
            else
              return false;
          }
        }
        const prop = element.attributes.getNamedItem(options.dataName),
              defaultTrigger = {
                position: 'center', // center | top | bottom
                offset: 0,
                top: null,
                center: null,
                bottom: null,
                active: null,
                inactive: null
              };
        let opt = [defaultTrigger],
            override = checkOverride(prop.value),
            inserted = {};
        
        opt = override !== false ? override : opt;
        
        inserted = {
          el: element,
          offset: __WEBPACK_IMPORTED_MODULE_0__saKnife_js__["a" /* default */].offset(element),
          size: {
            height: element.offsetHeight,
            width: element.offsetWidth
          },
          actions: [],
          active: false,
          pastCenter: false,
          pastTop: false,
          pastBottom: false,
          index
        }
        
        opt.forEach(trigger => {
          let newTrigger = Object.assign({}, defaultTrigger, trigger);
          
          newTrigger.offset = st.getScrollOffset(newTrigger.position);
          
          inserted.actions.push(newTrigger);
        });
        
        st.elements.push(inserted);
      });
    }
    // Public
    function onScrollTrigger() {  
      st.elements.forEach(element => {
        element.actions.forEach(action => {
          const scrolled = window.scrollY + action.offset,
                centerTrigger = element.offset.top + (element.size.height / 2),
                bottomTrigger = element.offset.top + element.size.height,
                checks = {
                  beforeTop: scrolled < element.offset.top,
                  afterTop: element.offset.top <= scrolled,
                  afterCenter: centerTrigger <= scrolled,
                  beforeBottom: scrolled <= bottomTrigger,
                  afterBottom: bottomTrigger < scrolled
                };
          let topFunction = false,
              centerFunction = false,
              bottomFunction = false,
              activeFunction = false,
              inactiveFunction = false;
 
          function checkFunction(possibleFunc) {
            if (possibleFunc == null) {
              return false;
            } else  {
              if (typeof(possibleFunc) === 'function') {  
                return possibleFunc;
              }
              else if (typeof(options.scope[possibleFunc]) === 'function') {
                return options.scope[possibleFunc];
              }
              return false;            
            }
          }

          // top, and bottom triggers
          if (checks.afterTop) {
            // top 
            if (element.pastTop === false) {
              topFunction = checkFunction(action.top);
              if (topFunction !== false) topFunction(element, options.scope);
              element.pastTop = true;
              
            }
            // center 
            if (checks.afterCenter && element.pastCenter === false) {
              centerFunction = checkFunction(action.center);
              if (centerFunction !== false) centerFunction(element, options.scope);

              element.pastCenter = true;
            } 
            // bottom
            if (checks.afterBottom && element.pastBottom === false) {
              bottomFunction = checkFunction(action.bottom);

              if (bottomFunction !== false) bottomFunction(element, options.scope);

              element.pastBottom = true;  
            }
          } 

          // active | inactive
          if (checks.afterTop && checks.beforeBottom) {
            if (element.active === false) {
              activeFunction = checkFunction(action.active);

              if (activeFunction !== false) activeFunction(element, options.scope);
              element.active = true;
            }
          }
          else if (element.active === true) {
            inactiveFunction = checkFunction(action.inactive);
            
            if (inactiveFunction !== false) inactiveFunction(element, options.scope);
            element.active = false;
          }
        });
        
      });
    }
    function onScrollProbe() {
      let percentScrolled = 0;
      if (options.probe != null) {
        percentScrolled = __WEBPACK_IMPORTED_MODULE_0__saKnife_js__["a" /* default */].round((window.scrollY) / (st.window.documentHeight - st.window.height), 4);
        options.probe(percentScrolled);
      }
    }
    function onScrollResize() {
      st.window = __WEBPACK_IMPORTED_MODULE_0__saKnife_js__["a" /* default */].winSize();
      st.elements.forEach(element => {
        element.size.height = element.el.offsetHeight;
        element.size.width = element.el.offsetWidth;
        element.offset = __WEBPACK_IMPORTED_MODULE_0__saKnife_js__["a" /* default */].offset(element.el);
        
        element.actions.forEach(action => {
          action.offset = st.getScrollOffset(action.position);
        });
      });
      onScrollTrigger();
    }
  }
  getScrollOffset(position) {
    switch(position) {
      case 'top':
        return 0;
        break;
      case 'bottom':
        return this.window.height;
        break;
      case 'center':
      default:
        return this.window.vCenter;
        break;
    }
  }
}
/* harmony default export */ __webpack_exports__["a"] = (scrollTrigger);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__saKnife_js__ = __webpack_require__(0);

class svgLine {
  constructor(options) {
    const _this = this,
        style = getComputedStyle(options.path);
    let timeout;

    _this.svgEvent = {
      active: 0
    }
    _this.triggerEvent = new CustomEvent('svgTrigger', {
      detail: _this.svgEvent
    });

    _this.el = Object.assign({
      length: parseFloat(style["stroke-dasharray"]),
      height: options.path.viewportElement.viewBox.baseVal.height,
      ratios: [],
      triggers: {},
      triggerPad: 0
    }, options);
    _this.el.triggers.lengths = [];

    if (_this.el.triggers.points != null) {
      _this.el.ratios = _this.getRatios(_this.el.triggers.points);
    }
  }

  pathLength(percent){
    const _this = this,
          l = _this.el.length.val,
          offset = l * percent,
          newLength = l - offset;
    this.el.path.style.strokeDashoffset = newLength;

    this.el.triggers.lengths.forEach((length, index) => {
      if (offset >= (length.val - _this.el.triggerPad)) {
        if (length.active !== true) {
          _this.svgEvent.active = index + 1;
          length.active = true;
          delete _this.svgEvent.inactive;
        }
      } else {
        if (length.active !== false) {
          _this.svgEvent.inactive = index + 1;
          length.active = false;
          delete _this.svgEvent.active;
        }
      }
      _this.el.path.dispatchEvent(_this.triggerEvent);
    });
    return newLength;
  }
  getRatios(triggerPoints) {
    const _this = this,
          points = _this.el.path.points;
    let ratios = [],
        ys = [];
    triggerPoints.forEach((triggerPoint, index) => {
      let y = _this.el.path.points[triggerPoint].y,
          newRatio = 0;
      ys.push(y);

      if (index === 0) {
        newRatio = y / _this.el.height;
      } else {
        newRatio = (y - ys[index - 1]) / _this.el.height;
      }
      ratios.push(newRatio);
    });
    return ratios;
  }
  setRatios(ratios) {
    const _this = this,
          cHeight = _this.el.container.offsetHeight,
          triggerPoints = _this.el.triggers.points,
          triggerlengths = [],
          oldRatios = _this.el.ratios;
    let points = this.el.path.points,
        diffs = [],
        activeTrigger = 0,
        pointIndex = 0,
        triggerLengths = [];

    if (triggerPoints != null) {
      ratios.forEach((ratio, i) => {
        let y = points[triggerPoints[i]].y,
            ratioDiff = ratio / oldRatios[i],
            newY = 0;
        if (i > 0) {
          y = y - points[triggerPoints[i - 1]].y;
        }
        newY = __WEBPACK_IMPORTED_MODULE_0__saKnife_js__["a" /* default */].round((y * ratioDiff) - y, 4);

        if (diffs.length > 0) {
          newY = __WEBPACK_IMPORTED_MODULE_0__saKnife_js__["a" /* default */].round(newY + diffs[diffs.length - 1], 4);
        }
        diffs.push(newY);
      });

      _this.el.ratios = ratios;
      triggerPoints.forEach((triggerIndex, index) => {
        const trigger = points[triggerIndex];
        let lastTrigger = null,
            point = null,
            children = [],
            lengths = [],
            length = 0,
            triggerLength = 0;
        if (index > 0) {
          lastTrigger = triggerPoints[index - 1];
        }

        for (pointIndex = 1; pointIndex < points.length; pointIndex++) {
          point = points[pointIndex];
          length = calculateLength(points[pointIndex - 1], point);

          if (point.y <= trigger.y) {
            if (lastTrigger != null) {
              if (point.y > points[lastTrigger].y) {
                  point.y = changeY(point);
              }
            }
            else {
              point.y = changeY(point);
            }
          }
          
          if (pointIndex <= triggerIndex) {
            length = calculateLength(points[pointIndex - 1], point);
            lengths.push(length);
          }
        }
        lengths.forEach((length) => {
          triggerLength = __WEBPACK_IMPORTED_MODULE_0__saKnife_js__["a" /* default */].round(triggerLength + length, 4);
        });

        triggerLengths.push({
          val: triggerLength,
          active: -1,
          inactive: -1
        });

        function changeY(point) {
          let newY = 0;
          if (index < (points.length - 1)) {
            newY = point.y + diffs[index];
          } else {
            newY = point.y;
          }
          return newY;
        }
        
      });
      _this.el.triggers.lengths = triggerLengths;
      _this.el.length = triggerLengths[triggerLengths.length - 1];
    }

    function calculateLength(pointSet1, pointSet2) {
      const lX = pointSet2.x - pointSet1.x, 
            lY = pointSet2.y - pointSet1.y;
      return __WEBPACK_IMPORTED_MODULE_0__saKnife_js__["a" /* default */].round(Math.sqrt((lX * lX) + (lY * lY)), 2);
    }
  }
};
/* harmony default export */ __webpack_exports__["a"] = (svgLine);

/***/ }),
/* 4 */
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
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scripts_scrollTrigger_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scripts_svgLine_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scripts_saKnife_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_modules_lodash_debounce_index_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_modules_lodash_debounce_index_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__node_modules_lodash_debounce_index_js__);





window.addEventListener('load', onLoad);  

function onLoad() {
  "use strict";
  const sectionOptions = [{
          position: 'center',
          active: sectionAct,
          inactive: sectionInact
        }],
        container = document.querySelector('.bg-line'),
        line = new __WEBPACK_IMPORTED_MODULE_1__scripts_svgLine_js__["a" /* default */]({
          path: document.querySelector('.bg-line__path'),
          triggers: {
            points: [2, 4, 8, 10, 11]
          },
          container
        }),
        triggers = new __WEBPACK_IMPORTED_MODULE_0__scripts_scrollTrigger_js__["a" /* default */]({
          scope: { 
            sectionOptions,
            sectionTimeout: null
          },
          probe: bindScrollToLine
        }),
        markers = document.querySelectorAll('.bg-line__point');
  let listenSecScroll = false,
      sectionsSizes = getSectionRatios(),
      activeSctionObj;
  
  line.setRatios(sectionsSizes.ratios);
  line.el.path.addEventListener('svgTrigger', (event) => {
    let point = null;
    if (event.detail.active != null) {
      point = container.querySelector('.bg-line__point--' + event.detail.active);
      point.classList.add('bg-line__point--active');
    } 
    else if (event.detail.inactive != null) {
      point = container.querySelector('.bg-line__point--' + event.detail.inactive);
      point.classList.remove('bg-line__point--active');
    }
  });

  window.addEventListener('resize', __WEBPACK_IMPORTED_MODULE_3__node_modules_lodash_debounce_index_js___default()(onResize, 500));
  triggers.onScrollTrigger();
  
  function onResize() {
    sectionsSizes = getSectionRatios();
    line.setRatios(sectionsSizes.ratios);
  }
  
  function getSectionRatios() {
    const cHeight = container.offsetHeight;
    let ratios = [], // ratio calculation array
        topArr = [], // top calculation array
        offsetTopArr = [];
    triggers.elements.forEach((element, index) => {
      const marker = markers[index + 1],
            ratio = element.size.height / cHeight;
      let top = 0,
          lastTop = 0;

      if (index > 0) {
        lastTop = topArr[topArr.length - 1];
      }

      top = (ratio * 100) + lastTop; // top calculation
      marker.style.top = top + '%';

      topArr.push(top);
      ratios.push(__WEBPACK_IMPORTED_MODULE_2__scripts_saKnife_js__["a" /* default */].round(ratio, 6));
    });

    return { ratios, topArr };
  }
  function bindScrollToLine(percent) {      
    const newLength = line.pathLength(percent);
  }

  function sectionAct(obj) {
    requestAnimationFrame(() => {
      const sec = getChildren(obj.el);
      
      sec.title.classList.add('focused');

      sec.content.classList.add('focused');
      sec.content.classList.remove('unfocused');

      sec.subContent.classList.add('focused');
      sec.subContent.classList.remove('unfocused');
    });
  }
  function sectionInact(obj) {
    requestAnimationFrame(() => {
      const sec = getChildren(obj.el);
      sec.title.classList.remove('focused');

      sec.content.classList.add('unfocused');
      sec.content.classList.remove('focused');

      sec.subContent.classList.add('unfocused');
      sec.subContent.classList.remove('focused');
    });
  }
  function getChildren(el) {
    return {
      title: el.querySelector('.section__title'),
      content: el.querySelector('.section-content'),
      subContent: el.querySelector('.section-content__content')
    }
  }
}


/***/ })
/******/ ]);