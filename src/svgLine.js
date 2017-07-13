/** */
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
        
        this.el.triggers.info = [];

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
                reCheck();
            },
            reCheck = () => {
                var changed = [];
                this.el.triggers.info.forEach((length, index) => {
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
        triggerPoints.forEach((triggerPoint) => {
            let y = points.getItem(triggerPoint).y,
                newRatio = 0;
            ys.push(y);

            newRatio = (y / this.el.height) * 100;
            ratios.push(newRatio);
        });
        return ratios;
    }
    setRatios(ratios) {
        const triggerPoints = this.el.triggers.points,
            oldRatios = this.el.ratios;
        let points = this.el.path.points,
            diffs = [],
            triggerInfo = this.el.triggers.info;
            
        if (triggerPoints != null) {
            ratios.forEach((ratio, i) => {
                let triggerIndex = triggerPoints[i],
                    y = points.getItem(triggerIndex).y,
                    ratioDiff = ratio / oldRatios[i],
                    newY = 0;

                newY = y * ratioDiff;

                changeTriggerPoint(triggerIndex, i, newY);
                diffs.push(newY);
            });

            this.el.ratios = ratios;
            this.el.length = triggerInfo[triggerInfo.length - 1].val;
        }
        function changeTriggerPoint(triggerIndex, index, diff) {
            const trigger = points.getItem(triggerIndex);
            let prevTriggerIndex = index > 0 ? triggerPoints[index - 1] : 0,
                prevPoint = ((triggerIndex - 1) >= 0) ? points.getItem(triggerIndex - 1) : null,
                nextPoint = ((triggerIndex + 1) < points.numberOfItems - 1) ? points.getItem(triggerIndex + 1) : null,
                info = triggerInfo[index] != null ? triggerInfo[index] : {};

            if (info.prevOffset == null && prevPoint != null) {
                if (prevTriggerIndex !== triggerIndex - 1)
                    info.prevOffset = getOffset(prevPoint, trigger);
                else 
                    prevPoint = null;
            }
            if (info.nextOffset == null && nextPoint != null) {
                info.nextOffset = getOffset(nextPoint, trigger);
                if (info.nextOffset > Math.abs(info.prevOffset)) 
                    nextPoint = null;
            }

            if (triggerIndex < (points.numberOfItems - 1))
                trigger.y = diff;

            if (prevPoint != null)
                prevPoint.y = trigger.y + info.prevOffset;
            if (nextPoint != null)
                nextPoint.y = trigger.y + info.nextOffset;

            triggerInfo[index] = Object.assign({
                active: false,
                inactive: true
            }, info);
            triggerInfo[index].val = calculateSectionLength();

            function getOffset(point1, point2) {
                return point1.y - point2.y;
            }
            function calculateSectionLength() {
                let pointIndex = prevTriggerIndex + 1,
                    length = 0;

                for (pointIndex; pointIndex <= triggerIndex; pointIndex++) {                
                    length += svgLine.distance(points.getItem(pointIndex - 1), points.getItem(pointIndex));
                }
                if (index > 0)
                    length += triggerInfo[index - 1].val;

                return length;
            }
        }
    }
    static distance(pointSet1, pointSet2) {
        const dx = pointSet2.x - pointSet1.x, 
            dy = pointSet2.y - pointSet1.y;
        return Math.hypot(dx, dy);
    }
}
export default svgLine;