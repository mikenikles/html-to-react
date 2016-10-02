'use strict';
var camelCase = require('lodash.camelcase');
var forEach = require('lodash.foreach');
var includes = require('lodash.includes');
var React = require('react');

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

function createElementProps(node, index) {
    var elementProps = {
        key: index,
    };
    if (node.attribs) {
        forEach(node.attribs, function (value, key) {
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

    return elementProps;
}

function createElement(name, elementProps, data, children) {
    children = children || [];
    var allChildren = data != null ? [data,].concat(children) : children;
    return React.createElement.apply(
        null, [name, elementProps,].concat(allChildren)
    );
}

module.exports = {
    createElementProps: createElementProps,
    createElement: createElement,
};
