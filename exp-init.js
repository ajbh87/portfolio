import saKnife from './src/saKnife.js';
import Animation from './node_modules/web-animations-js/web-animations.min.js';
import Color from './src/color.js';
/**
 * Home page scripts.
 * @function
 * @requires src/saKnife
 * @requires src/color
 * @requires node_modules/web-animations-js
 */
const EXP_INIT = () => {
  'use strict';
  const barCharts = document.querySelectorAll('.skill__percent'),
    DURATION = 3500,
    DELAY = 333;
  let delayed = 0;

  barCharts.forEach((container) => {
    const barElement = container.querySelector('.skill__bar'),
      valueElement = container.querySelector('.skill__value'),
      style = window.getComputedStyle(barElement),
      attr = barElement.getAttribute('data-value'),
      initialColor = style.backgroundColor,
      initialColorArray = initialColor
        .match(/([0-9]+)+/g)
        .map(c => parseInt(c)),
      val =  parseInt(attr)/100,
      mixed = Color.mix('FF6958', initialColorArray, (val * 100)).toHex(),
      newScale =  `scaleX(${val})`,
      newPos = `${val * 100}%`,
      keyframes = [{
        backgroundColor: initialColor, 
        transform: 'scaleX(0)'
      }, { 
        backgroundColor: mixed, 
        transform: newScale
      }],
      keyframesValue = [{
        left: '0'
      }, { 
        left: newPos
      }], 
      timing = {
        duration: DURATION,
        easing: 'cubic-bezier(0.215,  0.610, 0.355, 1.000)'
      };

    barElement.style.transform = 'scaleX(0)';
    window.setTimeout(() => {
      const barAnimation = barElement.animate( keyframes, timing ),
        valueAnimation = valueElement.animate( keyframesValue, timing );

      barAnimation.onfinish = () => {
        barElement.style.transform = newScale;
        barElement.style.backgroundColor = mixed;
      };
      valueAnimation.onfinish = () => valueElement.style.left = newPos;
    }, delayed);
    delayed += DELAY;
  });
};
window.addEventListener('load', EXP_INIT);