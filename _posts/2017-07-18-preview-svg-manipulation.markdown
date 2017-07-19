---
layout: post
title:  "Preview - SVG Manipulation with JavaScript"
author: "Alfredo J. Bermúdez"
date:   2017-07-18 10:00:00 -0400
tags: [Process]
multipart:
  title: "SVG and JS a Love/Hate Story"
  num: 1
  parts:
    - title: "SVG Manipulation with JavaScript"
      link: "/2017/07/18/preview-svg-manipulation.html"
      active: true
    - title: "Yet Another JS Scroll Trigger"
    - title: "It All Comes Together"
toc:
  - id: "love-at-first-path"
    name: "Love at First Path"
  - id: "the-concept"
    name: "The Concept"  
  - id: "the-challenge"
    name: "The Challenge"
tools:
  - Jekyll
    - Octopress Paginate
  - Sass
  - JavaScript
    - Web Animation API! with [Polyfill](https://github.com/web-animations/web-animations-js)
research:
  - author: "Chris Coyier"
    title: "Practical SVG"
    link: "https://abookapart.com/products/practical-svg"
    date: 2017
  - author: "Chris Coyier"
    title: "How SVG Line Animation Works"
    link: "https://css-tricks.com/svg-line-animation-works/"
    date: 2014-02-18
  - author: "Paul Irish"
    title: "requestAnimationFrame for Smart Animating"
    link: "https://css-tricks.com/svg-line-animation-works/"
    date: 2011-02-22
---
> Important: This post is a __work in progress__. When it's finished I'll repost it with a new URL.

A few months ago I was brainstorming what to do with my long-pending personal website, specifically with the landing page. So I decided to do an experiment and document the process. This is the first part in a series of three in which I'll try to explain how to manipulate SVGs with JavaScript, how to make performant scroll-based transitions and animations, and how to tie everything together.
<!--more-->

### Love at First Path

Being an art school grad I couldn't start designing the website without a concept. But I only knew I wanted to do something with SVGs. Since I first dipped myself in Adobe Illustrator, way back in Version 7, I fell in love with SVGs. Why? Well, SVGs are made with [vectors][wiki-vectors], hence the name [Scalable Vector Graphic][wiki-svg]. What makes vectors exciting for someone like me is that they represent lines using coordinates, contrary to raster images like JPEGs and PNGs that are based in pixels, little squares of color. And because of that, they are 100% scalable, clean and precise.

### The Concept

Finally, after many days of procrastination, or more accurately, after many days anxiously staring at a blank page, I had an idea for my landing page. A slight pun, but bear with me. Vectors are made of paths, and when you go through life you take different... PATHS. Silly I know, but that led me to thinking of a path that would change course several times. This would represent the twists and turns in life. Besides it, there would be sections summarizing the 'chapters' caused by those twists and turns. Something like this.

{% include image-figure.html
    caption = "An extremely simple, almost cringe-inducing, mockup for my landing page."
    src = "/assets/2017-07-14-in-the-beginning/mockup.jpg"
    alt = "Landing Page Mockup" %}

High five to myself, I have a concept and a mockup!

### The Challenge

The first problem is that each section will not have the same height. This means that we need to redraw the path based on the height of each section. That's what we'll be doing with JavaScript, and the challenge is not using any SVG manipulation framework to make it work.

Before we start with the JavaScript let's throw together some HTML and SCSS with the SVG I made.

{% include codepen-figure.html
    name = "Portfolio Process - Part 1"
    slug = "WOBVdN" %}

> Note: I added `preserveAspectRatio="none"` to the SVG because SVGs scale proportionally, keeping the same aspect ratio. This is not really a problem, more like a feature of SVGs but in this case is not what we want to happen. We want it to stretch to the same size as its parent `div.home`. You're going to learn why in a moment.

Look at the following points 1, 4, 7, 10 in the mockup and compare them with the CodePen. This points should be aligned to the end of each corresponding section, and as you can see they are not. To align them we're going to do some simple math.

{% include image-figure.html
    caption = "Look at points 1 and 4 and their relation with the sections."
    src = "/assets/2017-07-14-in-the-beginning/zoom.jpg"
    alt = "Zoom to Points in Mockup" %}



{% highlight js %}

const m = 'r2d2';

if (m.find(48)) {}
if (NodeList.forEach == null) {
    NodeList.prototype.forEach = function(fn) {
        forEach(this, fn);
    };
}

{% endhighlight %}

<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

[how-svg-line]: https://css-tricks.com/svg-line-animation-works/
[wiki-vectors]: https://en.wikipedia.org/wiki/Vector_graphics
[wiki-svg]: https://en.wikipedia.org/wiki/Scalable_Vector_Graphics
[practical-svg]: https://abookapart.com/products/practical-svg
