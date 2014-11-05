var defined = require('defined');
var sprintf = require('sprintf');
var strftime = require('strftime');

module.exports = function (points, opts) {
    if (!opts) opts = {};
    var name = String(defined(opts.name, 'UNDEFINED'))
        .toUpperCase().replace(/[^A-Z]/g, '').slice(0,8)
    ;
    var ax = defined(opts.xangle, 0);
    var ay = defined(opts.yangle, 0);
    var az = defined(opts.zangle, 0);
    
    var zup = defined(opts.zup, 10);
    var zdown = defined(opts.zdown, 5);
    
    var vup = defined(opts.vup, 200);
    var vdown = defined(opts.vdown, 50);
    
    var xmin = defined(opts.xmin, 0);
    var xmax = defined(opts.xmax, 100);
    
    var ymin = defined(opts.ymin, 0);
    var ymax = defined(opts.ymax, 100);
    
    var pxmax = -Infinity, pxmin = Infinity;
    var pymax = -Infinity, pymin = Infinity;
    
    var pos = [];
    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        pos.push({
            id: sprintf('C%03d', pos.length),
            x: p[0][0],
            y: p[0][1],
            z: zup
        });
        for (var j = 0; j < p.length; j++) {
            pos.push({
                id: sprintf('C%03d', pos.length),
                x: p[j][0], y: p[j][1], z: zdown
            });
            pxmax = Math.max(pxmax, p[j][0]);
            pxmin = Math.min(pxmin, p[j][0]);
            pymax = Math.max(pymax, p[j][1]);
            pymin = Math.min(pymin, p[j][1]);
        }
        pos.push({
            id: sprintf('C%03d', pos.length),
            x: p[j-1][0], y: p[j-1][1], z: zup
        });
    }
    
    function shift (x, y) {
        return [
            x * (pxmax - pxmin) / (xmax - xmin) + xmin,
            y * (pymax - pymin) / (ymax - ymin) + ymin
        ];
    }
    
    return [
        '/JOB',
        '//NAME ' + name,
        '//POS',
        '///NPOS ' + pos.length + ',0,0,0',
        '///TOOL 0',
        '///RECTAN',
        '///RCONF 0,0,0,0,0',
        pos.map(function (p) {
            var fmt = '%.3f,%.3f,%.3f,%.2f,%.2f,%.2f';
            var xy = shift(p.x, p.y);
            return p.id + '=' + sprintf(fmt, xy[0], xy[1], p.z, ax, ay, az);
        }).join('\r\n'),
        '//INST',
        '///DATE ' + strftime('%Y/%m/%d %H:%M'),
        '///ATTR 0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0',
        '///FRAME BASE',
        'NOP',
        pos.map(function (p) {
            var v = p.z === zup ? vup : vdown;
            return 'MOVL ' + p.id + ' V=' + v + ' CONT';
        }).join('\r\n'),
        'END'
    ].join('\r\n');
};
