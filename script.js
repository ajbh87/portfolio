import scrollTrigger from './scripts/scrollTrigger.js';
import svgLine from './scripts/svgLine.js';
import saKnife from './scripts/saKnife.js';
import debounce from './node_modules/lodash.debounce/index.js';

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

  window.addEventListener('resize', debounce(onResize, 500));
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
      ratios.push(saKnife.round(ratio, 6));
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
