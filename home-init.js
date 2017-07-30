require('./main.scss');
import scrollTrigger from './src/scrollTrigger.js';
import svgLine from './src/svgLine.js';
import saKnife from './src/saKnife.js';
import debounce from './node_modules/lodash.debounce/index.js';
import pull from './node_modules/lodash.pull/index.js';

/**
 * Home page scripts.
 * @function
 * @requires src/saKnife
 * @requires src/scrollTrigger
 * @requires src/svgLine
 * @requires node_modules/lodash.debounce
 * @requires node_modules/lodash.before
 */
const homeInit = () => {
  'use strict';
  const BODY = document.querySelector('body'),
    CONTAINER = document.querySelector('.home'),
    SECTIONS = document.querySelectorAll('.section'),
    ST = new scrollTrigger({ probe: true }),
    LINE = new svgLine({
      svg: CONTAINER.querySelector('.bg-line__svg'),
      path: CONTAINER.querySelector('.bg-line__path'),
      triggers: [
        { point: 1 },
        { point: 4 },
        { point: 7 },
        { point: 10 },
        { point: 11 }
      ]
    }),
    // needs same # of trigger points
    MARKERS = CONTAINER.querySelectorAll('.bg-line__point');
  let sectionRatios = getSectionRatios(),
    active = 0,
    activeMarkers = [],
    inactiveMarkers = [0, 1, 2, 3, 4, 5];

  LINE.setRatios(sectionRatios.topArr);

  window.addEventListener('resize', debounce(onResize, 250));

  window.addEventListener('scrollProbe', changeLine);
  window.addEventListener('scrollProbe', debounce(reCheckLine, 50));

  ST.onScrollProbe();
  if (active === 0) sectionActive(active);

  function onResize() {
    sectionRatios = getSectionRatios();

    LINE.setRatios(sectionRatios.topArr);
    ST.onScrollProbe();
  }
  function getSectionRatios() {
    let cHeight = CONTAINER.offsetHeight,
      ratios = [], // Ratio array
      topArr = []; // Top Percent array

    SECTIONS.forEach((element, index) => {
      let marker = MARKERS[index],
        ratio = element.offsetHeight / cHeight, // Section Height / Container Height
        // To calculate the Top Percent we need to know if it's not the first section.
        lastTop = index === 0 ? 0 : topArr[topArr.length - 1],
        top = ratio * 100 + lastTop;

      marker.style.top = top + '%';
      topArr.push(top);
      ratios.push(saKnife.round(ratio, 6));
    });

    return { cHeight, ratios, topArr };
  }
  function changeLine(event) {
    LINE.drawPath(event.detail);
  }
  function reCheckLine() {
    let newActive = LINE.reCheck();

    if (active !== newActive) {
      toggleActive(active, newActive);

      addMarkers(newActive);
      removeMarkers(newActive);

      active = newActive;
    }
    function addMarkers(active) {
      let toChange = inactiveMarkers.filter(m => m <= active);
      pull(inactiveMarkers, ...toChange);
      activeMarkers = activeMarkers.concat(toChange);
      toChange.forEach(i => {
        if (i > 0) MARKERS[i - 1].classList.add('bg-line__point--active');
      });
    }
    function removeMarkers(active) {
      let toChange = activeMarkers.filter(m => m > active);
      pull(activeMarkers, ...toChange);
      inactiveMarkers = inactiveMarkers.concat(toChange);
      toChange.forEach(i => {
        if (i > 0) MARKERS[i - 1].classList.remove('bg-line__point--active');
      });
    }
  }
  function toggleActive(inactive, active) {
    requestAnimationFrame(() => {
      if (inactive < SECTIONS.length) sectionInactive(inactive);
      if (active < SECTIONS.length) sectionActive(active);
    });
  }
  function sectionActive(index) {
    SECTIONS[index].classList.add('focused');
    BODY.classList.add(`section-${index}`);
  }
  function sectionInactive(index) {
    SECTIONS[index].classList.remove('focused');
    BODY.classList.remove(`section-${index}`);
  }
};

window.addEventListener('load', homeInit);
