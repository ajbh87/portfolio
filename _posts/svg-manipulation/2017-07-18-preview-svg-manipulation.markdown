---
layout: post
title:  "Preview - SVG Manipulation with JavaScript"
author: "Alfredo J. Bermúdez"
date:   2017-07-18 10:00:00 -0400
category: Experiments
tags: [Process, Explainer, SVG, JavaScript, SVG + JavaScript]
multipart:
  title: "SVG and JS a Love/Hate Story"
  num: 1
  parts:
    - title: "SVG Manipulation with JavaScript"
      link: "/2017/07/18/preview-svg-manipulation.html"
      active: true
    - title: "Yet Another JS Scroll Trigger"
    - title: "It All Comes Together"

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
has-pen: true
---
* Table of Contents
{:toc}

> Important: This post is a __work in progress__. When it's finished I'll repost it with a new URL.

A few months ago I was brainstorming what to do with my long-pending personal website, specifically with the landing page. So I decided to do an experiment and document the process. This is the first part in a series of three in which I'll try to explain how to manipulate SVGs with JavaScript, how to make performant scroll-based transitions and animations, and how to tie everything together.
<!--more-->

### Love at First Path

Being an art school grad I couldn't start designing the website without a concept. But I only knew that I wanted to do something with SVGs. Since I first dipped myself in Adobe Illustrator, way back in Version 7, I fell in love with SVGs. Why? Well, SVGs are made with [vectors][wiki-vectors], hence the name [Scalable Vector Graphic][wiki-svg]. And vectors have several properties that make them very interesting and useful for the web. 

First, vectors represent lines using coordinates and [bézier curves][wiki-bezier], contrary to raster images like JPEGs and PNGs that are based in pixels, little squares of color. That makes them 100% scalable, clean and precise. Also, SVGs are written using a markup similar to HTML. Which means that elements inside an SVG can be selected and modified using CSS and JS just like any other DOM element. Long story short, people much more knowledgeable than me have written a lot about SVGs. In the references I've listed a few books and posts that I found useful while learning about SVGs. 

### The Concept

Finally, after many days of procrastination, or more accurately, after many days anxiously staring at a blank page, I had an idea for my landing page. A slight pun, but bear with me.

Vectors are made of paths, and when you go through life you take different... PATHS. Silly I know, but that led me to thinking of a path that would change course several times. This would represent the twists and turns in life. Beside it would be sections summarizing the 'chapters' caused by those twists and turns. Something like this.

<figure class="image-figure">
  <img src="./mockup.jpg"
    alt="Landing page mockup.">
  <figcaption>High five to myself, I have a concept and a mockup!</figcaption>
</figure>

### The Challenge

The first problem is that each section will not have the same height. This means that we need to redraw the path dynamically based on the height of each section. This would be much easier if I used an svg manipulation/animation library, like snap.svg or svg.js, but it wouldn't be a challenge. 

The plan is to get the ratio of each section relative to their parent, which we'll call `div.home`. The SVG will also be a direct descendant of `div.home` and will have the same height and width as it. This way we only need to apply the ratio measured to the corresponding area in the SVG. I'll try to explain it better as we go.

#### 1. HTML/CSS + SVG

Before we start with the JavaScript let's throw together some HTML and SCSS with the SVG I made.

{% include codepen-figure.html
    name = "Portfolio Process - Part 1"
    slug = "WOBVdN" %}

> Note: I added `preserveAspectRatio="none"` to the SVG because SVGs scale proportionally, keeping the same aspect ratio. This is not really a problem, more like a feature of SVGs but in this case is not what we want to happen. We want it to stretch to the same size as its parent `div.home`.

Look at points 1, 4, 7, 10 in the mockup and compare them with the Pen. This points should be aligned to the end of each corresponding section, and as you can see they are not. That's what we'll be working on in this article.

<figure class="image-figure">
  <img src="./zoom.jpg"
    alt="Zoom comparing points in mockup and result.">
  <figcaption>Look at point 1 and its relation to the end of section 1.</figcaption>
</figure>

#### 2. Getting `section` Ratios

As I said before, to change the SVG we need to know the ratio of each section relative to `div.home`. For this I created a function that iterates through the `SECTIONS` NodeList and returns an object with the height of `div.home` and an array containing all the ratios.

``` js
const CONTAINER = document.querySelector('.home'),
      SECTIONS = document.querySelectorAll('.section');

let sectionRatios = getSectionRatios();
/*
  The function 'getSectionRatios' returns an object containing:
  - The height of 'div.home'
  - An array of the ratio of each '.section' relative to 'div.home'
*/
function getSectionRatios() {
  let cHeight = CONTAINER.offsetHeight, // 'div.home' Height
    ratios = []; // Ratio array

  SECTIONS.forEach((element, index) => {
    // '.section' Height / 'div.home' Height
    let ratio = element.offsetHeight / cHeight, 
    ratios.push(ratio);
  });

  return { cHeight, ratios };
}
```
#### 3. ---

After we get the ratio of each section we need to modify the SVG. During the process I realized that this part was going to be much more difficult than what I expected. So, I'll guide you through my final version and I'll do my best to explain why I did it.

To tackle this problem I created a class called svgLine. An svgLine object has several useful methods that will help us solve  

[how-svg-line]: https://css-tricks.com/svg-line-animation-works/
[wiki-vectors]: https://en.wikipedia.org/wiki/Vector_graphics
[wiki-svg]: https://en.wikipedia.org/wiki/Scalable_Vector_Graphics
[wiki-bezier]: https://en.wikipedia.org/wiki/B%C3%A9zier_curve
[practical-svg]: https://abookapart.com/products/practical-svg
