'use strict';


var Header = Object.create(null, {

    _tags: { value: null, writable: true },

    Class: { value:
    function() {
        this._tags = [];
    }},

    addTag: { value:
    function(name, attribs, self_closing, content) {
        this._tags.push({
            name: name,
            attribs: attribs,
            selfClosing: typeof self_closing === 'undefined' ? false : true,
            content: typeof content === 'undefined' ? '' : content
        });
    }},

    _getTagHtml: { value:
    function(tag) {
        var self = this.self;

        self_closing = typeof self_closing === 'undefined' ? false : true;

        var html = '<' + name;
        for (var attrib_name in attribs)
            html += ' ' + attrib_name + '="' + attribs[attrib_name] + '"';

        if (self_closing)
            html += ' />';
        else {
            content = typeof content === 'undefined' ? '' : content;
            html += '>' + content + '</' + name + '>' + "\r\n";
        }

        return html;
    }}

});
Header.Class.prototype = Header;
module.exports = Header;
