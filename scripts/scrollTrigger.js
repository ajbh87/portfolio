require('intersection-observer');

import saKnife from './saKnife.js';
import debounce from '../node_modules/lodash.debounce/index.js';

class scrollTrigger {
  constructor(override) {
    "use strict";
    const options = createOptions(override),
          st = this;
    let scrollTimeout = null,
        resizeTimeout = null,
        customEvent  = new CustomEvent('sizesRecalculated', {
          detail: st
        });

    st.elements = [];
    st.window = saKnife.winSize();
    
    generateElementsObj();
    
    window.addEventListener('scroll', onScrollProbe);

    window.addEventListener('resize', debounce(onScrollResize, 250));
    
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
      const elements = document.querySelectorAll(options.selector),
            defaultTrigger = {
              position: 'center', // center | top | bottom
              offset: 0,
              top: null,
              center: null,
              bottom: null,
              active: null,
              inactive: null
            };

      elements.forEach((element, index) => {
        const prop = element.attributes.getNamedItem(options.dataName);
        let override = checkOverride(prop.value),
            opt = (override !== false) ? override : [Object.assign({}, defaultTrigger)],
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
            };

        const observer = new IntersectionObserver(([entry]) => {
          console.log(entry.intersectionRatio);
          if (entry.intersectionRatio < 0.33) options.inactive(element);
          else options.active(element);

          // Stop watching the element
          //observer.disconnect();
        },{
          threshold: 0.33
        });
        observer.observe(element);
        
        opt.forEach(trigger => {
          let newTrigger = Object.assign({}, defaultTrigger, trigger);
          inserted.actions.push(newTrigger);
        });
        
        st.elements.push(inserted);
      });
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
    }
    // Public
    function onScrollProbe() {
      let percentScrolled = 0;
      if (options.probe != null) {
        percentScrolled = saKnife.round(window.scrollY / (st.window.documentHeight - st.window.height), 4);
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
      window.dispatchEvent(customEvent);
      //onScrollTrigger();
      onScrollProbe();
    }
  }
}
export default scrollTrigger;