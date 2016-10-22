
module.exports = {
    _tplWatcher: null;

    onCreate: function(tpl)
    {
        this._tplWatcher = tpl.newWatcher();
    },

    onTplChanged: function(tpl_info) {
        this._tplWatcher.clear();

        if (!('templates' in tpl_info))
            return;



        // this.cssWatcher.clear();
        // for (var i = 0; i < tpl_info.css; i++)
        //     this.cssWatcher.add(tpl_info.css);
    },

    onBuild: function(tpl, final) {
        var css_paths = this.cssWatcher.getPaths();

        tpl.log('Styles:');
        for (var i = 0; i < css_paths.length; i++) {
            tpl.log('    - ' + css_paths[i]);
            tpl.addHeaderTag('link', {
                rel: 'stylesheet',
                href: uri + '?v=' + tpl.getVersionHash(),
                type: 'text/css'
            });
        }
    }
};

function merge_tpl_info(tpl_info)
{

}
