'use strict';


var Header = Object.create(null, {

    _tags: { value: null, writable: true },

    Class: { value:
    function() {
        this._tags = [];
    }},

    addTag: { value:
    function(name, attribs, content) {
        this._tags.push(new Header.Tag.Class(name, attribs, content));
    }},


    Tag: { value: Object.create(null, {

        name: { value: '', writable: true },
        attribs: { value: null, writable: true },
        content: { value: '', writable: true },

        html: { get: function() {
            var html = '<' + this.name;
            for (var attrib_name in this.attribs)
                html += ' ' + attrib_name + '="' + this.attribs[attrib_name] + '"';

            if (this.content === null)
                html += ' />';
            else
                html += '>' + this.content + '</' + this.name + '>' + "\r\n";

            return html;
        }},

        Class: { value:
        function(name, attribs, content) {
            this.name = name,
            this.attribs = JSON.parse(JSON.stringify(attribs));
            this.content = typeof content === 'undefined' ? null : content;

            Object.freeze(this.attribs);
        }}

    })}

});
Header.Class.prototype = Header;
Header.Tag.Class.prototype = Header.Tag;
module.exports = Header;
