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
const saKnife = {
    transitionEvent: whichTransitionEvent(),
    offset: (el) => {
        const rect = el.getBoundingClientRect(),
            body = document.body.getBoundingClientRect();

        return {
            top: Math.abs(body.top) + rect.top,
            left: Math.abs(body.left) + rect.left
        };
    },
    winSize: () => {
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
    },
    hasClass: (el, className) => {
        let response = false;
    
        if (el.classList)
            response = el.classList.contains(className);
        else
            response = new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    
        return response;
    },
    round: (value, decimals) => Number(Math.round(value+'e'+decimals)+'e-'+decimals)
};
export default saKnife;