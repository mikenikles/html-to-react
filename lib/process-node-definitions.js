'use strict';

var includes = require('lodash.includes');
var ent = require('ent');
var utils = require('./utils');

// https://github.com/facebook/react/blob/0.14-stable/src/renderers/dom/shared/ReactDOMComponent.js#L457
var voidElementTags = [
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'textarea',
];

var ProcessNodeDefinitions = function(React) {
    function processDefaultNode(node, children, index) {
        if (node.type === 'text') {
            return ent.decode(node.data);
        } else if (node.type === 'comment') {
            // FIXME: The following doesn't work as the generated HTML results in "&lt;!--  This is a comment  --&gt;"
            //return '<!-- ' + node.data + ' -->';
            return false;
        }

        var elementProps = utils.createElementProps(node, index);

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
