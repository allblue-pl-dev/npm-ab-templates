'use strict';

var path = require('path');

var abPathQuery = require('ab-path-query');

var Ext = require('../Ext');


var JSExt = {

    _filesPaths: null,
    _jsPaths: null,

    Class: function(template)
    {
        this.Class('JSExt', template);
        var self = this.self = this;

        self._filesPaths = [];
        self._jsPaths = [];
    }
};
var override = JSExt.Class.prototype = Object.create(Ext);
module.exports = JSExt;

override._build = function(sync, final)
{
    var self = this.self;

    self.log('Scripts:');
    for (var i = 0; i < self._jsPaths.length; i++)
        self.log('    - ' + self._jsPaths[i]);

    return sync.finished();
};

override._parse_Post = function()
{
    var self = this.self;

    /* Header */
    var template = self.getTemplate();

    for (var i = 0; i < self._jsPaths.length; i++) {
        var uri = template.getPathUri(self._jsPaths[i]);

        template.addHeaderTag('script', {
            src: uri + '?v=' + self.getVersionHash(),
            type: 'text/javascript'
        });
    }
};

override._parse_Pre = function()
{
    var self = this.self;

    self._filesPaths = [];
    self._jsPaths = [];
};

override._parse_TemplateInfo = function(template_info, template_path)
{
    var self = this.self;

    var template = self.getTemplate();

    if (!('js' in template_info))
        return;

    var js_paths = template_info.js;

    js_paths.forEach(function(js_path) {
        var pq = abPathQuery.new(
                template_path + '/' + js_path);

        pq.onChange(function() {
            self._parse_TemplateInfo_JSPaths();
            template.build_Header();
        });

        self._filesPaths.push(pq);
    });

    self._parse_TemplateInfo_JSPaths();
};

override._parse_TemplateInfo_JSPaths = function()
{
    var self = this.self;

    for (var i = 0; i < self._filesPaths.length; i++) {
        var pq = self._filesPaths[i];

        var file_paths = pq.getFilePaths();

        var file_dirs = pq.getDirPaths();
        for (var j = 0; j < file_dirs.length; j++) {
            var d_file_paths = abPathQuery.getFilePaths(
                    file_dirs[j] + '/*.js');

            file_paths = file_paths.concat(file_dirs);
        }

        for (var k = 0; k < file_paths.length; k++) {
            var index = self._jsPaths.indexOf(file_paths[k]);
            if (index !== -1)
                self._jsPaths.splice(index, 1);

            self._jsPaths.push(file_paths[k]);
        }
    }
};

override.unwatch = function()
{
    var self = this.self;

    for (var i = 0; i < self._filesPaths.length; i++)
        self._filesPaths[i].unwatch();
};

override.watch = function()
{
    var self = this.self;

    for (var i = 0; i < self._filesPaths.length; i++)
        self._filesPaths[i].watch();
};
