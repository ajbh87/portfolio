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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 *
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



class AnimatedClip {
  constructor (ac, classSel) {
    this._aC = ac;
    this._aCContents = this._aC.querySelector('.' + classSel + '-contents');
    this._aCToggleButton = this._aC.querySelector('.' + classSel + '-toggle');
    this._aCTitle = this._aC.querySelector('.' + classSel + '-title');
    this._classSel = classSel;
    debugger;
    this._expanded = true;
    this._animate = false;
    this._collapsed;

    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
    this.toggle = this.toggle.bind(this);

    this._calculateScales();
    this._createEaseAnimations();
    this._addEventListeners();

    this.collapse();
    this.activate();
  }

  activate () {
    this._aC.classList.add(this._classSel  + '--active');
    this._animate = true;
  }

  collapse () {
    if (!this._expanded) {
      return;
    }
    this._expanded = false;

    const {x, y} = this._collapsed;
    const invX = 1 / x;
    const invY = 1 / y;

    this._aC.style.transform = `scale(${x}, ${y})`;
    this._aCContents.style.transform = `scale(${invX}, ${invY})`;
    
    if (!this._animate) {
      return;
    }

    this._applyAnimation({expand: false});
  }

  expand () {
    if (this._expanded) {
      return;
    }
    this._expanded = true;

    this._aC.style.transform = `scale(1, 1)`;
    this._aCContents.style.transform = `scale(1, 1)`;
      
    if (!this._animate) {
      return;
    }

    this._applyAnimation({expand: true});
  }

  toggle () {
    if (this._expanded) {
      this.collapse();
      return;
    }

    this.expand();
  }

  _addEventListeners () {
    this._aCToggleButton.addEventListener('click', this.toggle);
  }

  _applyAnimation ({expand}=opts) {
    this._aC.classList.remove(this._classSel  + '--expanded');
    this._aC.classList.remove(this._classSel  + '--collapsed');
    this._aCContents.classList.remove(this._classSel  + '__contents--expanded');
    this._aCContents.classList.remove(this._classSel  + '__contents--collapsed');

    // Force a recalc styles here so the classes take hold.
    window.getComputedStyle(this._aC).transform;

    if (expand) {
      this._aC.classList.add(this._classSel  + '--expanded');
      this._aCContents.classList.add(this._classSel  + '__contents--expanded');
      return;
    }

    this._aC.classList.add(this._classSel  + '--collapsed');
    this._aCContents.classList.add(this._classSel  + '__contents--collapsed');
  }

  _calculateScales () {
    const collapsed = this._aCTitle.getBoundingClientRect();
    const expanded = this._aC.getBoundingClientRect();

    this._collapsed = {
      x: collapsed.width / expanded.width,
      y: collapsed.height / expanded.height
    }
  }

  _createEaseAnimations () {
    let aCEase = document.querySelector('.aC-ease');
    if (aCEase) {
      return aCEase;
    }

    aCEase = document.createElement('style');
    aCEase.classList.add(this._classSel  + '-ease');

    const aCExpandAnimation = [];
    const aCExpandContentsAnimation = [];
    const aCCollapseAnimation = [];
    const aCCollapseContentsAnimation = [];
    for (let i = 0; i <= 100; i++) {
      const step = this._ease(i/100);
      const startX = this._collapsed.x;
      const startY = this._collapsed.y;
      const endX = 1;
      const endY = 1;

      // Expand animation.
      this._append({
        i,
        step,
        startX: this._collapsed.x,
        startY: this._collapsed.y,
        endX: 1,
        endY: 1,
        outerAnimation: aCExpandAnimation,
        innerAnimation: aCExpandContentsAnimation
      });

      // Collapse animation.
      this._append({
        i,
        step,
        startX: 1,
        startY: 1,
        endX: this._collapsed.x,
        endY: this._collapsed.y,
        outerAnimation: aCCollapseAnimation,
        innerAnimation: aCCollapseContentsAnimation
      });
    }

    aCEase.textContent = `
      @keyframes aCExpandAnimation {
        ${aCExpandAnimation.join('')}
      }

      @keyframes aCExpandContentsAnimation {
        ${aCExpandContentsAnimation.join('')}
      }
      
      @keyframes aCCollapseAnimation {
        ${aCCollapseAnimation.join('')}
      }

      @keyframes aCCollapseContentsAnimation {
        ${aCCollapseContentsAnimation.join('')}
      }`;

    document.head.appendChild(aCEase);
    return aCEase;
  }

  _append ({
        i,
        step,
        startX, 
        startY, 
        endX, 
        endY, 
        outerAnimation, 
        innerAnimation}=opts) {

    const xScale = startX + (endX - startX) * step;
    const yScale = startY + (endY - startY) * step;

    const invScaleX = 1 / xScale;
    const invScaleY = 1 / yScale;

    outerAnimation.push(`
      ${i}% {
        transform: scale(${xScale}, ${yScale});
      }`);

    innerAnimation.push(`
      ${i}% {
        transform: scale(${invScaleX}, ${invScaleY});
      }`);
  }

