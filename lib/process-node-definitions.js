'use strict';

var _ = require('lodash');

function createStyleJsonFromString(styleString) {
    if (_.isNull(styleString) || _.isUndefined(styleString) || styleString === '') {
        return {};
    }
    var styles = styleString.split(';');
    var singleStyle, key, value, jsonStyles = {};
    for (var i = 0; i < styles.length; i++) {
        singleStyle = styles[i].split(':');
        key = _.camelCase(singleStyle[0]);
        value = singleStyle[1];
        if (key.length > 0 && value.length > 0) {
            jsonStyles[key] = value;
        }
    }
    return jsonStyles;
}

var ProcessNodeDefinitions = function(React) {
    function processDefaultNode(node, children) {
        if (node.type === 'text') {
            return node.data;
        }
        return React.createElement(node.name, null, node.data, children);
    }

    function processNodeWithInlineStyle(node, children) {
        if (node.type === 'text') {
            return node.data;
        }

        var elementProps = {};
        if (_.has(node.attribs, 'style')) {
            elementProps.style = createStyleJsonFromString(node.attribs.style);
        }

        return React.createElement(node.name, elementProps, node.data, children);
    }

    return {
        processDefaultNode: processDefaultNode,
        processNodeWithInlineStyle: processNodeWithInlineStyle
    };
};

module.exports = ProcessNodeDefinitions;

