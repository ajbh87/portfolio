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
 * @property {string} eventName - Custom event name 
 * @property {number} offset - Trigger line numerical offset.
 * @property {string} position - 'center' (default), 'top', 'bottom' | Position of trigger line.
 * @property {bool} probe - false (default).
 * @property {string} selector - 'Element' selector. Must be data-*.
 * @example
 * An example invocation showing default parameters, except the functions obviously.
 * const ST = new scrollTrigger({
    eventName: 'scrollTrigger',
    offset: 0,
    position: 'center',
    probe: false,
    selector: '[data-scroll-trigger]'
 });
 * 
 */
class scrollTrigger {
    constructor(override) {
        // Merge overrides and defaults into options object
        this.options =  Object.assign({
            selector: '[data-scroll-trigger]',
            eventName: 'scrollTrigger',
            eventNameProbe: 'scrollProbe',
            offset: 0,
            position: 'center',
            probe: false
        }, override);
        // Get window and document size
        this.window = saKnife.winSize();
        this.options.triggerLine = this._getTriggerLine(this.options.position);

        // Find elements and add them to array
        this.elements = scrollTrigger.generateElementsObj(this.options.selector);
        this.onScrollResize();
        if (this.elements.length > 0) {
            window.addEventListener('scroll', debounce(() => {
                this.onScrollTrigger();
            }, 100));
        }
        if (this.options.probe !== false) {
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
        
        window.dispatchEvent(new CustomEvent(this.options.eventNameProbe, {
            detail: percentScrolled
        }));
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
            element.active = true;
            return element;
        }
        // set inactive
        else if (element.active === true && active === false) {         
            element.active = false;
            return element;
        }
        return null;
    }
}
export default scrollTrigger;