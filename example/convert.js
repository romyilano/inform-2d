var inform = require('../');
var points = require('./points.json');

var src = inform(points, {
    name: 'wow',
    xangle: -168.90,
    yangle: -11.30,
    zangle: -68.01,
    xmin: 900, xmax: 1200,
    ymin: -650, ymax: -350,
    zup: 150.4, zdown: 140.4

});
console.log(src);
