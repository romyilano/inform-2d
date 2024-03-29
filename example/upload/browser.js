var linearize = require('svg-linearize');
var segments = require('svg-line-segments');
var createElement = require('svg-create-element');

var element = require('element');
var upload = require('upload-element');
var slideways = require('slideways');

var slider = slideways({ min: 0, max: 14, init: 3 });
var timeout = null;;
slider.on('value', function (value) {
    slider.value = value;
    var label = document.querySelector('#slider-label');
    label.textContent = '(' + value + ')';
    if (timeout) return;
    timeout = setTimeout(function () {
        timeout = null;
        generateImage();
    }, 250);
});
slider.appendTo('#slider');

var toinform = require('../../');

var code = document.querySelector('#code');
var picture = document.querySelector('#picture');
var input = document.querySelector('#upload');

var nsvg, svg;
upload(input, { type: 'text' }, function (err, results) {
    svg = element(results[0].target.result);
    generateImage();
});

function generateImage () {
    if (!svg) return;
    nsvg = wireframe(linearize(svg, { tolerance: slider.value }));
    picture.innerHTML = '';
    picture.appendChild(nsvg);
    fit(nsvg);
    compute();
}

function compute () {
    if (!nsvg) return;
    code.value = toinform(segments(nsvg), {
        name: document.querySelector('#name').value,
        xangle: param('#xangle'),
        yangle: param('#yangle'),
        zangle: param('#zangle'),
        xmin: param('#xmin'),
        xmax: param('#xmax'),
        ymin: param('#ymin'),
        ymax: param('#ymax'),
        zup: param('#zup'),
        zdown: param('#zdown'),
        vup: param('#vup'),
        vdown: param('#vdown')
    });
    
    function param (sel) { return Number(document.querySelector(sel).value) }
}

var params = [
    '#xangle', '#yangle', '#zangle', '#xmin', '#xmax', '#ymin', '#ymax', '#zup',
    '#zdown', '#vup', '#vdown', '#name'
];
params.forEach(function (sel) {
    var elem = document.querySelector(sel);
    elem.addEventListener('keyup', compute);
});

function fit (svg) {
    var bbox = bounds(svg);
    var sbox = svg.getBoundingClientRect();
    
    var tx = sbox.left - bbox.left;
    var ty = sbox.top - bbox.top;
    var w = bbox.right - bbox.left;
    var h = bbox.bottom - bbox.top;
    
    var wh = Math.max(w, h);
    var sx = sbox.width / wh;
    var sy = sbox.height / wh;
    
    var g = createElement('g', {
        transform: 'scale(' + sx + ' ' + sy + ')'
            + ' translate(' + tx + ' ' + ty + ')'
    });
    var children = [].slice.call(svg.children);
    svg.appendChild(g);
    
    for (var i = 0; i < children.length; i++) {
        var p = children[i];
        svg.removeChild(p);
        g.appendChild(p);
    }
}

function bounds (svg) {
    var paths = svg.querySelectorAll('path');
    var bbox = {
        left: Infinity, right: -Infinity,
        top: Infinity, bottom: -Infinity
    };
    for (var i = 0; i < paths.length; i++) {
        var b = paths[i].getBoundingClientRect();
        bbox.left = Math.min(bbox.left, b.left);
        bbox.right = Math.max(bbox.right, b.right);
        bbox.top = Math.min(bbox.top, b.top);
        bbox.bottom = Math.max(bbox.bottom, b.bottom);
    }
    return bbox;
}

function wireframe (svg) {
    var paths = svg.querySelectorAll('path');
    var bbox = {
        left: Infinity, right: -Infinity,
        top: Infinity, bottom: -Infinity
    };
    for (var i = 0; i < paths.length; i++) {
        var p = paths[i];
        p.style.fill = 'transparent';
        p.style.strokeWidth = '2px';
        p.style.stroke = 'rgb(200,40,40)';
    }
    return svg;
}
