'use strict';

var ProcessingInstructions = function(React) {
    function shouldProcessEveryNode(node) {
        return true;
    }

    function processDefaultNode(node, children) {
        if (node.type === 'text') {
            return node.data;
        }
        return React.createElement(node.name, null, node.data, children);
    }

    return {
        defaultProcessingInstructions: [{
            shouldProcessNode: shouldProcessEveryNode,
            processNode: processDefaultNode
        }]
    };
};

module.exports = ProcessingInstructions;

