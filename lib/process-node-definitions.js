'use strict';
var isEmpty = require('ramda/src/isEmpty');
var merge = require('ramda/src/merge');
var fromPairs = require('ramda/src/fromPairs');
var map = require('ramda/src/map');
var toPairs = require('ramda/src/toPairs');
var contains = require('ramda/src/contains');
var concat = require('ramda/src/concat');
var camelize = require('underscore.string.fp/camelize');
var isBlank = require('underscore.string.fp/isBlank');
var ent = require('ent');
var camelCaseAttrMap = require('./camel-case-attribute-names');
var utils = require('./utils');

// https://github.com/facebook/react/blob/15.0-stable/src/renderers/dom/shared/ReactDOMComponent.js#L457
var voidElementTags = [
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param',
    'source', 'track', 'wbr', 'menuitem', 'textarea',
];

function createStyleJsonFromString(styleString) {
    if (isBlank(styleString)) {
        return {};
    }
    var styles = styleString.split(';');
    var singleStyle, key, value, jsonStyles = {};
    for (var i = 0; i < styles.length; i++) {
        singleStyle = styles[i].split(':');
        key = camelize(singleStyle[0]);
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
            // return '<!-- ' + node.data + ' -->';
            return false;
        }

        var elementProps = utils.createElementProps(node, index);
        // Process attributes
        if (!isEmpty(node.attribs)) {
            elementProps = merge(elementProps, fromPairs(map(function (keyAndValue) {
                var key = keyAndValue[0];
                var value = keyAndValue[1];
                if (key === 'style') {
                    value = createStyleJsonFromString(node.attribs.style);
                } else if (key === 'class') {
                    key = 'className';
                } else if (camelCaseAttrMap[key]) {
                    key = camelCaseAttrMap[key];
                }

                if (isBlank(value)) {
                    // Handle boolean attributes - if their value isn't explicitly supplied,
                    // define it as the attribute name (e.g. disabled="disabled")
                    value = key;
                }

                return [key, value,];
            }, toPairs(node.attribs))));
        }

        if (contains(node.name, voidElementTags)) {
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
