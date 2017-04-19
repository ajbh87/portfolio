import scrollTrigger from './scrollTrigger';

(function () {  
  window.onload = function () {
    var triggers = new scrollTrigger({});
    
    var line = document.querySelector('#bg-line__line');
    line.style.strokeDashoffset = 75;
  }
})();