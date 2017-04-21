import scrollTrigger from './scrollTrigger';
import AnimatedClip from './ac/ac';


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
          triggers = new scrollTrigger({
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