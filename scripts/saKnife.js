const saKnife = {
    forEach,
    hasClass,
    offset,
    round,
    transitionEvent: whichTransitionEvent(),
    winSize
};

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
function forEach(elements, fn) {
    const total = elements.length;
    let index = 0;
    for (index = 0; index < total; index++) {
        fn(elements[index], index);
    }
}
function hasClass(el, className) {
    if (el.classList)
        return el.classList.contains(className);
    else
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
}
function offset(el) {
    const rect = el.getBoundingClientRect(),
        body = document.body.getBoundingClientRect();

    return {
        top: Math.abs(body.top) + rect.top,
        left: Math.abs(body.left) + rect.left
    };
}
function winSize() {
    const e = document.documentElement,
        g = document.querySelector('body'),
        width = e.clientWidth||g.clientWidth,
        height = e.clientHeight||g.clientHeight;
    return {
        width,
        height,
        vCenter: height / 2,
        hCenter: width / 2,
        documentHeight: g.offsetHeight,
        documentWidth: g.offsetWidth
    };
}
function round(value, decimals) {
    return Number( Math.round(value + 'e' + decimals) + 'e-' + decimals );
}
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