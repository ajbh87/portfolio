/**
 * Triggers info
 * @typedef {object} triggerInfo
 * @property {number} point - Trigger index for SVGElement.points
 * @property {number} sectionLength - Length from start of path to this trigger point
 * @property {number} prevOffset - Vertical distance between previous point and this
 * @property {number} nextOffset - Vertical distance between this point ant the next
 */

/**
 * svgLine options object
 * @typedef {object} svglOptions
 * @property {SVGElement} svg - SVG | Required
 * @property {SVGPolylineElement | SVGPolygonElement} path - Path to draw | Required
 * @property {triggerInfo[]} triggers - [triggerInfo]{@link triggerInfo} Array | Required
 * @property {number} triggerPad - optional padding for the trigger points.
 */

/** 
 * A plugin-less way to manipulate SVGPolylineElement or SVGPolygonElement.
 * @param {svglOptions} options - [svglOptions]{@link svglOptions}
 */
class svgLine {
  /** 
   * @param {svglOptions} options 
   */
  constructor(options) {
    const style = getComputedStyle(options.path);

    /** 
     * svgLine Options [svglOptions]{@link svglOptions}
     * @type {svglOptions}
     */
    this.options = Object.assign(
      {
        triggers: [],
        triggerPad: 0
      },
      options
    );
    /**
     * SVG viewbox height
     * @type {number} 
     */
    this.height = options.path.viewportElement.viewBox.baseVal.height;
    /** 
     * Path length
     * @type {number}
     */
    this.length = parseFloat(style['stroke-dasharray']);
    /**
     * Segments ratio
     * @type {number[]}
     */
    this.ratios = [];
    /**
     * Last active trigger point
     * @type {number}
     */
    this.active = 0;

    if (this.options.triggers.length > 0) {
      this.ratios = this.getRatios();
    }
  }
  /**
   * Draws the path by changing the strokeDashoffset of it. 
   * @param {number} percent - decimal from 0 t0 1
   * @returns {number} - New strokeDashoffset length.
   */
  drawPath(percent) {
    const l = this.length,
      offset = l * percent,
      newLength = l - offset,
      changePath = () => {
        requestAnimationFrame(() => {
          this.options.path.style.strokeDashoffset = newLength;
        });
      };
    this.offset = offset;
    changePath();

    return newLength;
  }
  /**
   * Method use to calculate the last active trigger point. 
   * An active trigger point is point by which the line has already passed. 
   * @returns {number} - active index
   */
  reCheck() {
    const triggerArray = this.options.triggers;
    /**
     * Recursive function that checks if svgLine.length is bigger than the  following trigger points length.
     * @param {number} index - index to check
     * @returns {number} - new active index 
     */
    const checkForward = index => {
      let nextTrigger = triggerArray[index];
      if (index === triggerArray.length) {
        return index;
      }
      if (this.offset === this.length) {
        return triggerArray.length;
      }
      if (
        this.offset >=
        nextTrigger.sectionLength - this.options.triggerPad
      ) {
        if (index < triggerArray.length - 1) {
          return checkForward(index + 1);
        } else {
          return index;
        }
      } else {
        return index;
      }
    };
    /**
     * Recursive function that checks if svgLine.length is smaller than the  previous trigger points length.
     * @param {number} index - index to check
     * @returns {number} - new active index 
     */
    const checkPrev = index => {
      let prevTrigger,
        prevIndex = index - 1;
      if (index > 0) {
        prevTrigger = triggerArray[prevIndex];
        if (
          this.offset <
          prevTrigger.sectionLength - this.options.triggerPad
        ) {
          if (prevIndex > 0) return checkPrev(index - 1);
          else return prevIndex;
        } else {
          return index;
        }
      } else {
        return index;
      }
    };

    let next = checkForward(this.active);

    if (next !== this.active) {
      return next;
    } else {
      return checkPrev(this.active);
    }
  }
  /**
   * Gets ratio of trigger points position relative to viewport height.
   * @returns {number[]} 
   */
  getRatios() {
    const triggerPoints = this.options.triggers;
    const points = this.options.path.points;
    return triggerPoints.map(triggerPoint => {
      let y = points.getItem(triggerPoint.point).y;
      return y / this.height * 100;
    });
  }
  /**
   * Redraws paths based on ratios provided. 
   * @param {number[]} ratios
   */
  setRatios(ratios) {
    if (this.ratios === null) return;

    const triggerPoints = this.options.triggers,
      oldRatios = this.ratios,
      points = this.options.path.points;
    /**
     * Changes Trigger Point position, also previous and next point positions.
     * @param {triggerInfo} triggerInfo - Trigger point index for SVGPointList "points"
     * @param {number} index - Trigger point index
     * @param {number} diff - Difference between Ratios
     */
    const changeTriggerPoint = (triggerInfo, index, diff) => {
      const triggerIndex = triggerInfo.point;
      const trigger = points.getItem(triggerIndex);
      let prevTriggerIndex = (index > 0) ? triggerPoints[index - 1].point : 0,
        prevPoint =
          (triggerIndex - 1 >= 0) ? points.getItem(triggerIndex - 1) : null,
        nextPoint =
          (triggerIndex + 1 < points.numberOfItems - 1)
            ? points.getItem(triggerIndex + 1)
            : null,
        secLength = 0;

      if (triggerInfo.prevOffset == null && prevPoint != null) {
        if (prevTriggerIndex !== triggerIndex - 1)
          triggerInfo.prevOffset = svgLine.distanceV(prevPoint, trigger);
        else prevPoint = null;
      }
      if (triggerInfo.nextOffset == null && nextPoint != null) {
        triggerInfo.nextOffset = svgLine.distanceV(nextPoint, trigger);
        if (triggerInfo.nextOffset > Math.abs(triggerInfo.prevOffset))
          nextPoint = null;
      }

      if (triggerIndex < points.numberOfItems - 1) trigger.y = diff;

      if (prevPoint != null) prevPoint.y = trigger.y + triggerInfo.prevOffset;
      if (nextPoint != null) nextPoint.y = trigger.y + triggerInfo.nextOffset;

      secLength = svgLine.calculateSectionLength(
        this.options.path,
        prevTriggerIndex,
        triggerIndex
      );
      triggerInfo.sectionLength =
        (index > 0)
          ? triggerPoints[index - 1].sectionLength + secLength
          : secLength;
    };

    ratios.forEach((ratio, i) => {
      let triggerInfo = triggerPoints[i],
        y = points.getItem(triggerInfo.point).y,
        ratioDiff = ratio / oldRatios[i],
        newY = y * ratioDiff;

      changeTriggerPoint(triggerInfo, i, newY);
    });

    this.ratios = ratios;

    // the sectionLength of the last trigger point equals the total polyline length
    this.length = triggerPoints[triggerPoints.length - 1].sectionLength;
    
  }
  /**
   * Calculates length starting from start point up to end point.
   * sectionLength is the sum of all the segment lengths inside the section.
   * @param {SVGPolylineElement | SVGPolygonElement} path
   * @param {number} start - Starting point index
   * @param {number} end - End point index
   * @returns {number} - Section length
   */
  static calculateSectionLength(path, start, end) {
    let pointIndex = start + 1,
      length = 0;

    for (pointIndex; pointIndex <= end; pointIndex++) {
      length += svgLine.distance(
        path.points.getItem(pointIndex - 1),
        path.points.getItem(pointIndex)
      );
    }
    return length;
  }
  /**
   * Calculates total length.
   * @param {SVGPolylineElement | SVGPolygonElement} path
   * @returns {number}
   */
  static getTotalLength(path) {
    return svgLine.calculateSectionLength(path, 0, path.points.length - 1);
  }
  /**
   * Calculate vertical difference between points
   * @param {SVGPoint} point1 
   * @param {SVGPoint} point2 
   */
  static distanceV(point1, point2) {
    return point1.y - point2.y;
  }
  /**
   * Calculate horizontal difference between points
   * @param {SVGPoint} point1 
   * @param {SVGPoint} point2 
   */
  static distanceH(point1, point2) {
    return point1.x - point2.x;
  }
  /**
   * Calculate length from point1 to point2
   * @param {SVGPoint} point1 
   * @param {SVGPoint} point2 
   */
  static distance(point1, point2) {
    const dx = point2.x - point1.x,
      dy = point2.y - point1.y;

    return Math.hypot(dx, dy);
  }
}
export default svgLine;