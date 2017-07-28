/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [], result;
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/ 		if(executeModules) {
/******/ 			for(i=0; i < executeModules.length; i++) {
/******/ 				result = __webpack_require__(__webpack_require__.s = executeModules[i]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	};
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// objects to store loaded and loading chunks
/******/ 	var installedChunks = {
/******/ 		2: 0
/******/ 	};
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
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData === 0) {
/******/ 			return new Promise(function(resolve) { resolve(); });
/******/ 		}
/******/
/******/ 		// a Promise means "currently loading".
/******/ 		if(installedChunkData) {
/******/ 			return installedChunkData[2];
/******/ 		}
/******/
/******/ 		// setup Promise in chunk cache
/******/ 		var promise = new Promise(function(resolve, reject) {
/******/ 			installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 		});
/******/ 		installedChunkData[2] = promise;
/******/
/******/ 		// start chunk loading
/******/ 		var head = document.getElementsByTagName('head')[0];
/******/ 		var script = document.createElement('script');
/******/ 		script.type = 'text/javascript';
/******/ 		script.charset = 'utf-8';
/******/ 		script.async = true;
/******/ 		script.timeout = 120000;
/******/
/******/ 		if (__webpack_require__.nc) {
/******/ 			script.setAttribute("nonce", __webpack_require__.nc);
/******/ 		}
/******/ 		script.src = __webpack_require__.p + "" + chunkId + ".js";
/******/ 		var timeout = setTimeout(onScriptComplete, 120000);
/******/ 		script.onerror = script.onload = onScriptComplete;
/******/ 		function onScriptComplete() {
/******/ 			// avoid mem leaks in IE.
/******/ 			script.onerror = script.onload = null;
/******/ 			clearTimeout(timeout);
/******/ 			var chunk = installedChunks[chunkId];
/******/ 			if(chunk !== 0) {
/******/ 				if(chunk) {
/******/ 					chunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));
/******/ 				}
/******/ 				installedChunks[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		head.appendChild(script);
/******/
/******/ 		return promise;
/******/ 	};
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
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Exports saKnife class.
 * @module src/saKnife
 */
/**
 * Basic utilities for the Vanilla JS toolbox
 * @class saKnife
 */
class saKnife {
  /**
    * Check the name of CSS transitionEnd Event
    * @copyright Modernizr - via {@link https://davidwalsh.name/css-animation-callback|davidwalsh}
    * @return {string} CSS transitionEnd Event name
    */
  static whichTransitionEvent(){
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
  /**
     * Iterate through NodeList
     * @param {NodeList} elements - a NodeList of Elements.
     * @param {function} fn - function to run for each element.
     * @example
     * const elements = document.querySelectorAll('.some-class');
     * saKnife.forEach(elements, function(el, index) {
     *     doSometing(el);
     * });
     */
  static forEach(elements, fn) {
    const total = elements.length;
    let index = 0;
    for (index = 0; index < total; index++) {
      fn(elements[index], index);
    }
  }
  /**
     * Check if 'element' has specified 'class'
     * @param {HTMLElement} el - HTMLElement
     * @param {string} className - CSS class name
     * @return {boolean} true/false if 'el' has class 'className'
     * @example
     * const element = document.querySelector('.some-class');
     * saKnife.hasClass(element, 'some-class');
     * // returns true
     */
  static hasClass(el, className) {
    if (el.classList)
      return el.classList.contains(className);
    else
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  }

  /**
     * Every property is in pixels
     * @typedef {object} offsetObject
     * @property {number} top - 'top' position relative to 'body'
     * @property {number} left - 'left' position relative to 'body'
     */

  /**
      Check 'element' position relative to 'body'
     * @param {HTMLElement} el - HTMLElement
     * @return {offsetObject} - Offset information [offsetObject]{@link module:src/saKnife~offsetObject} 
     */
  static offset(el) {
    const rect = el.getBoundingClientRect(),
      body = document.body.getBoundingClientRect();

    return {
      top: Math.abs(body.top) + rect.top,
      left: Math.abs(body.left) + rect.left
    };
  }

  /**
     * Check 'window' size
     * @example
     * saKnife.winSize();
     * // returns {width: 1920, height: 1080, ...}
     * @return {winSizeObject}
        {@link module:src/saKnife~winSizeObject winSizeObject} - Windows size information
     */
  static winSize() {
    const e = document.documentElement,
      g = document.querySelector('body'),
      width = window.innerWidth||e.clientWidth||g.clientWidth,
      height = window.innerHeight||e.clientHeight||g.clientHeight;
    return {
      width,
      height,
      vCenter: height / 2,
      hCenter: width / 2,
      documentHeight: g.offsetHeight,
      documentWidth: g.offsetWidth
    };
  }
  /**
     * Round a number to specified decimals
     * @param {number} value
     * @param {number} decimals
     * @return {number}
     */
  static round(value, decimals) {
    return Number( Math.round(value + 'e' + decimals) + 'e-' + decimals );
  }
}
if (NodeList.forEach == null) {
  NodeList.prototype.forEach = function(fn) {
    saKnife.forEach(this, fn);
  };
}
if (HTMLElement.hasClass == null) {
  HTMLElement.prototype.hasClass = function(className) {
    return saKnife.hasClass(this, className);
  };
}
if (HTMLElement.getOffset == null) {
  HTMLElement.prototype.getOffset = function() {
    return saKnife.offset(this);
  };
}
/* harmony default export */ __webpack_exports__["a"] = (saKnife);


/***/ })
/******/ ]);
//# sourceMappingURL=common.js.map