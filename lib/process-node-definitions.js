'use strict';

var R = require('ramda');
var S = require('underscore.string.fp');
var ent = require('ent');
var camelCaseAttrMap = require('./camel-case-attribute-names');

// https://github.com/facebook/react/blob/15.0-stable/src/renderers/dom/shared/ReactDOMComponent.js#L457
var voidElementTags = [
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param',
    'source', 'track', 'wbr', 'menuitem', 'textarea',
];

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
            // FIXME: The following doesn't work as the generated HTML results in "&lt;!--  This is a comment  --&gt;"
            //return '<!-- ' + node.data + ' -->';
            return false;
        }

        var elementProps = {
            key: index,
        };
        // Process attributes
        if (!R.isEmpty(node.attribs)) {
            elementProps = R.merge(elementProps, R.fromPairs(R.map(function (keyAndValue) {
                var key = keyAndValue[0];
                var value = keyAndValue[1];
                switch (key || '') {
                    case 'style':
                        value = createStyleJsonFromString(node.attribs.style);
                        break;
                    case 'class':
                        key = 'className';
                        break;
                    default:
                        break;
                }

                return [key, value,];
            }, R.toPairs(node.attribs))));
        }

        if (R.contains(node.name, voidElementTags)) {
            return React.createElement(node.name, elementProps)
        } else {
            var allChildren = node.data != null ? R.concat([node.data,], children) : children;
            return React.createElement.apply(null, R.concat([node.name, elementProps,],
                allChildren));
        }
    }

    return {
        processDefaultNode: processDefaultNode,
    };
};

module.exports = ProcessNodeDefinitions;
