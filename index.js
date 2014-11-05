var defined = require('defined');
var sprintf = require('sprintf');
var strftime = require('strftime');

module.exports = function (points, opts) {
    if (!opts) opts = {};
    var name = String(defined(opts.name, 'UNDEFINED'))
        .toUpperCase().replace(/[^A-Z]/g, '').slice(0,8)
    ;
    var ax = defined(opts.anglex, 0);
    var ay = defined(opts.angley, 0);
    var az = defined(opts.anglez, 0);
    
    var zup = defined(opts.zup, 10);
    var zdown = defined(opts.zdown, 5);
    
    var pos = [];
    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        pos.push({
            id: sprintf('C%03d', pos.length),
            x: p[0][0], y: p[0][1], z: zup
        });
        for (var j = 0; j < p.length; j++) {
            pos.push({
                id: sprintf('C%03d', pos.length),
                x: p[j][0], y: p[j][1], z: zdown
            });
        }
        pos.push({
            id: sprintf('C%03d', pos.length),
            x: p[j-1][0], y: p[j-1][1], z: zup
        });
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
            return p.id + '=' + sprintf(fmt, p.x, p.y, p.z, ax, ay, az);
        }).join('\r\n'),
        '//INST',
        '///DATE ' + strftime('%Y/%m/%d %H:%M'),
        '///ATTR',
        'END'
    ].join('\r\n');
};
