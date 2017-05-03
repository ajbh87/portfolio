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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__saKnife__ = __webpack_require__(0);

class scrollTrigger {
  constructor(override) {
    "use strict";
    const options = createOptions(override),
          st = this;
    let scrollTimeout = null,
        resizeTimeout = null;

    st.elements = [];
    st.window = __WEBPACK_IMPORTED_MODULE_0__saKnife__["a" /* default */].winSize();
    
    (function generateElementsObj() {
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
          offset: __WEBPACK_IMPORTED_MODULE_0__saKnife__["a" /* default */].offset(element),
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
    })();
    st.onScrollTrigger = onScrollTrigger;
    
    window.addEventListener('scroll', st.onScrollTrigger);
    window.addEventListener('resize', onScrollResize);
    
    
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
      
      if (options.probe != null) {
        percentScrolled = __WEBPACK_IMPORTED_MODULE_0__saKnife__["a" /* default */].round((window.scrollY) / (st.window.documentHeight - st.window.height), 4);
        options.probe(percentScrolled);
      }
    }
    function onScrollResize() {
      window.clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        st.window = __WEBPACK_IMPORTED_MODULE_0__saKnife__["a" /* default */].winSize();
        st.elements.forEach(element => {
          element.size.height = element.el.offsetHeight;
          element.size.width = element.el.offsetWidth;
          element.offset = __WEBPACK_IMPORTED_MODULE_0__saKnife__["a" /* default */].offset(element.el);
          
          element.actions.forEach(action => {
            action.offset = st.getScrollOffset(action.position);
          });
        });
        onScrollTrigger();
      }, 500);
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
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__saKnife__ = __webpack_require__(0);


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
        newY = __WEBPACK_IMPORTED_MODULE_0__saKnife__["a" /* default */].round((y * ratioDiff) - y, 3);

        if (diffs.length > 0) {
          newY = __WEBPACK_IMPORTED_MODULE_0__saKnife__["a" /* default */].round(newY + diffs[diffs.length - 1], 3);
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
          triggerLength = __WEBPACK_IMPORTED_MODULE_0__saKnife__["a" /* default */].round(triggerLength + length, 0);
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
      return __WEBPACK_IMPORTED_MODULE_0__saKnife__["a" /* default */].round(Math.sqrt((lX * lX) + (lY * lY)), 2);
    }
  }
};
/* harmony default export */ __webpack_exports__["a"] = (svgLine);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scrollTrigger__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__svgLine__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__saKnife__ = __webpack_require__(0);




class sliderControls {
  constructor() {
    const sc = this;
    sc.el = document.querySelector('.content-slider');
    sc.content = sc.el.querySelector('.content-slider__content');
    sc.close = sc.el.querySelector('.content-slider__button-close');
    sc.transition = 500;
    sc.close.addEventListener('click', () => {
      sc.hide();
    });
    sc.acttiveChild = null;
  }
  show(element, callback) {
    const sc = this;
    let timeout;
    resetAll();

    window.setTimeout(onTransitionEnd, sc.transition);
    sc.content.classList.add('fade');
    sc.el.classList.add('focused');

    function onTransitionEnd() {
      let children;
      sc.content.classList.remove('fade');
      sc.content.innerHTML = element.innerHTML;
      children = sc.content.querySelectorAll('.content-slider__element');
      
      children.forEach((child) => {
        child.addEventListener('click', () => {
          childClick(child);
        });
        child.addEventListener('keydown', (e) => {
          if (e.key === "Enter" || e.keyCode === 13)
            childClick(child);
        });
      });
      if (callback != null) {
        callback();
      }
    }
    function childClick(child) {
      const childClassName = 'active',
            contentOffset = sc.content.scrollTop,
            winSize = __WEBPACK_IMPORTED_MODULE_2__saKnife__["a" /* default */].winSize();
      let childOffset = child.offsetTop;
      
      childOffset = winSize.vCenter - childOffset - (child.offsetHeight / 2);
      // hide
      if (__WEBPACK_IMPORTED_MODULE_2__saKnife__["a" /* default */].hasClass(child, childClassName)) {
        removeClass(child, childClassName);
        sc.content.style.transform = sc.lastPos;

        window.setTimeout(() => {
          resetAll();
        }, sc.transition);
      }
      // Show
      else {
        if (sc.acttiveChild != null) {
          removeClass(sc.acttiveChild, childClassName);
        } else {
          sc.lastPos = sc.content.style.transform;
          addClass(sc.el, 'expand');
        }
        sc.slidePixels(childOffset);
        addClass(child, childClassName);
        sc.acttiveChild = child;
      }
    }
    function resetAll() {
      sc.acttiveChild = null;
      removeClass(sc.el, 'expand');
    }
    function addClass(el, className) {
      el.classList.add(className);
    }
    function removeClass(el, className) {
      el.classList.remove(className);
    }

  }
  hide(clear) {
    const sc = this;
    if (clear){
      window.setTimeout(() => {
        sc.content.innerHTML = '';
      }, sc.transition);
    } 
    sc.el.classList.remove('focused');
  }
  slidePercent(percent) {
    let winSize = __WEBPACK_IMPORTED_MODULE_2__saKnife__["a" /* default */].winSize(),
        childOffset = 0,
        scrollable = this.content.offsetHeight - winSize.height,
        scroll = 0;
    if (scrollable > 0) {
      scroll = -scrollable * percent;
    } else scroll = 0;
    this.slidePixels(scroll);
  }
  slidePixels(childOffset) {
    this.content.style.transform = 'translate(0, ' + childOffset + 'px)';
  }
}

