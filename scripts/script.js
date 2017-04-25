import scrollTrigger from './scrollTrigger';
import svgLine from './svgLine';

(function () {
  "use strict";
  
  window.addEventListener('load', onLoad);  
  
  function onLoad() {
    /* global svgLine,scrollTrigger */
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
              points: [2, 5, 8, 10, 11]
            },
            container
          }),
          triggers = new scrollTrigger({
            scope: { 
              sectionOptions,
              sectionTimeout: null
            },
            probe: bindScrollToLine
          });
    let resizeTimeout = null;
    
    getSectionRatios();
    
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
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(getSectionRatios, 500);
    });
    
    function getSectionRatios() {
      const cHeight = container.offsetHeight,
            markers = document.querySelectorAll('.bg-line__point');
      let points = line.el.path.points,
          newRatios = [],
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
    
    function sectionAct(obj, scope) {
      const sec = getChildren(obj.el);
      
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