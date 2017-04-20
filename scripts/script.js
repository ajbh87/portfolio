import scrollTrigger from './scrollTrigger';

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
  
  class svgLine {
    constructor(element){
      this.el = {
        path: element,
        length: 0
      }
      this.calculatePathLength();

      window.addEventListener('resize', () => { 
        this.calculatePathLength();
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
    const sectionOptions = [{
            position: 'center',
            active: sectionAct,
            inactive: sectionInact
          }],
          triggers = new scrollTrigger({
            scope: { 
              sectionOptions
            },
            probe: bindScrollToLine
          }),
          line = new svgLine(document.querySelector('.bg-line__line')),
          container = document.querySelector('.bg-line');
    
    function bindScrollToLine(percent) {      
      line.pathLength(percent);
    }
    
    function sectionAct(obj) {
      const secContent = obj.el.querySelector('.section-content');

      secContent.classList.add('focused');
    }
    function sectionInact(obj) {
      const secContent = obj.el.querySelector('.section-content');
      
      secContent.classList.remove('focused');
    }
  }
  window.addEventListener('load', onLoad);
  
  
})();