  _clamp (value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  _ease (v, pow=4) {
    v = this._clamp(v, 0, 1);

    return 1 - Math.pow(1 - v, pow);
  }
}
/* unused harmony default export */ var _unused_webpack_default_export = (AnimatedClip);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class scrollTrigger {
  constructor(override) {
    "use strict";
    const options = createOptions(override),
          st = this;
    let scrollTimeout = null,
        resizeTimeout = null;

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
                top: null,
                center: null,
                bottom: null,
                active: null,
                inactive: null
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
          pastCenter: false,
          pastTop: false,
          pastBottom: false
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
    onScrollTrigger();
    
    function createOptions(override) {
      let options = Object.assign({
        scope: {},
        dataName: 'data-scroll-trigger',
        probe: null
      }, override);
    
      options.selector = '[' + options.dataName + ']';
      
      return options;
    }
    function onScrollTrigger() {
      let percentScrolled = 0;
      
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
              if (topFunction !== false) topFunction(element);

              element.pastTop = true;
              
            }
            // center 
            if (checks.afterCenter && element.pastCenter === false) {
              centerFunction = checkFunction(action.center);
              if (centerFunction !== false) centerFunction(element);

              element.pastCenter = true;
            } 
            // bottom
            if (checks.afterBottom && element.pastBottom === false) {
              bottomFunction = checkFunction(action.bottom);

              if (bottomFunction !== false) bottomFunction(element);

              element.pastBottom = true;  
            }
          } 

          // active | inactive
          if (checks.afterTop && checks.beforeBottom) {
            if (element.active === false) {
              activeFunction = checkFunction(action.active);

              if (activeFunction !== false) activeFunction(element);
              element.active = true;
            }
          }
          else if (element.active === true) {
            inactiveFunction = checkFunction(action.inactive);
            
            if (inactiveFunction !== false) inactiveFunction(element);
            element.active = false;
          }
        });
        
      });
      
      if (options.probe != null) {
        percentScrolled = (window.scrollY) / (st.window.documentHeight - st.window.height);
        options.probe(percentScrolled)
      }
    }
    function onScrollResize() {
      window.clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        st.window = st.calcWinSize();
        st.elements.forEach(element => {
          element.size.height = element.el.offsetHeight;
          element.size.width = element.el.offsetWidth;
          element.offset = st.calcOffset(element.el);
          
          element.actions.forEach(action => {
            action.offset = st.getScrollOffset(action.position);
          });
        });
        onScrollTrigger();
      }, 200);
    }
  }
  calcOffset(elt) {
    var rect = elt.getBoundingClientRect(), bodyElt = document.body;

    return {
      top: rect.top + bodyElt.scrollTop,
      left: rect.left + bodyElt.scrollLeft
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
  calcWinSize() {
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
  }
}
/* harmony default export */ __webpack_exports__["a"] = (scrollTrigger);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scrollTrigger__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ac_ac__ = __webpack_require__(0);




(function () {
  "use strict";
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
  
  class svgLine {
    constructor(element){
      let timeout;
      this.el = {
        path: element,
        length: 0
      }
      this.calculatePathLength();
      window.addEventListener('resize', () => { 
        window.clearTimeout(timeout);
        timeout = window.setTimeout(() => {
          this.calculatePathLength();
        }, 150);
      })
    }
    pathLength(percent){
      const offset = round(this.el.length * percent, 4);
      this.el.path.style.strokeDashoffset = this.el.length - offset;
    }
    calculatePathLength(path){
      let length = this.el.path.getTotalLength();

      this.el.length = round(length, 4);
      this.el.path.style.strokeDashoffset = this.el.length;
      this.el.path.style.strokeDasharray = this.el.length;
    }
  }
  
  function onLoad() {
    "use strict";
    const sectionOptions = [{
            position: 'center',
            active: sectionAct,
            inactive: sectionInact
          }],
          line = new svgLine(document.querySelector('.bg-line__line')),
          triggers = new __WEBPACK_IMPORTED_MODULE_0__scrollTrigger__["a" /* default */]({
            scope: { 
              sectionOptions
            },
            probe: bindScrollToLine
          }),
          container = document.querySelector('.bg-line');
    
    function bindScrollToLine(percent) {      
      line.pathLength(percent);
    }

    function sectionAct(obj) {
      const secContent = obj.el.querySelector('.section-content');
      const subContent = secContent.querySelector('.section-content__content');
      
      secContent.classList.add('focused');
      secContent.classList.remove('unfocused');
      
      subContent.classList.add('focused');
      subContent.classList.remove('unfocused');
    }
    function sectionInact(obj) {
      const secContent = obj.el.querySelector('.section-content');
      const subContent = secContent.querySelector('.section-content__content');

      secContent.classList.add('unfocused');
      secContent.classList.remove('focused');
      
      subContent.classList.add('unfocused');
      subContent.classList.remove('focused');
    }
  }
  window.addEventListener('load', onLoad);  
})();

/***/ })
/******/ ]);