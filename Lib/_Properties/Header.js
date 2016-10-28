'use strict';


var Header = Object.create(null, {

    html: { get: function() {
        var html = '';
        for (var i = 0; i < this._header.tags.length; i++)
            html += this._header.getTag(this._header.tags[i]);

        return html;
    }},

    tags: { get: function() {
        return this._header._html;
    }},

    _header: { value: null },


    Class: { value:
    function(header) {
        this._header = header;
    }}

});
Header.Class.prototype = Header;
module.exports = Header;
