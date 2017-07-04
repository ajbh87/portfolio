import scrollTrigger from './scripts/scrollTrigger.js';
import svgLine from './scripts/svgLine.js';
import saKnife from './scripts/saKnife.js';
import debounce from './node_modules/lodash.debounce/index.js';
import before from './node_modules/lodash.before/index.js';

//import Rx from './node_modules/rxjs/Rx';
import { Observable } from './node_modules/rxjs/Observable';
import './node_modules/rxjs/add/observable/fromEvent';



window.addEventListener('load', onLoad);  

function onLoad() {
    'use strict';
    const BODY = document.querySelector('body'),
        CONTAINER = document.querySelector('.bg-line'),
        SECTIONS = document.querySelectorAll('.section'),
        ST = new scrollTrigger({
            dataName: 'data-trigger-sections',
            event: true,
            positionFn: 'center',
            probeFn: bindScrollToLine,
            offset: 0
        }),
        LINE = new svgLine({
            svg: CONTAINER.querySelector('.bg-line__svg'),
            path: CONTAINER.querySelector('.bg-line__path'),
            pathSelector: '.bg-line__path',
            triggers: {
                points: [2, 4, 8, 10, 11]
            }
        }),
        MARKERS = CONTAINER.querySelectorAll('.bg-line__point'); // needs same # of trigger points

    let sectionRation = getSectionRatios(),
        addPrevious = before(2, function (active) {
            let index = 1;
            if (active > 1) {
                for (index = 1; index < active; index ++) {
                    MARKERS[index - 1].classList.add('bg-line__point--active');
                }
            }
        }),
        observeLine = Observable.fromEvent(LINE.el.path, 'svgTrigger'),
        observeScroll = Observable.fromEvent(window, 'scrollTrigger');

    observeLine.subscribe((event) => {
        dispatcher(() => {
            event.detail.forEach((eventMark) => {
                let marker = MARKERS[eventMark.index];
                if (eventMark.active === true) {
                    addPrevious(eventMark.index);
                    marker.classList.add('bg-line__point--active');
                } 
                else {
                    marker.classList.remove('bg-line__point--active');
                }
            });
        });
    });
    observeScroll.subscribe((event) => {
        dispatcher(() => {
            event.detail.forEach((trigger) => {
                if (trigger.active === true) {
                    sectionActive(trigger);
                } else {
                    sectionInactive(trigger);
                }
            });
        });
    });

    LINE.setRatios(sectionRation.ratios);

    ST.onScrollTrigger();
    ST.onScrollProbe();

    window.addEventListener('resize', debounce(onResize, 250));

    function onResize() {
        sectionRation = getSectionRatios();
        LINE.setRatios(sectionRation.ratios);
    }
    function getSectionRatios() {
        let cHeight = CONTAINER.offsetHeight,
            posArr = [], // top position array
            ratios = [], // ratio calculation array
            topArr = []; // top calculation array

        SECTIONS.forEach((element, index) => {
            let marker = MARKERS[index],
                ratio = element.offsetHeight / cHeight,
                lastTop = (index === 0) ? 0 : topArr[topArr.length - 1],
                top = (ratio * 100) + lastTop; // top calculation
            
            marker.style.top = top + '%';
            posArr.push(element.getBoundingClientRect());
            topArr.push(top);
            ratios.push(saKnife.round(ratio, 6));
        });
        return { cHeight, posArr, ratios, topArr };
    }
    function bindScrollToLine(percent) {      
        LINE.pathLength(percent);
    }
    function dispatcher(fn) {
        requestAnimationFrame(() => {
            requestAnimationFrame(fn);
        });
    }
    function sectionActive(obj) {
        obj.el.classList.add('focused');
        BODY.classList.add(`section-${obj.index}`);    
    }
    function sectionInactive(obj) {
        obj.el.classList.remove('focused');
        BODY.classList.remove(`section-${obj.index}`);
    }
}
