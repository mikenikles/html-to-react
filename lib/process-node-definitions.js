'use strict';
var ent = require('ent');
var utils = require('./utils');

// https://github.com/facebook/react/blob/15.0-stable/src/renderers/dom/shared/ReactDOMComponent.js#L457
var voidElementTags = [
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param',
    'source', 'track', 'wbr', 'menuitem', 'textarea',
];

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
        if (voidElementTags.indexOf(node.name) > -1) {
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
