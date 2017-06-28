import debounce from '../node_modules/lodash.debounce/index.js';
import saKnife from './saKnife.js';
class scrollTrigger {
    constructor(override) {
        'use strict';
        const options =  Object.assign({
                activeFn: false,
                inactiveFn: false,
                dataName: 'data-scroll-trigger',
                probe: false,
                position: 'center'
            }, override),
            st = this;
        st.elements = [];
        st.window = saKnife.winSize();

        options.scrollOffset = getScrollOffset(options.position);
        options.activeFn = checkFunction(options.activeFn);
        options.inactiveFn = checkFunction(options.inactiveFn);
        options.probe = checkFunction(options.probe);
        options.selector = '[' + options.dataName + ']';

        generateElementsObj();
        onScrollResize();
        onScrollTrigger();
    
        window.addEventListener('scroll', debounce(onScrollTrigger, 100));
        if (options.probe !== false) {
            window.addEventListener('scroll', onScrollProbe);
        }
        window.addEventListener('resize', debounce(onScrollResize, 200));
    
        function generateElementsObj() {
            const elements = document.querySelectorAll(options.selector);

            elements.forEach((element, index) => {
                let newElement = {
                    el: element,
                    offset: saKnife.offset(element),
                    active: false,
                    index
                };
                st.elements.push(newElement);
            });
        }
    
        function onScrollTrigger() {
            st.elements.forEach(element => {
                const scrolled = window.scrollY + options.scrollOffset,
                    bottomTrigger = element.offset.top + element.el.offsetHeight,
                    checks = {
                        afterTop: element.offset.top <= scrolled,
                        beforeBottom: scrolled <= bottomTrigger
                    };
                // active | inactive
                if (checks.afterTop && checks.beforeBottom) {
                    if (element.active === false) {
                        options.activeFn !== false ? options.activeFn(element) : null;

                        element.active = true;
                    }
                }
                else if (element.active === true) {
                    options.inactiveFn !== false ? options.inactiveFn(element) : null;

                    element.active = false;
                }        
            });
        }
        function onScrollProbe() {
            let percentScrolled = saKnife.round((window.scrollY) / (st.window.documentHeight - st.window.height), 4);
            options.probe(percentScrolled);
        }
        function onScrollResize() {
            st.window = saKnife.winSize();
            options.scrollOffset = getScrollOffset(options.position);
            st.elements.forEach(element => {
                element.offset = saKnife.offset(element.el);
            });
        }
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
        function getScrollOffset(position) {
            if (position === 'top') {
                return 0;
            } else if (position === 'bottom') {
                return st.window.height;
            } else {
                return st.window.vCenter;
            }
        }
    }
}
export default scrollTrigger;