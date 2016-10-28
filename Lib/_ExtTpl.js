'use strict';

var chalk = require('chalk');


var ExtTpl = Object.create(null, {

    /* Properties */
    build: { get: function() {
        return this._template._build;
    }},

    paths: { get: function() {
        return this._template._paths;
    }},

    tasks: { get: function() {
        return this._template._tasks;
    }},

    uris: { get: function() {
        return this._template._uris;
    }},

    header: { get: function() {
        return this._template._header;
    }},
    /* / Properties */

    _logPrefix: { get: function() {
        return chalk.magenta(this._ext.name + ':  ');
    }},


    Class: { value:
    function(template, ext) {
        Object.defineProperties(this, {
            _template: { value: template },
            _ext: { value: ext },
        })

        var self = this;

        // /* Template Properties */
        // var properties = [ 'build', 'paths', 'uris', 'tasks', 'header' ];
        // properties.forEach(function(property_name) {
        //     Object.defineProperty(self, property_name, {
        //         value: {}, enumerable: true
        //     });
        //
        //     Object.keys(self._template['_' + property_name]).forEach(
        //             function(subproperty_name) {
        //         Object.defineProperty(self[property_name], subproperty_name, {
        //             get: function() {
        //                 return self._template['_' + property_name][subproperty_name];
        //             }, enumerable: true
        //         });
        //     });
        // });
    }},

    color: { value:
    function(color) {
        var args = [ this._logPrefix ];
        for (var i = 1; i < arguments.length; i++)
            args.push(chalk[color](arguments[i]));

        console.log.apply(console, args);
    }},

    error: { value:
    function() {
        var args = [ 'red' ];
        for (var i in arguments)
            args.push(arguments[i]);

        this.color.apply(this, args);
    }},

    getUri: { value:
    function(fs_path) {
        return this._template._getUri(fs_path);
    }},

    log: { value:
    function() {
        var args = [ this._logPrefix ];
        for (var i = 0; i < arguments.length; i++)
            args.push(arguments[i]);

        console.log.apply(console, args);
    }},

    success: { value:
    function() {
        var args = [ 'green' ];
        for (var i in arguments)
            args.push(arguments[i]);

        this.color.apply(this, args);
    }},

    task: { value:
    function() {
        var args = [];
        for (var i in arguments)
            args.push(arguments[i]);

        return this._template._abTasks.create.apply(this._template._tasks, args);
    }},

    warn: { value:
    function() {
        var args = [ 'yellow' ];
        for (var i in arguments)
            args.push(arguments[i]);

        this.color.apply(this, args);
    }}

});
ExtTpl.Class.prototype = ExtTpl;
module.exports = ExtTpl;
