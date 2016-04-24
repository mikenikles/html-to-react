'use strict';

var R = require('ramda');
var S = require('underscore.string.fp');
var ent = require('ent');

function createStyleJsonFromString(styleString) {
    if (S.isBlank(styleString)) {
        return {};
    }
    var styles = styleString.split(';');
    var singleStyle, key, value, jsonStyles = {};
    for (var i = 0; i < styles.length; i++) {
        singleStyle = styles[i].split(':');
        key = S.camelize(singleStyle[0]);
        value = singleStyle[1];
        if (key.length > 0 && value.length > 0) {
            jsonStyles[key] = value;
        }
    }
    return jsonStyles;
}

var ProcessNodeDefinitions = function(React) {
    var index = 0;

    function processDefaultNode(node, children) {
        if (node.type === 'text') {
            return ent.decode(node.data);
        } else if (node.type === 'comment') {
            // FIXME: The following doesn't work as the generated HTML results in "&lt;!--  This is a comment  --&gt;"
            //return '<!-- ' + node.data + ' -->';
            return false;
        }

        var elementProps = {
            key: ++index,
        };
        // Process attributes
        if (node.attribs) {
            R.forEach(function (value, key) {
                switch (key || '') {
                    case 'style':
                        elementProps.style = createStyleJsonFromString(node.attribs.style);
                        break;
                    case 'class':
                        elementProps.className = value;
                        break;
                    default:
                        elementProps[key] = value;
                        break;
                }
            }, node.attribs);
        }

        return React.createElement(node.name, elementProps, node.data, children);
    }

    return {
        processDefaultNode: processDefaultNode,
    };
};

module.exports = ProcessNodeDefinitions;
