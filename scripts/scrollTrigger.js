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
                before: null,
                top: null,
                middle: null,
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
    
    function createOptions(override) {
      let options = Object.assign({
        scope: {},
        dataName: 'data-scroll-trigger'
      }, override);
    
      options.selector = '[' + options.dataName + ']';
      
      return options;
    }
    function onScrollTrigger() {
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
          let beforeFunction = false,
              topFunction = false,
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
            // bottom
            else if (checks.afterBottom && element.pastBottom === false) {
              bottomFunction = checkFunction(action.bottom);

              if (bottomFunction !== false) bottomFunction(element);

              element.pastBottom = true;  
            }
          } 
          // before trigger
          else if (element.pastTop === true) {
            beforeFunction = checkFunction(action.bottom);

            if (beforeFunction !== false) beforeFunction(element);
            element.pastTop = false;
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
    }
    function onScrollResize() {
      if (resizeTimeout != null) {
        window.clearTimeout(resizeTimeout);        
      }
      else {
        resizeTimeout = window.setTimeout(() => {
          st.window = st.calcWinSize();
          st.elements.forEach(element => {
            element.size.height = element.offsetHeight;
            element.size.width = element.offsetWidth;
            
            element.actions.forEach(action => {
              action.offset = st.getScrollOffset(opt.position);
            });
          });
        }, 150);
      }
    }

  }
  
  calcOffset(elt) {
    var rect = elt.getBoundingClientRect(), bodyElt = document.body;

    return {
      top: rect.top + bodyElt .scrollTop,
      left: rect.left + bodyElt .scrollLeft
    }
  }
  static offset(elt) {
    return this.calcWinSize(elt);
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
      hCenter: width / 2
    }
  }
  get winSize() {
    return this.calcWinSize();
  }
}
export default scrollTrigger;