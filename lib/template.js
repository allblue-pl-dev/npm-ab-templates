'use strict';

var fs = require('fs');
var path = require('path');

var abFiles = require('ab-files');
var abLog = require('ab-log');
var abTypes = require('ab-types');
var abSync = require('ab-sync');

var HtmlDocument = require('./html-document').HtmlDocument;
var Layout = require('./layout').Layout;


var Template = {
    self: null,

    infos: null,
    paths: null,

    layouts: null,

    Class: function()
    {
        var self = this.self = this;
    },

    build: function(build_path)
    {
        var self = this.self;

        /* Should `path` be relative or not? */
        build_path = path.join(path.dirname(require.main.filename),
                build_path);

        var build_dir_path = path.dirname(build_path);

        if (!abFiles.dir_Exists(build_dir_path)) {
            abLog.warn('`build_path` does not exist. Creating...');
            abFiles.dir_Create(build_dir_path);
        }

        var layouts_json = {};
        for (var layout_name in self.layouts) {
            layouts_json[layout_name] = self.layouts[layout_name].getJSON();
        }

        abFiles.file_PutContent(build_path, JSON.stringify(layouts_json,
                null, '\t'));
    },

    parse: function(template_path)
    {
        var self = this.self;

        self._clearTemplate();

        /* Should `path` be relative or not? */
        template_path = path.join(path.dirname(require.main.filename),
                template_path);

        /* Get all template info files. */
        self._parse_ParseInfo([template_path], template_path);

        /* Merge all template infos together. */
        var template_info = {};
        for (var i = 0; i < self.infos.length; i++)
            self._mergeObjects(template_info, self.infos[i]);

        /* Get all layout infos. */
        Object.keys(template_info.layouts).forEach(function(layout_name) {
            if (layout_name[0] === '#') {
                abLog.warn('Skipping `%s`...', layout_name);
                return;
            }

            var layout_path = template_info.layouts[layout_name];

            //try {
                self.layouts[layout_name] =
                        Layout.ParseFile(layout_path);
            // } catch (err) {
            //     abLog.error('Cannot parse `%s`.', layout_path);
            //     abLog.warn(err);
            // }
        });
    },

    _clearTemplate: function()
    {
        var self = this.self;

        self.infos = [];
        self.paths = [];

        self.layouts = {};
    },

    _logStack: function(stack)
    {
        var self = this.self;

        for (var i = 0; i < stack.length; i++)
            abLog.warn(' - %s', stack[i]);
    },

    _mergeObjects: function(template_info_to, template_info_from)
    {
        var self = this.self;

        for (var key in template_info_from) {
            var from_val = template_info_from[key];

            if (abTypes.isObject(from_val)) {
                if (!(key in template_info_to))
                    template_info_to[key] = {};
                else if (!abTypes.isObject(template_info_to[key]))
                    template_info_to[key] = {};

                self._mergeObjects(template_info_to[key],
                        from_val);
            } else if (abTypes.isArray(from_val))
                template_info_to[key] = from_val.slice(0);
            else
                template_info_to[key] = from_val;
        }
    },

    _parse_ParseInfo: function(stack, template_path)
    {
        var self = this.self;

        if (!abFiles.file_Exists(template_path)) {
            abLog.error('`template_path` does not exist:');
            self._logStack(stack);
            return;
        }

        self.paths.push(path.dirname(template_path));

        var template_info = null;
        try {
            var template_info = JSON.parse(
                    abFiles.file_GetContent(template_path));
        } catch (err) {
            abLog.error('Cannot parse `%s`:', template_path);
            abLog.warn(err);
            return;
        }

        self.infos.push(template_info);

        self._parse_ParseTemplates(stack, template_info);
    },

    _parse_ParseTemplates: function(stack, template_info)
    {
        var self = this.self;

        if (!('templates' in template_info))
            return;

        if (!abTypes.isArray(template_info.templates)) {
            abLog.error('`templates` should be an `array`:');
            self._logStack(stack);
            return;
        }

        for (var i = 0; i < template_info.templates.length; i++) {
            var template_path = path.join(
                    path.dirname(stack[stack.length - 1]),
                    template_info.templates[i]);

            var n_stack = stack.slice(0);
            n_stack.push(template_path);

            self._parse_ParseTemplateInfo(n_stack, template_path);
        }
    },

};
Template.Class.prototype = Template;
exports.Template = Template;
