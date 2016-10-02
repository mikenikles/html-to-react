'use strict';
var camelize = require('underscore.string.fp/camelize');
var merge = require('ramda/src/merge');
var toPairs = require('ramda/src/toPairs');
var fromPairs = require('ramda/src/fromPairs');
var map = require('ramda/src/map');
var React = require('react');

function createStyleJsonFromString(styleString) {
    if (!styleString) {
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

function createElementProps(node, index) {
    var elementProps = {
        key: index,
    };
    if (node.attribs) {
        elementProps = merge(elementProps, fromPairs(map(function (keyAndValue) {
            var key = keyAndValue[0];
            var value = keyAndValue[1];
            if (key === 'style') {
                value = createStyleJsonFromString(node.attribs.style);
            } else if (key === 'class') {
                key = 'className';
            }
            return [key, value,];
        }, toPairs(node.attribs))));
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
