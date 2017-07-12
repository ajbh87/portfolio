/** 
 * Exports scrollTrigger class.
 * @module src/scrollTrigger
 * @requires module:src/saKnife saKnife
 */
import debounce from '../node_modules/lodash.debounce/index.js';
import saKnife from './saKnife.js';
/** 
 * Yet another scroll trigger js tool.
 * When an element gets to a certain point in the viewport (crosses a trigger line) run a function.
 * @class scrollTrigger
 * @param {object} options
 * @property {function|string} activeFn - null (default) | Function to run when 'element' becomes active.
 * @property {string} eventName - Custom event name 
 * @property {function|string} inactiveFn - null (default) | Function to run when 'element' becomes inactive.
 * @property {string} position - 'center' (default), 'top', 'bottom' | Position of trigger line.
 * @property {number} offset - Trigger line numerical offset.
 * @property {function|string} probeFn - null (default) | Function to run on scroll.
 * @property {object} scope - Object containing functions.
 * @property {string} selector - 'Element' selector. Must be data-*.
 * @example
 * An example invocation showing default parameters, except the functions obviously.
 * const ST = new scrollTrigger({
    activeFn: (stElement) => { 
        // Do something cool...
    },
    eventName: 'scrollTrigger',
    inactiveFn: (stElement) => {
        // Maybe do another thing that's also cool...
    },
    offset: 0,
    position: 'center',
    probeFn: (docScrolledPercent) => {
        // You could do another thing. But beware this function will run on EACH scroll event.
    },
    scope: {} // If 
 });
 * 
 */
class scrollTrigger {
    constructor(override) {
        // Merge overrides and defaults into options object
        this.options =  Object.assign({
            activeFn: null,
            selector: '[data-scroll-trigger]',
            eventName: 'scrollTrigger',
            inactiveFn: null,
            position: 'center',
            probeFn: null,
            offset: 0,
            scope: {}
        }, override);
        // Get window and document size
        this.window = saKnife.winSize();
        this.options.triggerLine = this._getTriggerLine(this.options.position);

        // Check if user provided functions are functions
        [
            this.options.activeFn, 
            this.options.inactiveFn, 
            this.options.probeFn
        ].forEach( fn => fn = this._checkFunction(fn));
        // Find elements and add them to array
        this.elements = scrollTrigger.generateElementsObj(this.options.selector);
        this.onScrollResize();
        if (this.elements.length > 0) {
            window.addEventListener('scroll', debounce(() => {
                this.onScrollTrigger();
            }, 100));
        }
        if (this.options.probeFn !== false) {
            window.addEventListener('scroll', () => {
                this.onScrollProbe();
            });
        }
        window.addEventListener('resize', debounce(() => {
            this.onScrollResize();
        }, 200));
    }
    /**
     * Scroll Trigger Elements wrapper
     * @typedef {object} stElement
     * @property {NodeElement} el - Element
     * @property {number} offset - Element offsetObject.
     * @property {bool} active - True/False if is element is active.
     * @property {number} index - Index. Nuff' said.
     */
    /**
     * Generate elements array. Each element is wrapped in a an stElement object.
     * The idea is to precalculate offset position, so that scrolling performance is not impacted
     * by multiple calls to getBoundingClientRect().
     * @param {string} selector - Elements selector.
     * @returns {array} elementArray - An array of stElements
     */
    static generateElementsObj(selector) {
        const elements = document.querySelectorAll(selector);
        let elArray = [];
        elements.forEach((element, index) => {
            let newElement = {
                el: element,
                offset: saKnife.offset(element),
                active: false,
                index
            };
            elArray.push(newElement);
        });
        return elArray;
    }
    _checkFunction(possibleFunc) {
        if (possibleFunc == null) {
            return false;
        } else  {
            if (typeof(possibleFunc) === 'function') {  
                return possibleFunc;
            }
            if (typeof(this.options.scope[possibleFunc]) === 'function') {
                return this.options.scope[possibleFunc];
            }
            return false;            
        }
    }
    _getTriggerLine(position) {
        switch(position) {
        case 'top':
            return 0;
        case 'bottom':
            return this.window.height;
        case 'center':
        default:
            return this.window.vCenter;
        }
    }
    onScrollTrigger() {
        let changed = [];
        this.elements.forEach(element => {
            const scrolled = window.scrollY + this.options.triggerLine,
                bottomTrigger = element.offset.top + element.el.offsetHeight,
                checks = {
                    afterTop: element.offset.top <= scrolled,
                    beforeBottom: scrolled <= bottomTrigger
                };
            let elChanged = null;
            // active | inactive
            if (checks.afterTop && checks.beforeBottom) {
                elChanged = this._toggleActiveInactive(element, true);
            }
            else if (element.active === true) {
                elChanged = this._toggleActiveInactive(element, false);
            }
            elChanged != null ? changed.push(elChanged) : null;  
        });
        if (this.options.event && changed.length > 0) {
            window.dispatchEvent(new CustomEvent(this.options.eventName, {
                detail: changed
            }));
        }
    }
    onScrollProbe() {
        let percentScrolled = saKnife.round((window.scrollY) / 
            (this.window.documentHeight - this.window.height), 4);
        this.options.probeFn(percentScrolled);
    }
    onScrollResize() {
        this.window = saKnife.winSize();
        this.options.triggerLine = this._getTriggerLine(this.options.position);
        this.elements.forEach(element => {
            element.offset = saKnife.offset(element.el);
        });
    }
    /**
     * @private
     */
    _toggleActiveInactive(element, active) {
        // set active
        if (element.active === false && active === true) {
            if (this.options.event !== true && this.options.activeFn !== false)
                this.options.activeFn(element);
               
            element.active = true;
            return element;
        }
        // set inactive
        else if (element.active === true && active === false) {
            if (this.options.event !== true && this.options.inactiveFn !== false)
                this.options.inactiveFn(element);
            
            element.active = false;
            return element;
        }
        return null;
    }
}
export default scrollTrigger;