'use strict';

var fs = require('fs');
var path = require('path');

var abLog = require('ab-log');
var abWatcher = require('ab-watcher');

var Template = require('./Lib/Template.js');


exports.Lib = require('./Lib');

// exports.build = function(options) {
//     var tpl = new Template.Class(options);
//
//     tpl.build();
// };

exports.exec = function() {
    var tpl_path = path.join(path.dirname(require.main.filename), 'tpl.json');

    var t = new Template.Class(tpl_path);
    t.watch();
};

// exports.new = function() {
//     var args = [null];
//     for (var i = 0; i < arguments.length; i++)
//         args.push(arguments[i]);
//
//     return new (Function.prototype.bind.apply(Template.Class, args));
// };
//
// exports.watch = function(template_path, exts) {
//     var t = new Template.Class(template_path);
//
//     for (var i = 0; i < exts.length; i++) {
//         if (abTypes.isString(exts[i]))
//             t.ext(exts[i]);
//         else if (abTypes.isArray(exts[i])) {
//             if (exts[i].length === 1)
//                 t.ext(exts[i][0]);
//             else if (exts[i].length >= 2)
//                 t.ext(exts[i][0], exts[i][1]);
//         } else
//             throw new TypeError('`ext` should be String or Array');
//     }
//
//     t.parse();
//     t.build();
//
//     t.watch();
// };
