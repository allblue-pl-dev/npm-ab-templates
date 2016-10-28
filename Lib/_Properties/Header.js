'use strict';


var Header = Object.create(null, {

    html: { get: function() {
        var html = '';
        for (var i = 0; i < this._header._tags.length; i++)
            html += this._header._tags[i].html + '\r\n';

        return html;
    }},

    tags: { get: function() {
        return this._header._html;
    }},

    _header: { value: null, writable: true },


    Class: { value:
    function() {
    }}

});
Header.Class.prototype = Header;
module.exports = Header;
