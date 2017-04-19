class scrollTrigger {
  constructor(override) {
    "use strict";
    const options = createOptions(override),
          st = this;
    
    st.elements = [];
    st.window = st.calcWinSize();
    
    (function generateElementsObj() {
      const elements = document.querySelectorAll(options.selector);

      elements.forEach(element => {
        function getScrollOffset(position) {
          switch(position) {
            case 'top':
              return 0;
              break;
            case 'bottom':
              return st.window.height;
              break;
            case 'center':
            default:
              return st.window.vCenter;
              break;
          }
        }
        
        let opt = {
          in: null,
          out: null,
          position: 'center'
        },
            override = element.attributes.getNamedItem(options.dataName).nodeValue;
        
        eval('override = ' + override);
        
        opt = Object.assign(opt, override);
        
        st.elements.push({
          el: element,
          offset: st.calcOffset(element),
          size: {
            height: element.offsetHeight,
            width: element.offsetWidth
          },
          action: {
            in: opt.in,
            out: opt.out
          },
          position: opt.position,
          scrollOffset: getScrollOffset(opt.position),
          active: false
        });
      });
    })();
    
    window.addEventListener('scroll', onScrollTrigger);
    window.addEventListener('resize', onScrollResize);
    
    function createOptions(override) {
      let options = Object.assign({
        dataName: 'data-scroll-trigger'
      }, override);
    
      options.selector = '[' + options.dataName + ']';
      
      return options;
    }
    function onScrollTrigger() {        
      st.elements.forEach(element => {
        const scrolled = window.scrollY + element.scrollOffset;
        
        function moreThanOffset() {
          return scrolled >= element.offset.top;
        }
        function lessThanOffsetPlusSize() {
          return scrolled <= (element.offset.top + element.size.height);
        }

        if (moreThanOffset() && lessThanOffsetPlusSize()) {
          if (element.active === false) {
            element.active = true;
            if (typeof(element.action.in) === 'function') {  
              element.action.in(element);
              console.log('in');
            }
          }
        }
        else if (element.active === true) {
          element.active = false;
          if (typeof(element.action.out) === 'function') {  
            element.action.out(element);
            console.log('out');
          }
        }
      });
    }
    function onScrollResize() {
      
    }

  }
  
  // Public Methods
  get winSize() {
    return this.calcWinSize();
  }
  static offset(elt) {
    return this.calcWinSize(elt);
  }
  
  // Private Methods
  calcOffset(elt) {
    var rect = elt.getBoundingClientRect(), bodyElt = document.body;

    return {
      top: rect.top + bodyElt .scrollTop,
      left: rect.left + bodyElt .scrollLeft
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
}
export default scrollTrigger;