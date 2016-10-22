'use strict';

var abTasks = require('ab-tasks');
var abWatcher = require('ab-watcher');

var ExtTpl = require('./private/ExtTpl');


var Template = {

    _exts: null,
    _abTasks: null,

    _tplInfo: null,
    _tplInfo_Watcher: null,

    /* ExtTpl Properties */
    _paths: null,
    _tasks: null,
    _uris: null,

    _exts_Create: function(ext_names)
    {
        var template = this;

        ext_names.forEach(function(ext_name) {
            var ext_class = function() {
                if (!('name' in this))
                    this.name = ext_name;
            };
            ext_class.prototype = require('ab-templates-' + ext_name);

            var ext = new ext_class();
            var ext_tpl = new ExtTpl.Class(template, ext);

            ext.onCreate(ext_tpl);
        });
    },

    _parseTplInfo: function()
    {
        var self = this;
        return new Promise(function(resolve, reject) {
            fs.readFile(self._tplPath, 'utf8', function (err, data) {
                if (err) {
                    reject(err);
                    return;
                }

                var json = null;
                try {
                    var json = JSON.parse(data);
                } catch (json_err) {
                    reject(json_err);
                }

                resolve();
            });
        });
    },

    Class: function(tpl_path, ext_names)
    {
        /* Testing */
        ext_names = [ 'css' ];

        var self = this;

        this._exts = {};
        this._abTasks = abTasks.new();

        /* ExtTpl Properties */
        /* Paths */
        this._paths = {
            front: null,
            back: null
        };

        /* Tasks */
        this._tasks = {
            build: function() {
                return self._abTasks.create('build', function() {
                    console.log('Building...');
                        })
                    .waitFor('buildHeader');
            },
            buildHeader: function() {
                return self._abTasks.create('buildHeader', function() {
                    console.log('Building...');
                });
            },
            clean: function() {
                return self._abTasks.create('clean', function() {
                    console.log('Cleaning... To Do.')
                });
            },
            parseTplInfo: function() {
                return self._abTasks.create('parseTplInfo', function() {
                    return self._parseTplInfo();
                });
            }
        };

        /* Uris */
        this._uris = {
            front: '/',
            index: '/'
        };
        /* / ExtTpl Properties */

        /* Tpl Info */
        this._tplInfo = {};
        this._tplInfo_Watcher = abWatcher.new()
            .on('add', 'change', 'unlink', function() {
                self._parseTplInfo();
            });

        /* Exts */
        this._exts_Create(ext_names);

        // this._tplInfo_Watcher.update(tpl_path);
    }

};
Template.Class.prototype = Template;
module.exports = Template;
