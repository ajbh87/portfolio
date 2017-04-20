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
          triggers = new scrollTrigger({
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