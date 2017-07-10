/** @module src/saKnife */

/** 
* Exports saKnife methods.
* @type {Object}
* @property {function} forEach - {@link module:src/saKnife~forEach forEach}
* @property {function} hasClass - {@link module:src/saKnife~hasClass hasClass}
* @property {function} offset - {@link module:src/saKnife~offset offset}
* @property {function} round - {@link module:src/saKnife~round round}
* @property {string} transitionEvent - {@link module:src/saKnife~whichTransitionEvent whichTransitionEvent}
* @property {function} winSize - {@link module:src/saKnife~winSize winSize}
*/
const saKnife = {
    forEach,
    hasClass,
    offset,
    round,
    transitionEvent: whichTransitionEvent(),
    winSize
};

if (NodeList.forEach == null) {
    NodeList.prototype.forEach = function(fn) {
        forEach(this, fn);
    };
}
if (HTMLElement.hasClass == null) {
    HTMLElement.prototype.hasClass = function(className) {
        return hasClass(this, className);
    };
}
if (HTMLElement.getOffset == null) {
    HTMLElement.prototype.getOffset = function() {
        return offset(this);
    };
}
export default saKnife;

/**
* Check the name of CSS transitionEnd Event
* From Modernizr via 'https://davidwalsh.name/css-animation-callback'
* @return {string} CSS transitionEnd Event name
*/
function whichTransitionEvent(){
    const el = document.createElement('fakeelement'),
        transitions = {
            transition: 'transitionend',
            OTransition: 'oTransitionEnd',
            MozTransition: 'transitionend',
            WebkitTransition: 'webkitTransitionEnd'
        };
    let t;

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}
/**
* Iterate through NodeList
* @param {NodeList} elements - a NodeList of Elements.
* @param {function} fn - function to run for each element.
* @example
* const elements = document.querySelectorAll('.some-class');
* saKnife.forEach(elements, function(el, index) {
*     doSometing(el);
* });
*/
function forEach(elements, fn) {
    const total = elements.length;
    let index = 0;
    for (index = 0; index < total; index++) {
        fn(elements[index], index);
    }
}
/**
* Check if 'element' has specified 'class'
* @param {NodeElement} el - DOM Element
* @param {string} className - CSS class name
* @return {bool} true/false if 'el' has class 'className'
* @example
* const element = document.querySelector('.some-class');
* saKnife.hasClass(element, 'some-class');
* // returns true
*/
function hasClass(el, className) {
    if (el.classList)
        return el.classList.contains(className);
    else
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
}

/**
* @typedef {object} offsetObject
* @property {number} top 
* @property {number} left
*/

/**
* Check 'element' position relative to 'body'
* @param {NodeElement} el - DOM Element
* @return {offsetObject}
*       {@link module:src/saKnife~offsetObject offsetObject} - Element offest information
*/
function offset(el) {
    const rect = el.getBoundingClientRect(),
        body = document.body.getBoundingClientRect();

    return {
        top: Math.abs(body.top) + rect.top,
        left: Math.abs(body.left) + rect.left
    };
}

/**
* @typedef {object} winSizeObject
* @property {number} width 
* @property {number} height
* @property {number} vCenter
* @property {number} hCenter
* @property {number} documentHeight
* @property {number} documentWidth
*/

/**
* Check 'window' size
* @example
* saKnife.winSize();
* // returns {width: 1920, height: 1080, ...}
* @return {winSizeObject}
*      {@link module:src/saKnife~winSizeObject winSizeObject} - Windows size information
*/
function winSize() {
    const e = document.documentElement,
        g = document.querySelector('body'),
        width = window.innerWidth||e.clientWidth||g.clientWidth,
        height = window.innerHeight||e.clientHeight||g.clientHeight;
    return {
        width,
        height,
        vCenter: height / 2,
        hCenter: width / 2,
        documentHeight: g.offsetHeight,
        documentWidth: g.offsetWidth
    };
}
/**
* Round a number to specified decimals
* @param {number} value
* @param {number} decimals
* @return {number}
*/
function round(value, decimals) {
    return Number( Math.round(value + 'e' + decimals) + 'e-' + decimals );
}
