import scrollTrigger from './scrollTrigger';
import svgLine from './svgLine';

(function () {
  class sliderControls {
    constructor() {
      const sc = this;
      sc.el = document.querySelector('.content-slider');
      sc.container = sc.el.querySelector('.content-slider__container');
      sc.content = sc.el.querySelector('.content-slider__content');
      sc.close = sc.el.querySelector('.content-slider__button-close');
      sc.transition = 500;
      sc.close.addEventListener('click', () => {
        sc.hide();
      });
    }
    show(element) {
      const sc = this;
      let timeout;
      
      if (element != null) {
        try {
          window.setTimeout(onTransitionEnd, sc.transition);
          sc.content.classList.add('fade');          
        }
        catch (e) {
          console.log(e);
        }
      }
      
      sc.el.classList.add('focused');
        
      function onTransitionEnd() {
        sc.content.classList.remove('fade');
        sc.content.innerHTML = element.innerHTML;
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
            path: document.querySelector('.bg-line__line'),
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
    let resizeTimeout = null;

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
    
    markers.forEach((marker) => {
      marker.addEventListener('click', () =>{
        slider.show();
      });
    });
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(getSectionRatios, 500);
    });
    
    getSectionRatios();
    triggers.onScrollTrigger();
    
    
    function getSectionRatios() {
      const cHeight = container.offsetHeight;
      let newRatios = [],
          tops = [];

      triggers.elements.forEach((element, index) => {
        const marker = markers[index + 1],
              ratio = element.size.height / cHeight;
        let top = 0,
            lastTop = 0;
        
        if (index > 0) {
          lastTop = tops[tops.length - 1];
        }
        
        top = (ratio * 100) + lastTop;
        marker.style.top = top + '%';
        
        tops.push(top);
        newRatios.push(ratio);
      });
      
      line.setRatios(newRatios);
    }
    function bindScrollToLine(percent) {      
      const newLength = line.pathLength(percent);
    }
    
    function sectionAct(obj) {
      const sec = getChildren(obj.el),
            winSize = triggers.calcWinSize(),
            dataSelector = '.slider-content',
            dataElement = obj.el.querySelector(dataSelector);
      
      if (winSize.width >= 900 && obj.index > 0 && obj.index < 4) {
        slider.show(dataElement);
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
})();