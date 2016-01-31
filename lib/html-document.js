'use strict';

var xmldoc = require('xmldoc');


var HtmlDocument = {
    self: null,

    _nodes: null,

    Class: function(html)
    {
        var self = this.self = this;

        /* Find replace text with `<html-document-text` nodes. */
        var regexp = new RegExp(/>([ \t\r\n]*)(.*?)([ \t\r\n]*)</gm);
        html = html.replace(/>([ \t\r\n]*)(.*?)([ \t\r\n]*)</gm,
                '>$1<html-document-text>$2</html-document-text>$3<');
        html = html.replace(
                /<html-document-text><\/html-document-text>/mg, '');

        html = '<html-document>' + html + '</html-document>';

        var xmldoc_document = new xmldoc.XmlDocument(html);

        self._parse(xmldoc_document);
    },

    getNodes: function()
    {
        var self = this.self;

        return self._nodes;
    },

    _parse: function(xmldoc_document)
    {
        var self = this.self;

        self._nodes = [];
        self._parse_ParseNodeChildren(null, xmldoc_document);
    },

    _parse_ParseNodeChildren: function(parent_node, xmldoc_child)
    {
        var self = this.self;

        for (var i = 0; i < xmldoc_child.children.length; i++)
            self._parse_ParseNode(parent_node, xmldoc_child.children[i]);
    },

    _parse_ParseNode: function(parent_node, xmldoc_child)
    {
        var self = this.self;

        var node = {};

        if (parent_node === null)
            self._nodes.push(node);
        else
            parent_node.children.push(node);

        if (xmldoc_child.name === 'html-document-text') {
            node.type = 'text';
            node.value = xmldoc_child.val;
        } else {
            node.type = 'element';

            node.name = xmldoc_child.name;

            node.attribs = {};
            for (var name in xmldoc_child.attr)
                node.attribs[name] = xmldoc_child.attr[name];

            node.children = [];

            self._parse_ParseNodeChildren(node, xmldoc_child);
        }
    }

};
HtmlDocument.Class.prototype = HtmlDocument;
exports.HtmlDocument = HtmlDocument;
