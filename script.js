import scrollTrigger from './scripts/scrollTrigger.js';
import svgLine from './scripts/svgLine.js';
import saKnife from './scripts/saKnife.js';
import debounce from './node_modules/lodash.debounce/index.js';

window.addEventListener('load', onLoad);  

function onLoad() {
    'use strict';
    const container = document.querySelector('.bg-line'),
        line = new svgLine({
            svg: container.querySelector('.bg-line__svg'),
            path: container.querySelector('.bg-line__path'),
            pathSelector: '.bg-line__path',
            triggers: {
                points: [2, 4, 8, 10, 11]
            }
        }),
        triggers = new scrollTrigger({
            active: sectionAct,
            probe: bindScrollToLine
        });
    let markers = container.querySelectorAll('.bg-line__point'), // need 5
        galleryButtons = document.querySelectorAll('[data-open-close]'),
        sectionsSizes = getSectionRatios();

    line.setRatios(sectionsSizes.ratios);
    line.el.path.addEventListener('svgTrigger', (event) => {
        let point = null;
        if (event.detail.active != null) {
            point = container.querySelector('.bg-line__point--' + event.detail.active);
            point.classList.add('bg-line__point--active');
        } 
        else if (event.detail.inactive != null) {
            point = container.querySelector('.bg-line__point--' + event.detail.inactive);
            point.classList.remove('bg-line__point--active');
        }
    });

    saKnife.forEach(galleryButtons, (button) => {
        button.addEventListener('click', function() {
            const targetSelector = this.attributes['data-open-close'].value,
                target = document.querySelector(targetSelector);
            if (target.hasClass('open')) {
                target.classList.remove('open');
                target.classList.add('close');
            } else {
                target.classList.remove('close');
                target.classList.add('open');
            }
        });
    });

    window.addEventListener('resize', debounce(onResize, 250));
  
    function onResize() {
        sectionsSizes = getSectionRatios();
        line.setRatios(sectionsSizes.ratios);
    }

    function getSectionRatios() {
        let cHeight = container.offsetHeight,
            posArr = [], // top position array
            ratios = [], // ratio calculation array
            topArr = []; // top calculation array

        triggers.elements.forEach((element, index) => {
            let marker = markers[index],
                ratio = element.el.offsetHeight / cHeight,
                lastTop = (index === 0) ? 0 : topArr[topArr.length - 1],
                top = (ratio * 100) + lastTop; // top calculation
            
            marker.style.top = top + '%';
            posArr.push(element.el.getBoundingClientRect());
            topArr.push(top);
            ratios.push(saKnife.round(ratio, 6));
        });

        return { cHeight, posArr, ratios, topArr };
    }

    function bindScrollToLine(percent) {      
        line.pathLength(percent);
    }

    function sectionAct(el) {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                el.classList.add('focused');
            });
        });
    }
}