window.addEventListener('load', onLoad);  

function onLoad() {
  "use strict";
  const sectionOptions = [{
          position: 'center',
          active: sectionAct,
          inactive: sectionInact
        }],
        container = document.querySelector('.bg-line'),
        line = new __WEBPACK_IMPORTED_MODULE_1__svgLine__["a" /* default */]({
          path: document.querySelector('.bg-line__line'),
          triggers: {
            points: [2, 4, 8, 10, 11]
          },
          container
        }),
        triggers = new __WEBPACK_IMPORTED_MODULE_0__scrollTrigger__["a" /* default */]({
          scope: { 
            sectionOptions,
            sectionTimeout: null
          },
          probe: bindScrollToLine
        }),
        markers = document.querySelectorAll('.bg-line__point'),
        slider = new sliderControls();
  let resizeTimeout = null,
      listenSecScroll = false,
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

//  markers.forEach((marker) => {
//    marker.addEventListener('click', () =>{
//      slider.show();
//    });
//  });
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      sectionsSizes = getSectionRatios();
      line.setRatios(sectionsSizes.ratios);
    }, 500);
  });
  
  triggers.onScrollTrigger();
  
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
      ratios.push(ratio);
    });

    return {
      ratios
    };
  }
  function bindScrollToLine(percent) {      
    const newLength = line.pathLength(percent);
  }

  function sectionAct(obj) {
    const sec = getChildren(obj.el),
          winSize = __WEBPACK_IMPORTED_MODULE_2__saKnife__["a" /* default */].winSize(),
          dataSelector = '.slider-content',
          dataElement = obj.el.querySelector(dataSelector);
    
    obj.bindScrollSlider = function () {
      let percent = ((window.scrollY + winSize.vCenter) - obj.offset.top) / obj.size.height;

      //if (percent > 0) {
        slider.slidePercent(percent); 
      //}
    };
    
    if (winSize.width >= 900 && obj.index > 0 && obj.index < 4) {
      slider.show(dataElement, () => {
        window.addEventListener('scroll', obj.bindScrollSlider);
        obj.bindScrollSlider();
      });
    } else {
      if (obj.index === 0) {
        slider.hide(true);
      } else {
        slider.hide();
      }
    }
    
    sec.title.classList.add('focused');

    sec.content.classList.add('focused');
    sec.content.classList.remove('unfocused');

    sec.subContent.classList.add('focused');
    sec.subContent.classList.remove('unfocused');
    
  }
  function sectionInact(obj) {
    const sec = getChildren(obj.el);
    window.removeEventListener('scroll', obj.bindScrollSlider);
    sec.title.classList.remove('focused');

    sec.content.classList.add('unfocused');
    sec.content.classList.remove('focused');

    sec.subContent.classList.add('unfocused');
    sec.subContent.classList.remove('focused');
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