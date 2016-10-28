'use strict';


var _Base = Object.create(null, {

    Class: { value:
    function() {
        Object.defineProperties(this, {
            _properties: { value: {} }
        });

        for (var property_name in this) {
            this._properties[property_name] = null;
        }
    }},

    _property_Get: { value:
    function(property_name) {
        if (!(property_name in this._properties))
            throw new Error('Property `' + property_name + '` does not exist.');

        if (this._properties[property_name] === null)
            throw new Error('Property `' + property_name + '` not set.');

        return this._properties[property_name];
    }},

    _property_Set: { value:
    function(property_name, value) {
        if (!(property_name in this._properties))
            throw new Error('Property `' + property_name + '` does not exist.');

        this._properties[property_name] = value;
    }},

    _properties_Update: { value:
    function(properties) {
        for (var property_name in properties)
            this._property_Set(property_name, properties[property_name]);
    }}

});
_Base.Class.prototype = _Base;
module.exports = _Base;
