/**
 *
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

class AnimatedClip {
  constructor (ac, classSel) {
    this._aC = ac;
    this._aCContents = this._aC.querySelector('.' + classSel + '-contents');
    this._aCToggleButton = this._aC.querySelector('.' + classSel + '-toggle');
    this._aCTitle = this._aC.querySelector('.' + classSel + '-title');
    this._classSel = classSel;
    this._expanded = true;
    this._animate = false;
    this._collapsed;

    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
    this.toggle = this.toggle.bind(this);

    this._calculateScales();
    this._createEaseAnimations();
    this._addEventListeners();

    this.collapse();
    this.activate();
  }

  activate () {
    this._aC.classList.add(this._classSel  + '--active');
    this._animate = true;
  }

  collapse () {
    if (!this._expanded) {
      return;
    }
    this._expanded = false;

    const {x, y} = this._collapsed;
    const invX = 1 / x;
    const invY = 1 / y;

    this._aC.style.transform = `scale(${x}, ${y})`;
    this._aCContents.style.transform = `scale(${invX}, ${invY})`;
    
    if (!this._animate) {
      return;
    }

    this._applyAnimation({expand: false});
  }

  expand () {
    if (this._expanded) {
      return;
    }
    this._expanded = true;

    this._aC.style.transform = `scale(1, 1)`;
    this._aCContents.style.transform = `scale(1, 1)`;
      
    if (!this._animate) {
      return;
    }

    this._applyAnimation({expand: true});
  }

  toggle () {
    if (this._expanded) {
      this.collapse();
      return;
    }

    this.expand();
  }

  _addEventListeners () {
    this._aCToggleButton.addEventListener('click', this.toggle);
  }

  _applyAnimation ({expand}=opts) {
    this._aC.classList.remove(this._classSel  + '--expanded');
    this._aC.classList.remove(this._classSel  + '--collapsed');
    this._aCContents.classList.remove(this._classSel  + '__contents--expanded');
    this._aCContents.classList.remove(this._classSel  + '__contents--collapsed');

    // Force a recalc styles here so the classes take hold.
    window.getComputedStyle(this._aC).transform;

    if (expand) {
      this._aC.classList.add(this._classSel  + '--expanded');
      this._aCContents.classList.add(this._classSel  + '__contents--expanded');
      return;
    }

    this._aC.classList.add(this._classSel  + '--collapsed');
    this._aCContents.classList.add(this._classSel  + '__contents--collapsed');
  }

  _calculateScales () {
    const collapsed = this._aCTitle.getBoundingClientRect();
    const expanded = this._aC.getBoundingClientRect();

    this._collapsed = {
      x: collapsed.width / expanded.width,
      y: collapsed.height / expanded.height
    }
  }

  _createEaseAnimations () {
    let aCEase = document.querySelector('.aC-ease');
    if (aCEase) {
      return aCEase;
    }

    aCEase = document.createElement('style');
    aCEase.classList.add(this._classSel  + '-ease');

    const aCExpandAnimation = [];
    const aCExpandContentsAnimation = [];
    const aCCollapseAnimation = [];
    const aCCollapseContentsAnimation = [];
    for (let i = 0; i <= 100; i++) {
      const step = this._ease(i/100);
      const startX = this._collapsed.x;
      const startY = this._collapsed.y;
      const endX = 1;
      const endY = 1;

      // Expand animation.
      this._append({
        i,
        step,
        startX: this._collapsed.x,
        startY: this._collapsed.y,
        endX: 1,
        endY: 1,
        outerAnimation: aCExpandAnimation,
        innerAnimation: aCExpandContentsAnimation
      });

      // Collapse animation.
      this._append({
        i,
        step,
        startX: 1,
        startY: 1,
        endX: this._collapsed.x,
        endY: this._collapsed.y,
        outerAnimation: aCCollapseAnimation,
        innerAnimation: aCCollapseContentsAnimation
      });
    }

    aCEase.textContent = `
      @keyframes aCExpandAnimation {
        ${aCExpandAnimation.join('')}
      }

      @keyframes aCExpandContentsAnimation {
        ${aCExpandContentsAnimation.join('')}
      }
      
      @keyframes aCCollapseAnimation {
        ${aCCollapseAnimation.join('')}
      }

      @keyframes aCCollapseContentsAnimation {
        ${aCCollapseContentsAnimation.join('')}
      }`;

    document.head.appendChild(aCEase);
    return aCEase;
  }

  _append ({
        i,
        step,
        startX, 
        startY, 
        endX, 
        endY, 
        outerAnimation, 
        innerAnimation}=opts) {

    const xScale = startX + (endX - startX) * step;
    const yScale = startY + (endY - startY) * step;

    const invScaleX = 1 / xScale;
    const invScaleY = 1 / yScale;

    outerAnimation.push(`
      ${i}% {
        transform: scale(${xScale}, ${yScale});
      }`);

    innerAnimation.push(`
      ${i}% {
        transform: scale(${invScaleX}, ${invScaleY});
      }`);
  }

  _clamp (value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  _ease (v, pow=4) {
    v = this._clamp(v, 0, 1);

    return 1 - Math.pow(1 - v, pow);
  }
}
export default AnimatedClip;
