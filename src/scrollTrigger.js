import debounce from '../node_modules/lodash.debounce/index.js';
import saKnife from './saKnife.js';

/**
 * Scroll Trigger Options Object
 * @typedef {object} stOptions
 * @property {string} eventName - Custom event name
 * @property {number} offset - Trigger line numerical offset.
 * @property {string} position - 'center' (default), 'top', 'bottom' |
 Position of trigger line.
 * @property {boolean} probe - false (default).
 * @property {string} selector - 'Element' selector. Must be data-*.  
 */

/**
 * Scroll Trigger Elements wrapper
 * @typedef stElement
 * @type {object}
 * @property {HTMLElement} el - HTMLElement
 * @property {offsetObject} offset - HTMLElement's [offsetObject]{@link offsetObject}.
 * @property {boolean} active - True/False if is element is active.
 * @property {number} index - Index. Nuff' said.
*/

/**
 * Yet another scroll trigger js tool. When an element gets to a 
 * certain point in the viewport (crosses a trigger line) run a function.
 * @example
 * // Showing default parameters.
 * const ST = new scrollTrigger({
      eventName: 'scrollTrigger',
      offset: 0,
      position: 'center',
      probe: false,
      selector: '[data-scroll-trigger]'
  });
 * @requires src/saKnife - saKnife
 * @requires node_modules/lodash.debounce - lodash.debounce
 */
class scrollTrigger {
  /**
   * @param {stOptions} override - [stOptions]{@link stOptions}
   */
  constructor(override) {
    // Merge overrides and defaults into options object
    this.options = Object.assign(
      {
        selector: '[data-scroll-trigger]',
        eventName: 'scrollTrigger',
        eventNameProbe: 'scrollProbe',
        offset: 0,
        position: 'center',
        probe: false
      },
      override
    );
    // Get window and document size
    this.window = saKnife.winSize();
    this.options.triggerLine = this._getTriggerLine(this.options.position);

    // Find elements and add them to array
    this.elements = scrollTrigger.generateElementsObj(this.options.selector);

    this.onScrollResize();

    // Add event listeners
    if (this.elements.length > 0) {
      window.addEventListener(
        'scroll',
        debounce(() => {
          this.onScrollTrigger();
        }, 100)
      );
    }
    if (this.options.probe !== false) {
      window.addEventListener('scroll', () => {
        this.onScrollProbe();
      });
    }
    window.addEventListener(
      'resize',
      debounce(() => {
        this.onScrollResize();
      }, 200)
    );
  }

  /**
   * Generate elements array. Each element is wrapped in a an stElement object.
   * The idea is to precalculate offset position, so that scrolling performance
   * is not impacted by multiple calls to getBoundingClientRect().
   * @param {string} selector - Elements selector.
   * @returns {stElement[]} An array of [stElements]{@link stElement}
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
  /**
   * Get Trigger Line position in pixels.
   * @param {string} position - Position option.
   * @returns {number} - Trigger Line position in pixels
  */
  _getTriggerLine(position) {
    switch (position) {
      case 'top':
        return 0;
      case 'bottom':
        return this.window.height;
      case 'center':
      default:
        return this.window.vCenter;
    }
  }
  /**
   * scrollTrigger default event.
   * @event module:src/scrollTrigger#defaultEvent
   * @type {object}
   * @property {stElement[]} detail - An array of [stElements]{@link stElement}
   */

  /**
   * Method to run on document scroll if elements are found by _getTriggerLine. Dispatches custom event named by 'options.eventName'.
   * @fires module:src/scrollTrigger#defaultEvent
  */
  onScrollTrigger() {
    let changed = this.elements.filter(element => {
      const scrolled = window.scrollY + this.options.triggerLine,
        bottomTrigger = element.offset.top + element.el.offsetHeight,
        checks = {
          afterTop: element.offset.top <= scrolled,
          beforeBottom: scrolled <= bottomTrigger
        };
      // active | inactive
      if (checks.afterTop && checks.beforeBottom && element.active === false) {
        element.active = true;
        return true;
      } else if (element.active === true) {
        element.active = false;
        return true;
      }
    });

    if (this.options.event && changed.length > 0) {
      window.dispatchEvent(
        new CustomEvent(this.options.eventName, {
          detail: changed
        })
      );
    }
  }
  /**
   * scrollTrigger probe event.
   * @event module:src/scrollTrigger#probeEvent
   * @type {object}
   * @property {number} detail - Scrolled percent in decimals
   */
  /**
   * Method to run on document scroll if probe is set to true. Dispatches custom event named by 'options.eventName'.
   * @fires module:src/scrollTrigger#probeEvent
  */
  onScrollProbe() {
    let percentScrolled = window.scrollY / 
      (this.window.documentHeight - this.window.height);

    window.dispatchEvent(
      new CustomEvent(this.options.eventNameProbe, {
        detail: percentScrolled
      })
    );
  }
  /**
   * Method to run on document resize if elements are found by _getTriggerLine.
   * It recalculates the window size, trigger line position and each elements offset.
   */
  onScrollResize() {
    this.window = saKnife.winSize();
    this.options.triggerLine = this._getTriggerLine(this.options.position);
    this.elements.forEach(element => {
      element.offset = saKnife.offset(element.el);
    });
  }
}
export default scrollTrigger;
