'use strict';

var abFiles = require('ab-files');
var abLog = require('ab-log');

var HtmlDocument = require('./html-document').HtmlDocument;


var Layout = {
    self: null,

    _json: null,

    ParseFile: function(file_path)
    {
        if (!abFiles.file_Exists(file_path)) {
            abLog.error('Layout path `%s` does not exist.', file_path);
            return;
        }

        var layout_html = abFiles.file_GetContent(file_path);

        return new Layout.Class(layout_html);
    },

    Class: function(layout_html)
    {
        var self = this.self = this;

        self._json = {
            elems: {},
            fields: {},
            nodes: []
        };

        var layout_document = new HtmlDocument.Class(layout_html);
        self._parse(layout_document);
    },

    getJSON: function()
    {
        var self = this.self;

        return self._json;
    },

    _json_GetNodeField: function(field_name)
    {
        var self = this.self;

        if (!(field_name in self._json.fields)) {
            self._json.fields[field_name] = {
                attribs: [],
                hides: [],
                nodes: [],
                repeats: [],
                shows: [],
            };
        }

        return self._json.fields[field_name];
    },

    _parse: function(layout_document)
    {
        var self = this.self;

        self._parseNodes(-1, layout_document.getNodes());
    },

    _parseNodes: function(parent_node_index, nodes)
    {
        var self = this.self;

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].type === 'text')
                self._parseNodes_ParseTextNode(parent_node_index, nodes[i]);
            else {
                self._parseNodes_ParseElementNode(parent_node_index, nodes[i]);

                self._parseNodes(self._json.nodes.length - 1,
                        nodes[i].children);
            }
        }
    },

    _parseNodes_ParseTextNode: function(parent_node_index, node) {
        var self = this.self;

        var node_json = {
            parent: parent_node_index,
            type: '_text',
            val: node.value
        };

        self._json.nodes.push(node_json);
        var node_json_index = self._json.nodes.length - 1;

        if (parent_node_index >= 0)
            self._json.nodes[parent_node_index].children.push(node_json_index);

        /* Parse Node Fields */
        node_json.field = null;
        // if ('ab-field' in node.attribs) {
        //     var field_name = node.attribs['ab-field'];
        //     delete node.attribs['ab-field'];
        //
        //     var field = self._json_GetNodeField(field_name);
        //
        //     node_json.field = field_name;
        //     field.nodes.push(node_json_index);
        // }
    },

    _parseNodes_ParseElementNode: function(parent_node_index, node) {
        var self = this.self;

        var node_json = {
            parent: parent_node_index,
            type: node.name,
            attribs: {},
            children: []
        };

        self._json.nodes.push(node_json);
        var node_json_index = self._json.nodes.length - 1;

        if (parent_node_index >= 0)
            self._json.nodes[parent_node_index].children.push(node_json_index);

        /* Parse Elems */
        node_json.elem = null;
        if ('ab-elem' in node.attribs) {
            var elem_id = node.attribs['ab-elem'];
            delete node.attribs['ab-elem'];

            if (elem_id in self._json.elems)
                abLog.Warn('Duplicated elem `%s`.', elem_id);

            node_json.elem = elem_id;
            self._json.elems[elem_id] = node_json_index;
        }

        /* Parse Show */
        node_json.show = null;
        if ('ab-show' in node.attribs) {
            var field_name = node.attribs['ab-show'];
            delete node.attribs['ab-show'];

            var field = self._json_GetNodeField(field_name);

            node_json.show = field_name;
            field.shows.push(node_json_index);
        }

        /* Parse Hide */
        node_json.hide = null;
        if ('ab-hide' in node.attribs) {
            var field_name = node.attribs['ab-hide'];
            delete node.attribs['ab-hide'];

            var field = self._json_GetNodeField(field_name);

            node_json.hide = field_name;
            field.shows.push(node_json_index);
        }

        /* Parse Node Fields */
        node_json.field = null;
        if ('ab-field' in node.attribs) {
            var field_name = node.attribs['ab-field'];
            delete node.attribs['ab-field'];

            var field = self._json_GetNodeField(field_name);

            node_json.field = field_name;
            field.nodes.push(node_json_index);
        }

        /* Parse Attrib Fields */
        node_json.fieldAttribs = null;
        var prefix = 'ab-field-';
        for (var attrib_name in node.attribs) {
            if (attrib_name.indexOf(prefix) === -1)
                continue;

            var field_name = node.attribs[attrib_name];
            delete node.attribs[attrib_name];

            var attrib_field_name = attrib_name.substring(prefix.length);

            var field = self._json_GetNodeField(field_name);

            if (node_json.fieldAttribs === null)
                node_json.fieldAttribs = {};
            node_json.fieldAttribs[attrib_field_name] =field_name;
            field.attribs.push(
                    [node_json_index, attrib_field_name]);
        }

        /* Parse Repeats */
        node_json.repeat = null;
        if ('ab-repeat' in node.attribs) {
            var repeat_array = node.attribs['ab-repeat'].split(':');
            delete node.attribs['ab-repeat'];

            var field_name = repeat_array[0];

            var item = '_item';
            if (repeat_array.length >= 1);
                item = repeat_array[1];

            var key = '_key';
            if (repeat_array.length >= 2)
                key = repeat_array[2];


            var field = self._json_GetNodeField(field_name);

            node_json.repeat = [field_name, item, key];
            field.repeats.push(node_json_index);
        }

        /* Parse Attribs */
        for (var attrib_name in node.attribs)
            node_json.attribs[attrib_name] = node.attribs[attrib_name];
    }

}
Layout.Class.prototype = Layout;
exports.Layout = Layout;
