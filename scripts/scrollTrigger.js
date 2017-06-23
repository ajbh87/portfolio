require('intersection-observer');

import debounce from '../node_modules/lodash.debounce/index.js';
import saKnife from './saKnife.js';

class scrollTrigger {
    constructor(override) {
        'use strict';
        const options = createOptions(override),
            st = this;
        st.elements = [];
        st.window = saKnife.winSize();
    
        generateElementsObj();
    
        window.addEventListener('scroll', onScrollProbe);
        window.addEventListener('resize', debounce(onScrollResize, 250));
    
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
                threshold = 0.33,
                observer = new IntersectionObserver(([entry]) => {
                    if (entry.intersectionRatio < threshold) options.inactive(entry.target);
                    else options.active(entry.target);
                },{
                    threshold
                });

            elements.forEach((element, index) => {
                observer.observe(element);        
                st.elements.push({
                    el: element,
                    active: false,
                    index
                });
            });
        }
        function onScrollProbe() {
            let percentScrolled = 0;
            if (options.probe != null) {
                percentScrolled = saKnife.round(window.scrollY / (st.window.documentHeight - st.window.height), 4);
                options.probe(percentScrolled);
            }
        }
        function onScrollResize() {
            st.window = saKnife.winSize();
            onScrollProbe();
        }
    }
}
export default scrollTrigger;