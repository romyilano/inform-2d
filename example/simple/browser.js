var linearize = require('svg-linearize');
var loadsvg = require('load-svg');
var parse = require('parse-svg-path');
var toinform = require('../../');

var code = document.querySelector('#code');

loadsvg('face.svg', function (err, svg) {
    var nsvg = linearize(svg, { tolerance: 3 });
    document.body.insertBefore(nsvg, code);
    
    var paths = nsvg.querySelectorAll('path');
    var points = [];
    
    for (var i = 0; i < paths.length; i++) {
        var cmds = parse(paths[i].getAttribute('d'));
        var pts = [];
        for (var j = 0; j < cmds.length; j++) {
            var c = cmds[j];
            if (c[0] === 'M' || c[0] === 'L') {
                pts.push(c.slice(1));
            }
        }
        points.push(pts);
    }
    code.value = toinform(points);
});
