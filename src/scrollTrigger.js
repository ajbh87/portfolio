import debounce from '../node_modules/lodash.debounce/index.js';
import saKnife from './saKnife.js';
class scrollTrigger {
    constructor(override) {
        'use strict';
        const options =  Object.assign({
                activeFn: false,
                beforeActiveFn: false,
                dataName: 'data-scroll-trigger',
                event: false,
                eventName: 'scrollTrigger',
                inactiveFn: false,
                position: 'center',
                probeFn: false,
                offset: 0,
                scope: {}
            }, override),
            st = this;

        st.elements = [];
        st.window = saKnife.winSize();

        [
            options.activeFn, 
            options.inactiveFn, 
            options.beforeActiveFn,
            options.probeFn
        ].forEach( fn => fn = checkFunction(fn));

        options.scrollOffset = getScrollOffset(options.position);
        options.selector = '[' + options.dataName + ']';

        generateElementsObj();
        onScrollResize();

        st.onScrollTrigger = onScrollTrigger;
        st.onScrollProbe = onScrollProbe;
        if (st.elements.length > 0) {
            window.addEventListener('scroll', debounce(onScrollTrigger, 100));
        }
        if (options.probeFn !== false) {
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
            let changed = [];
            st.elements.filter(element => {
                const scrolled = window.scrollY + options.scrollOffset,
                    bottomTrigger = element.offset.top + element.el.offsetHeight,
                    checks = {
                        afterTop: element.offset.top <= scrolled,
                        beforeBottom: scrolled <= bottomTrigger
                    };
                let elChanged = null;
                // active | inactive
                if (checks.afterTop && checks.beforeBottom) {
                    elChanged = toggleActiveInactive(element, true);
                }
                else if (element.active === true) {
                    elChanged = toggleActiveInactive(element, false);
                }
                elChanged != null ? changed.push(elChanged) : null;  
            });
            if (options.event && changed.length > 0) {
                window.dispatchEvent(new CustomEvent(options.eventName, {
                    detail: changed
                }));
            }
        }
        function toggleActiveInactive(element, active) {
            // set active
            if (element.active === false && active === true) {
                (options.event !== true && options.activeFn !== false) ? 
                    options.activeFn(element) : null;
                
                element.active = true;
                return element;
            }
            // set inactive
            else if (element.active === true && active === false) {
                (options.event !== true && options.inactiveFn !== false) ? 
                    options.inactiveFn(element) : null;
                
                element.active = false;
                return element;
            }
            return null;
        }
        function onScrollProbe() {
            let percentScrolled = saKnife.round((window.scrollY) / (st.window.documentHeight - st.window.height), 4);
            options.probeFn(percentScrolled);
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
                if (typeof(options.scope[possibleFunc]) === 'function') {
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