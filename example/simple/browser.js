var toinform = require('../../');

var code = document.querySelector('#code');
code.value = toinform(

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
    code.value = toinform(points, {
        name: 'face',
        xangle: -168.90,
        yangle: -11.30,
        zangle: -68.01,
        xmin: 900, xmax: 1200,
        ymin: -650, ymax: -350,
        zup: 150.4, zdown: 140.4
    });
});
