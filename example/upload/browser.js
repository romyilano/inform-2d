var linearize = require('svg-linearize');
var segments = require('svg-line-segments');
var createElement = require('svg-create-element');

var element = require('element');
var upload = require('upload-element');

var toinform = require('../../');

var code = document.querySelector('#code');
var picture = document.querySelector('#picture');
var input = document.querySelector('#upload');

upload(input, { type: 'text' }, function (err, results) {
    var svg = element(results[0].target.result);
    var nsvg = wireframe(linearize(svg, { tolerance: 3 }));
    
    code.value = toinform(segments(nsvg), {
        name: 'face',
        xangle: -168.90,
        yangle: -11.30,
        zangle: -68.01,
        xmin: 900, xmax: 1200,
        ymin: -650, ymax: -350,
        zup: 150.4, zdown: 140.4
    });
    
    picture.innerHTML = '';
    picture.appendChild(nsvg);
    fit(nsvg);
});

function fit (svg) {
    var bbox = bounds(svg);
    var sbox = svg.getBoundingClientRect();
    
    var tx = (sbox.left - bbox.left) / 2;
    var ty = (sbox.top - bbox.top) / 2;
    var w = bbox.right - bbox.left;
    var h = bbox.bottom - bbox.top;
    
    var wh = Math.max(w, h);
    var sx = sbox.width / wh;
    var sy = sbox.height / hh;
    
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
