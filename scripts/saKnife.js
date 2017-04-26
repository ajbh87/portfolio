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
  hasClass: function (el, className) {
    let response = false;
    
    if (el.classList)
      response = el.classList.contains(className);
    else
      response = new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    
    return response;
  },
  round: function (value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  }
}
export default saKnife;