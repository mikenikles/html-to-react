'use strict';

var S = require('underscore.string.fp');
var R = require('ramda');
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
    function processDefaultNode(node, children, index) {
        if (node.type === 'text') {
            return ent.decode(node.data);
        } else if (node.type === 'comment') {
            // FIXME: The following doesn't work as the generated HTML results in
            // "&lt;!--  This is a comment  --&gt;"
            //return '<!-- ' + node.data + ' -->';
            return false;
        }

        var elementProps = {
            key: index,
        };
        // Process attributes
        if (node.attribs) {
            R.forEach(function(value, key) {
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

        if (node.name === 'br') {
            // Avoid specifying children as otherwise React will add a bogus child array to the
            // element, which causes warnings further down the chain
            return React.createElement(node.name, elementProps);
        } else {
            return React.createElement(node.name, elementProps, node.data, children);
        }
    }

    return {
        processDefaultNode: processDefaultNode,
    };
};

module.exports = ProcessNodeDefinitions;
