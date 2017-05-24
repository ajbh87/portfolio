import scrollTrigger from './scrollTrigger.js';
import svgLine from './svgLine.js';
import saKnife from './saKnife.js';

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
            winSize = saKnife.winSize();
      let childOffset = child.offsetTop;
      
      childOffset = winSize.vCenter - childOffset - (child.offsetHeight / 2);
      // hide
      if (saKnife.hasClass(child, childClassName)) {
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
    let winSize = saKnife.winSize(),
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
        line = new svgLine({
          path: document.querySelector('.bg-line__path'),
          triggers: {
            points: [2, 4, 8, 10, 11]
          },
          container
        }),
        triggers = new scrollTrigger({
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
          winSize = saKnife.winSize(),
          dataSelector = '.slider-content',
          dataElement = obj.el.querySelector(dataSelector);
    
    obj.bindScrollSlider = null;
    
    if (winSize.width >= 900 && obj.index > 0 && obj.index < 4) {
      slider.show(dataElement, () => {
        let sliderTimeout;
        obj.bindScrollSlider = function () {
          window.clearTimeout(sliderTimeout);
          sliderTimeout = window.setTimeout(() => {
            let percent = ((window.scrollY + winSize.vCenter) - obj.offset.top) / obj.size.height;

            slider.slidePercent(percent); 
          }, 50);
        };
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
