'use strict';

var _Base = require('./_Base');


var Build = Object.create(_Base, {

    final: { get: function() {
        return this._property_Get('final');
    }, enumerable: true },

    hash: { get: function() {
        return this._property_Get('hash');
    }, enumerable: true },


    Class: { value:
    function(properties) {
        _Base.Class.call(this);

        this._property_Set('hash', this._generateHash());
        this._properties_Update(properties);
    }},

    _generateHash: { value:
    function() {
        var version_hash = '';

        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
                'abcdefghijklmnopqrstuvwxyz' + '0123456789';

        for (var i=0; i < 10; i++) {
            version_hash += chars.charAt(Math.floor(
                    Math.random() * chars.length));
        }

        return version_hash;
    }}

});
Build.Class.prototype = Build;
module.exports = Build;
