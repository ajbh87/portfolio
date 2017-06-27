import saKnife from './saKnife.js';
class svgLine {
    constructor(options) {
        const _this = this,
            style = getComputedStyle(options.path);
        _this.svgEvent = {
            active: 0
        };
        _this.triggerEvent = new CustomEvent('svgTrigger', {
            detail: _this.svgEvent
        });
        _this.el = Object.assign({
            length: parseFloat(style['stroke-dasharray']),
            height: options.path.viewportElement.viewBox.baseVal.height,
            ratios: [],
            triggers: {},
            triggerPad: 0
        }, options);
        
        _this.el.triggers.lengths = [];

        if (_this.el.triggers.points != null) {
            _this.el.ratios = _this.getRatios(_this.el.triggers.points);
        }
    }

    pathLength(percent){
        const _this = this,
            l = _this.el.length,
            offset = l * percent,
            newLength = l - offset;

            _this.el.path.style.strokeDashoffset = newLength;
            _this.el.triggers.lengths.forEach((length, index) => {
                if (offset >= (length.val - _this.el.triggerPad)) {
                    if (length.active !== true) {
                        _this.svgEvent.active = index + 1;
                        length.active = true;
                        delete _this.svgEvent.inactive;
                    }
                } else {
                    if (length.active !== false) {
                        _this.svgEvent.inactive = index + 1;
                        length.active = false;
                        delete _this.svgEvent.active;
                    }
                }
            });
            _this.el.path.dispatchEvent(_this.triggerEvent);
        
        return newLength;
    }
    getRatios(triggerPoints) {
        const _this = this,
            points = _this.el.path.points;
        let ratios = [],
            ys = [];
        triggerPoints.forEach((triggerPoint, index) => {
            let y = points.getItem(triggerPoint).y,
                newRatio = 0;
            ys.push(y);

            if (index === 0) {
                newRatio = y / _this.el.height;
            } else {
                newRatio = (y - ys[index - 1]) / _this.el.height;
            }
            ratios.push(newRatio);
        });
        return ratios;
    }
    setRatios(ratios) {
        const _this = this,
            triggerPoints = _this.el.triggers.points,
            oldRatios = _this.el.ratios;
        let points = _this.el.path.points,
            diffs = [],
            pointIndex = 0,
            triggerLengths = [];

        if (triggerPoints != null) {
            ratios.forEach((ratio, i) => {
                let y = points.getItem(triggerPoints[i]).y,
                    ratioDiff = ratio / oldRatios[i],
                    newY = 0;
                if (i > 0) {
                    y = y - points.getItem(triggerPoints[i - 1]).y;
                }
                newY = saKnife.round((y * ratioDiff) - y, 4);

                if (diffs.length > 0) {
                    newY = saKnife.round(newY + diffs[diffs.length - 1], 4);
                }
                diffs.push(newY);
            });

            _this.el.ratios = ratios;
            triggerPoints.forEach((triggerIndex, index) => {
                const trigger = points.getItem(triggerIndex);
                let lastTrigger = null,
                    point = null,
                    lengths = [],
                    length = 0,
                    triggerLength = 0;
                if (index > 0) {
                    lastTrigger = triggerPoints[index - 1];
                }

                for (pointIndex = 1; pointIndex < points.numberOfItems; pointIndex++) {
                    point = points.getItem(pointIndex);
                    
                    length = calculateLength(points.getItem(pointIndex - 1), point);

                    if (point.y <= trigger.y) {
                        if (lastTrigger != null) {
                            if (point.y > points.getItem(lastTrigger).y) {
                                point.y = changeY(point);
                            }
                        }
                        else {
                            point.y = changeY(point);
                        }
                    }
                    
                    if (pointIndex <= triggerIndex) {
                        length = calculateLength(points.getItem(pointIndex - 1), point);
                        lengths.push(length);
                    }
                }
                lengths.forEach((length) => {
                    triggerLength = saKnife.round(triggerLength + length, 4);
                });

                triggerLengths.push({
                    val: triggerLength,
                    active: -1,
                    inactive: -1
                });

                function changeY(point) {
                    let newY = 0;
                    if (index < (points.numberOfItems - 1)) {
                        newY = point.y + diffs[index];
                    } else {
                        newY = point.y;
                    }
                    return newY;
                }
        
            });
            _this.el.triggers.lengths = triggerLengths;
            _this.el.length = triggerLengths[triggerLengths.length - 1].val;
        }

        function calculateLength(pointSet1, pointSet2) {
            const lX = pointSet2.x - pointSet1.x, 
                lY = pointSet2.y - pointSet1.y;
            return saKnife.round(Math.sqrt((lX * lX) + (lY * lY)), 2);
        }
    }
}
export default svgLine;