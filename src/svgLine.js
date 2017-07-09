import saKnife from './saKnife.js';
class svgLine {
    constructor(options) {
        const style = getComputedStyle(options.path);
        
        this.el = Object.assign({
            length: parseFloat(style['stroke-dasharray']),
            height: options.path.viewportElement.viewBox.baseVal.height,
            ratios: [],
            triggers: {},
            triggerPad: 0
        }, options);
        
        this.el.triggers.lengths = [];

        if (this.el.triggers.points != null) {
            this.el.ratios = this.getRatios(this.el.triggers.points);
        }
    }

    pathLength(percent){
        const l = this.el.length,
            offset = l * percent,
            newLength = l - offset,
            changePath = () => {
                requestAnimationFrame(() => {
                    this.el.path.style.strokeDashoffset = newLength;
                });
                recalculate();
            },
            recalculate = () => {
                var changed = [];
                this.el.triggers.lengths.forEach((length, index) => {
                    if (offset >= (length.val - this.el.triggerPad)) {
                        if (length.active !== true) {
                            length.active = true;
                            changed.push({
                                index: index,
                                active: true
                            });
                        }
                    } else {
                        if (length.active !== false) {
                            length.active = false;
                            changed.push({
                                index: index,
                                active: false
                            });
                        }
                    }
                });
                if (changed.length > 0) {
                    this.el.path.dispatchEvent(new CustomEvent('svgTrigger', {
                        detail: changed
                    }));
                }
            };

        changePath();
        return newLength;
    }
    getRatios(triggerPoints) {
        const points = this.el.path.points;
        let ratios = [],
            ys = [];
        triggerPoints.forEach((triggerPoint, index) => {
            let y = points.getItem(triggerPoint).y,
                newRatio = 0;
            ys.push(y);

            if (index === 0) {
                newRatio = y / this.el.height;
            } else {
                newRatio = (y - ys[index - 1]) / this.el.height;
            }
            ratios.push(newRatio);
        });
        return ratios;
    }
    setRatios(ratios) {
        const triggerPoints = this.el.triggers.points,
            oldRatios = this.el.ratios;
        let points = this.el.path.points,
            diffs = [],
            pointIndex = 0,
            triggerLengths = this.el.triggers.lengths;

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

            this.el.ratios = ratios;
            triggerPoints.forEach((triggerIndex, index) => {
                const trigger = points.getItem(triggerIndex);
                let lastTrigger = null,
                    point = null,
                    lengths = [],
                    length = 0,
                    triggerLength = 0,
                    obj = triggerLengths[index] != null ? triggerLengths[index] : {};
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

                triggerLengths[index] = Object.assign({
                    active: false,
                    inactive: true
                }, obj);
                triggerLengths[index].val = triggerLength;
                
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
            //this.el.triggers.lengths = triggerLengths;
            this.el.length = triggerLengths[triggerLengths.length - 1].val;
        }

        function calculateLength(pointSet1, pointSet2) {
            const lX = pointSet2.x - pointSet1.x, 
                lY = pointSet2.y - pointSet1.y;
            return saKnife.round(Math.sqrt((lX * lX) + (lY * lY)), 2);
        }
    }
}
export default svgLine;