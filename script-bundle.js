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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class scrollTrigger {
  constructor(override) {
    "use strict";
    const options = createOptions(override),
          st = this;
    let timeout = null;
    
    st.elements = [];
    st.window = st.calcWinSize();
    
    (function generateElementsObj() {
      const elements = document.querySelectorAll(options.selector);

      elements.forEach(element => {
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
                before: null,
                top: null,
                topActive: null,
                middle: null,
                middleActive: null,
                bottom: null
              };
        let opt = [defaultTrigger],
            override = checkOverride(prop.nodeValue),
            inserted = {};
        
        opt = override !== false ? override : opt;
        
        inserted = {
          el: element,
          offset: st.calcOffset(element),
          size: {
            height: element.offsetHeight,
            width: element.offsetWidth
          },
          actions: [],
          active: false,
          center: false,
          before: true,
          pastTop: false
        }
        
        opt.forEach(trigger => {
          let newTrigger = Object.assign({}, defaultTrigger, trigger);
          
          newTrigger.offset = st.getScrollOffset(newTrigger.position);
          
          inserted.actions.push(newTrigger);
        });
        
        st.elements.push(inserted);
      });
    })();
    
    window.addEventListener('scroll', onScrollTrigger);
    window.addEventListener('resize', onScrollResize);
    
    function createOptions(override) {
      let options = Object.assign({
        scope: {},
        dataName: 'data-scroll-trigger'
      }, override);
    
      options.selector = '[' + options.dataName + ']';
      
      return options;
    }
    function onScrollTrigger() {        
      st.elements.forEach(element => {
        
        element.actions.forEach(action => {
          const scrolled = window.scrollY + action.offset,
                centerTrigger = element.offset.top + (element.size.height / 2),
                bottomTrigger = element.offset.top + element.size.height;
          let beforeFunction = false,
              topFunction = false,
              topActFunction = false,
              centerFunction = false,
              centerActFunction = false,
              bottomFunction = false;
              
          function beforeTopPositon() {
            return scrolled < element.offset.top;
          }
          function afterTopPositon() {
            return element.offset.top <= scrolled;
          }
          function afterCenterPositon() {
            return centerTrigger <= scrolled;
          }
          function beforeBottomPositon() {
            return scrolled <= bottomTrigger;
          }
          function afterBottomPositon() {
            return bottomTrigger < scrolled;
          }
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

          // top, topActive, middle, middleActive and bottom triggers
          if (afterTopPositon()) {
            if (element.active === false && element.pastTop === false) {
              // top 
              topFunction = checkFunction(action.top);
              if (topFunction !== false) topFunction(element);
              
              // topActive
              if (beforeBottomPositon()) {
                topActFunction = checkFunction(action.topActive);
                if (topActFunction !== false) topActFunction(element);

              }
              element.pastTop = true;
              element.active = true;
              
            } 
            // bottom
            else if (afterBottomPositon()) {
              bottomFunction = checkFunction(action.bottom);

              if (bottomFunction !== false) bottomFunction(element);

              element.active = false;  
            }
            
            // middle
            if (afterCenterPositon() && element.center === false) {
              centerFunction = checkFunction(action.middle);

              if (centerFunction !== false) centerFunction(element);
              
              if (beforeBottomPositon()) {
                centerActFunction = checkFunction(action.middleActive);

                if (centerActFunction !== false) centerActFunction(element);
              }
              element.center = true;
            }
          } else {
            if (element.pastTop === true) {
              beforeFunction = checkFunction(action.bottom);

              if (beforeFunction !== false) beforeFunction(element);
              element.pastTop = true;
            }
          }
          
        });
        
      });
    }
    function onScrollResize() {
      if (timeout != null) {
        window.clearTimeout(timeout);
        
        
      }
      else {
        timeout = window.setTimeout(() => {
          st.window = st.calcWinSize();
          st.elements.forEach(element => {
            element.size.height = element.offsetHeight;
            element.size.width = element.offsetWidth;
            
            element.actions.forEach(action => {
              action.offset = st.getScrollOffset(opt.position);
            });
          });
        }, 150);
      }
    }

  }
  
  calcOffset(elt) {
    var rect = elt.getBoundingClientRect(), bodyElt = document.body;

    return {
      top: rect.top + bodyElt .scrollTop,
      left: rect.left + bodyElt .scrollLeft
    }
  }
  static offset(elt) {
    return this.calcWinSize(elt);
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
  get winSize() {
    return this.calcWinSize();
  }
}
/* harmony default export */ __webpack_exports__["a"] = (scrollTrigger);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scrollTrigger__ = __webpack_require__(0);


(function () {
  function hasClass(el) {
    return el.classList.contains(className);
  }
  function outerHeight(el) {
    var height = el.offsetHeight;
    var style = getComputedStyle(el);

    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    return height;
  }
  function outerWidth(el) {
    var width = el.offsetWidth;
    var style = getComputedStyle(el);

    width += parseInt(style.marginLeft) + parseInt(style.marginRight);
    return width;
  }
  function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  }
  
  function onLoad() {
    class svgLine {
      constructor(element){
        this.el = {
          path: element.querySelector('.bg-line__line'),
          length: 0
        }
        this.calculatePathLength();

        window.addEventListener('resize', () => { 
          this.calculatePathLength();
        })
      }

      pathLength(percent){
        const offset = round(this.el.length * percent, 1);
        this.el.path.style.strokeDashoffset = 100 - offset;
      }
      
      calculatePathLength(path){
        let length = this.el.path.getTotalLength();
        
		this.el.length = round(length, 3);
      }
    }
        
    const scope = { 
      sectionOptions: [{
        position: 'center',
        before: sectionOut,
        top: sectionTop,
        topActive: sectionTopAct,
        bottom: sectionOut
      }]
    },
          triggers = new __WEBPACK_IMPORTED_MODULE_0__scrollTrigger__["a" /* default */]({
            scope
          });
    
    function sectionTop(obj) {
      let line = new svgLine(obj.el);
      
      line.pathLength(.5);
    }
    function sectionMiddle(obj) {
      let line = new svgLine(obj.el);
      
      line.pathLength(1);
    }
    
    function sectionTopAct(obj) {
      const secContent = obj.el.querySelector('.section-content');

      secContent.classList.add('focused');
    }
    function sectionOut(obj) {
      const secContent = obj.el.querySelector('.section-content');
      
      secContent.classList.remove('focused');
    }
  }
  window.addEventListener('load', onLoad);
})();

/***/ })
/******/ ]);