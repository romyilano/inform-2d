var linearize = require('svg-linearize');
var loadsvg = require('load-svg');
var parse = require('parse-svg-path');

var code = document.querySelector('#code');

loadsvg('face.svg', function (err, svg) {
    var nsvg = linearize(svg, { tolerance: 3 });
    document.body.insertBefore(nsvg, code);
    
    var paths = nsvg.querySelectorAll('path');
    for (var i = 0; i < paths.length; i++) {
        var p = paths[i];
        var pts = parse(p.getAttribute('d'));
        console.log(JSON.stringify(pts));
    }
});
