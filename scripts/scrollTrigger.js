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
            const threshold = ((step) => {
                    let t = [],
                        newStep = step;
                    if (0 < step && step < 1) {
                        while(newStep <= 1) {
                            t.push(newStep);
                            newStep = saKnife.round(newStep + step, 1);
                        }
                    }
                    return t;
                })(0.1),
                elements = document.querySelectorAll(options.selector),
                inObserver = new IntersectionObserver(([entry]) => {
                    if (entry.intersectionRatio < 0.2) return;

                    options.active(entry.target);
                    inObserver.unobserve(entry.target);
                },{
                    threshold
                });
            let index = 0;
            for (index = 0; index < elements.length; index ++) {
                inObserver.observe(elements[index]); 
                st.elements.push({
                    el: elements[index],
                    active: false,
                    index
                });
            }
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