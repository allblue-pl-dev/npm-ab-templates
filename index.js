'use strict';

var fs = require('fs');
var path = require('path');

var abFiles = require('ab-files');
var abLog = require('ab-log');
var abSync = require('ab-sync');

var ABWatcher = require('ab-watcher').Lib.Watcher;

var Template = require('./lib/template.js').Template;


exports.Lib = require('./lib.js');
exports.build = function(template_path, build_path) {
    // var template = '';
    //
    // try {
    //     template = JSON.parse(fs.readFileSync(template_path).toString());
    // } catch (err) {
    //     abLog.error('Cannot read template file.');
    //     abLog.warn(err);
    //     return;
    // }
    //
    // var template = require(template_path);

    var t = new Template.Class();

    t.parse(template_path);
    t.build(build_path);

    //
    // var lessWatcher = new ABWatcher.Class(t.getLessFiles(), function() {
    //     t.buildLess();
    // });
    //
    // var jsWatcher = new ABWatcher.Class(t.getJSFiles(), function() {
    //     t.buildJS();
    // });
    //
    // var layoutsWatcher = new ABWatcher.Class(t.getLayoutFiles(), function() {
    //     t.buildLayouts();
    // });
    //
    // var templateWatcher = new ABWatcher.Class(t.getTemplateFiles(), function() {
    //     t.buildLess();
    //     t.buildJS();
    //     t.buildLayouts();
    //
    //     lessWatcher.setFiles(t.getLessFiles());
    //     jsWatcher.setFiles(t.getLessFiles());
    //     layoutsWatcher.setFiles(t.getLessFiles());
    // });



    // t.parseLayout('templates/test/layouts/article/article.html');
};

// exports.parse = function(template_path) {
//     var script_dir = path.dirname(require.main.filename);
//     var template_path = path.join(script_dir, template_path);
//
//     var t_json = require(template_path);
//
// };
