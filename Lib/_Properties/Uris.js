'use strict';

var _Base = require('./_Base');


var Uris = Object.create(_Base, {

    base: { get: function() {
        return this._property_Get('base');
    }, enumerable: true },

    index: { get: function() {
        return this._property_Get('index');
    }, enumerable: true },

    front: { get: function() {
        return this._property_Get('front');
    }, enumerable: true },


    Class: { value:
    function(properties) {
        _Base.Class.call(this);

        this._properties_Update(properties);
    }},

});
Uris.Class.prototype = Uris;
module.exports = Uris;
