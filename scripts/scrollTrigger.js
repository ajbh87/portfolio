import saKnife from './saKnife.js';
import debounce from '../node_modules/lodash.debounce/index.js';

class scrollTrigger {
  constructor(override) {
    "use strict";
    const options = createOptions(override),
          st = this;
    let scrollTimeout = null,
        resizeTimeout = null;

    st.elements = [];
    st.window = saKnife.winSize();
    st.onScrollTrigger = onScrollTrigger;
    st.onScrollResize = onScrollResize;
    
    generateElementsObj();
    
    window.addEventListener('scroll', onScrollProbe);
    window.addEventListener('scroll', debounce(onScrollTrigger, 100));
    window.addEventListener('resize', debounce(onScrollResize, 100));
    
    // Private
    function createOptions(override) {
      let options = Object.assign({
        scope: {},
        dataName: 'data-scroll-trigger',
        probe: null
      }, override);
    
      options.selector = '[' + options.dataName + ']';
      
      return options;
    }
    function generateElementsObj() {
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
          offset: saKnife.offset(element),
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
    }
    // Public
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
    }
    function onScrollProbe() {
      let percentScrolled = 0;
      if (options.probe != null) {
        percentScrolled = saKnife.round((window.scrollY) / (st.window.documentHeight - st.window.height), 4);
        options.probe(percentScrolled);
      }
    }
    function onScrollResize() {
      st.window = saKnife.winSize();
      st.elements.forEach(element => {
        element.size.height = element.el.offsetHeight;
        element.size.width = element.el.offsetWidth;
        element.offset = saKnife.offset(element.el);
        
        element.actions.forEach(action => {
          action.offset = st.getScrollOffset(action.position);
        });
      });
      onScrollTrigger();
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
export default scrollTrigger;