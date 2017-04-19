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
/******/ ({

/***/ 2:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class scrollTrigger {
  constructor(override) {
    "use strict";
    const options = createOptions(override),
          st = this;
    
    st.elements = [];
    st.window = st.calcWinSize();
    
    (function generateElementsObj() {
      const elements = document.querySelectorAll(options.selector);

      elements.forEach(element => {
        function getScrollOffset(position) {
          switch(position) {
            case 'top':
              return 0;
              break;
            case 'bottom':
              return st.window.height;
              break;
            case 'center':
            default:
              return st.window.vCenter;
              break;
          }
        }
        
        let opt = {
          in: null,
          out: null,
          position: 'center'
        },
            override = element.attributes.getNamedItem(options.dataName).nodeValue;
        
        eval('override = ' + override);
        
        opt = Object.assign(opt, override);
        
        st.elements.push({
          el: element,
          offset: st.calcOffset(element),
          size: {
            height: element.offsetHeight,
            width: element.offsetWidth
          },
          action: {
            in: opt.in,
            out: opt.out
          },
          position: opt.position,
          scrollOffset: getScrollOffset(opt.position),
          active: false
        });
      });
    })();
    
    window.addEventListener('scroll', onScrollTrigger);
    window.addEventListener('resize', onScrollResize);
    
    function createOptions(override) {
      let options = Object.assign({
        dataName: 'data-scroll-trigger'
      }, override);
    
      options.selector = '[' + options.dataName + ']';
      
      return options;
    }
    function onScrollTrigger() {        
      st.elements.forEach(element => {
        const scrolled = window.scrollY + element.scrollOffset;
        
        function moreThanOffset() {
          return scrolled >= element.offset.top;
        }
        function lessThanOffsetPlusSize() {
          return scrolled <= (element.offset.top + element.size.height);
        }

        if (moreThanOffset() && lessThanOffsetPlusSize()) {
          if (element.active === false) {
            element.active = true;
            if (typeof(element.action.in) === 'function') {  
              element.action.in(element);
              console.log('in');
            }
          }
        }
        else if (element.active === true) {
          element.active = false;
          if (typeof(element.action.out) === 'function') {  
            element.action.out(element);
            console.log('out');
          }
        }
      });
    }
    function onScrollResize() {
      
    }

  }
  
  // Public Methods
  get winSize() {
    return this.calcWinSize();
  }
  static offset(elt) {
    return this.calcWinSize(elt);
  }
  
  // Private Methods
  calcOffset(elt) {
    var rect = elt.getBoundingClientRect(), bodyElt = document.body;

    return {
      top: rect.top + bodyElt .scrollTop,
      left: rect.left + bodyElt .scrollLeft
    }
  }
  calcWinSize() {
    const e = document.documentElement,
      g = document.querySelector('body'),
      width = e.clientWidth||g.clientWidth,
      height = e.clientHeight||g.clientHeight;
    return {
      width,
      height,
      vCenter: height / 2,
      hCenter: width / 2
    }
  }
}
/* harmony default export */ __webpack_exports__["a"] = (scrollTrigger);

/***/ }),

/***/ 5:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scrollTrigger__ = __webpack_require__(2);


(function () {  
  window.onload = function () {
    var triggers = new __WEBPACK_IMPORTED_MODULE_0__scrollTrigger__["a" /* default */]({});
    
    var line = document.querySelector('#bg-line__line');
    line.style.strokeDashoffset = 75;
  }
})();

/***/ })

/******/ });