'use strict';

var camelCase = require('lodash.camelcase');
var forEach = require('lodash.foreach');
var includes = require('lodash.includes');
var ent = require('ent');

// https://github.com/facebook/react/blob/0.14-stable/src/renderers/dom/shared/ReactDOMComponent.js#L457
var voidElementTags = [
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'textarea',
];

function createStyleJsonFromString(styleString) {
    if (!styleString) {
        return {};
    }
    var styles = styleString.split(';');
    var singleStyle, key, value, jsonStyles = {};
    for (var i = 0; i < styles.length; i++) {
        singleStyle = styles[i].split(':');
        key = camelCase(singleStyle[0]);
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
            // FIXME: The following doesn't work as the generated HTML results in "&lt;!--  This is a comment  --&gt;"
            //return '<!-- ' + node.data + ' -->';
            return false;
        }

        var elementProps = {
            key: index,
        };
        // Process attributes
        if (node.attribs) {
            forEach(node.attribs, function(value, key) {
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
            });
        }

        if (includes(voidElementTags, node.name)) {
            return React.createElement(node.name, elementProps)
        } else {
        return React.createElement(node.name, elementProps, node.data, children);
    }

    }

    return {
        processDefaultNode: processDefaultNode
    };
};

module.exports = ProcessNodeDefinitions;
