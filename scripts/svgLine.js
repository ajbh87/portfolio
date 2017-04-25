"use strict";
class svgLine {
  constructor(options) {
    const _this = this,
        style = getComputedStyle(options.path);
    let timeout;

    _this.svgEvent = {
      active: 0
    }
    _this.triggerEvent = new CustomEvent('svgTrigger', {
      detail: _this.svgEvent
    });

    _this.el = Object.assign({
      length: parseFloat(style["stroke-dasharray"]),
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
    debugger;
    const _this = this,
          l = _this.el.length.val,
          offset = l * percent,
          newLength = l - offset;
    this.el.path.style.strokeDashoffset = newLength;

    this.el.triggers.lengths.forEach((length, index) => {
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
      _this.el.path.dispatchEvent(_this.triggerEvent);
    });
    return newLength;
  }
  getRatios(triggerPoints) {
    const _this = this,
          points = _this.el.path.points;
    let ratios = [],
        ys = [];
    triggerPoints.forEach((triggerPoint, index) => {
      let y = _this.el.path.points[triggerPoint].y,
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
          cHeight = _this.el.container.offsetHeight,
          triggerPoints = _this.el.triggers.points,
          triggerlengths = [],
          oldRatios = _this.el.ratios;
    let points = this.el.path.points,
        diffs = [],
        activeTrigger = 0,
        pointIndex = 0,
        triggerLengths = [];

    if (triggerPoints != null) {
      ratios.forEach((ratio, i) => {
        let y = points[triggerPoints[i]].y,
            ratioDiff = ratio / oldRatios[i],
            newY = 0;
        if (i > 0) {
          y = y - points[triggerPoints[i - 1]].y;
        }
        newY = round((y * ratioDiff) - y, 3);

        if (diffs.length > 0) {
          newY = round(newY + diffs[diffs.length - 1], 3);
        }
        diffs.push(newY);
      });

      _this.el.ratios = ratios;
      triggerPoints.forEach((triggerIndex, index) => {
        const trigger = points[triggerIndex];
        let lastTrigger = null,
            point = null,
            children = [],
            lengths = [],
            length = 0,
            triggerLength = 0;
        if (index > 0) {
          lastTrigger = triggerPoints[index - 1];
        }

        for (pointIndex = 1; pointIndex < points.length; pointIndex++) {
          point = points[pointIndex];
          length = calculateLength(points[pointIndex - 1], point);

          if (point.y <= trigger.y) {
            if (lastTrigger != null) {
              if (point.y > points[lastTrigger].y) {
                  point.y = changeY(point);
              }
            }
            else {
              point.y = changeY(point);
            }
          }
          
          if (pointIndex <= triggerIndex) {
            length = calculateLength(points[pointIndex - 1], point);
            lengths.push(length);
          }
        }
        lengths.forEach((length) => {
          triggerLength = round(triggerLength + length, 0);
        });

        triggerLengths.push({
          val: triggerLength,
          active: -1,
          inactive: -1
        });

        function changeY(point) {
          let newY = 0;
          if (index < (points.length - 1)) {
            newY = point.y + diffs[index];
          } else {
            newY = point.y;
          }
          return newY;
        }
        
      });
      _this.el.triggers.lengths = triggerLengths;
      console.log(triggerLengths);
      _this.el.length = triggerLengths[triggerLengths.length - 1];
    }

    function calculateLength(pointSet1, pointSet2) {
      const lX = pointSet2.x - pointSet1.x, 
            lY = pointSet2.y - pointSet1.y;
      return round(Math.sqrt((lX * lX) + (lY * lY)), 2);
    }
  }
};
function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
export default svgLine;