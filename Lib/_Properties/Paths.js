'use strict';

var fs = require('fs');

var _Base = require('./_Base');


var Paths = Object.create(_Base, {

    index: { get: function() {
        return this._property_Get('index');
    }, enumerable: true },

    front: { get: function() {
        return this._property_Get('front');
    }, enumerable: true },

    back: { get: function() {
        return this._property_Get('back');
    }, enumerable: true },


    Class: { value:
    function(properties) {
        _Base.Class.call(this);

        this._properties_Update(properties);
    }}

});
Paths.Class.prototype = Paths;
module.exports = Paths;
