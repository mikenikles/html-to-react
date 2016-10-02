'use strict';
var isEmpty = require('lodash.isempty');
var map = require('lodash.map');
var fromPairs = require('lodash.frompairs');
var camelCase = require('lodash.camelcase');
var includes = require('lodash.includes');
var merge = require('lodash.merge');
var ent = require('ent');
var camelCaseAttrMap = require('./camel-case-attribute-names');
var utils = require('./utils');

// https://github.com/facebook/react/blob/15.0-stable/src/renderers/dom/shared/ReactDOMComponent.js#L457
var voidElementTags = [
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param',
    'source', 'track', 'wbr', 'menuitem', 'textarea',
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

var ProcessNodeDefinitions = function() {
    function processDefaultNode(node, children, index) {
        if (node.type === 'text') {
            return ent.decode(node.data);
        } else if (node.type === 'comment') {
            // FIXME: The following doesn't work as the generated HTML results in
            // "&lt;!--  This is a comment  --&gt;"
            //return '<!-- ' + node.data + ' -->';
            return false;
        }

        var elementProps = utils.createElementProps(node, index);
        // Process attributes
        if (!isEmpty(node.attribs)) {
            elementProps = merge(elementProps, fromPairs(map(node.attribs, function (value, key) {
                if (key === 'style') {
                    value = createStyleJsonFromString(node.attribs.style);
                } else if (key === 'class') {
                    key = 'className';
                } else if (camelCaseAttrMap[key]) {
                    key = camelCaseAttrMap[key];
                }

                return [key, value || key,];
            })));
        }

        if (includes(voidElementTags, node.name)) {
            return utils.createElement(node.name, elementProps);
        } else {
            return utils.createElement(node.name, elementProps, node.data, children);
        }
    }

    return {
        processDefaultNode: processDefaultNode,
    };
};

module.exports = ProcessNodeDefinitions;
