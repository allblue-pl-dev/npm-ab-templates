'use strict';


var Layout_TextNode = {

    Parse: function(node)
    {

    },

    _Parse_ParseValue: function(value)
    {
        var matches = value.match(/{{.+?}}/g);
        console.log(matches);
    }

};
