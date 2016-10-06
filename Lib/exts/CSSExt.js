'use strict';

var path = require('path');

var abPathQuery = require('ab-path-query');

var Ext = require('../Ext');


var CssExt = {

    _pathQueries: null,
    _cssPaths: null,

    Class: function(template, args)
    {
        this.Class('CssExt', template);
        var self = this.self = this;

        self._pathQueries = [];
        self._cssPaths = [];
    }
};
var override = CssExt.Class.prototype = Object.create(Ext);
module.exports = CssExt;

override._build = function(sync, final)
{
    var self = this.self;

    self.log('Styles:');
    for (var i = 0; i < self._cssPaths.length; i++)
        self.log('    - ' + self._cssPaths[i]);

    return sync.finished();
};

override._parse_Post = function()
{
    var self = this.self;

    /* Header */
    var template = self.getTemplate();

    for (var i = 0; i < self._cssPaths.length; i++) {
        var uri = template.getPathUri(self._cssPaths[i]);

        template.addHeaderTag('link', {
            rel: "stylesheet",
            href: uri + '?v=' + self.getVersionHash(),
            type: "text/css"
        });
    }
}

override._parse_Pre = function()
{
    var self = this.self;

    self._pathQueries = [];
    self._cssPaths = [];
};

override._parse_TemplateInfo = function(template_info, template_path)
{
    var self = this.self;

    var template = self.getTemplate();

    if (!('css' in template_info))
        return;

    var css_paths = template_info.css;

    for (var i = 0; i < css_paths.length; i++) {
        var fp = abPathQuery.new(
                template_path + '/' + css_paths[i]);

        fp.onChange(function() {
            self._parse_TemplateInfo_CssPaths();
            template.build_Header();
        });

        self._pathQueries.push(fp);
    }

    self._parse_TemplateInfo_CssPaths();
};

override._parse_TemplateInfo_CssPaths = function()
{
    var self = this.self;

    for (var i = 0; i < self._pathQueries.length; i++) {
        var pq = self._pathQueries[i];

        var file_paths = pq.getFilePaths();
        self._cssPaths = self._cssPaths.concat(file_paths);

        var file_dirs = pq.getDirPaths();
        for (var j = 0; j < file_dirs.length; j++) {
            var d_file_paths = abPathQuery.getFilePaths(
                    file_dirs[j] + '/*.css');
            self._cssPaths.concat(file_paths);
        }
    }
};

override.unwatch = function()
{
    var self = this.self;

    for (var i = 0; i < self._pathQueries.length; i++)
        self._pathQueries[i].unwatch();
};

override.watch = function()
{
    var self = this.self;

    for (var i = 0; i < self._pathQueries.length; i++)
        self._pathQueries[i].watch();
};
