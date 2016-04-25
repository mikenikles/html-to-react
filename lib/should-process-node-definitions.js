'use strict';

function shouldProcessEveryNode(node) {
    return true;
}

function shouldProcessEveryNodeExceptWhiteSpace(node) {
    return node.type !== 'text' || node.data.trim();
}

module.exports = {
    shouldProcessEveryNode: shouldProcessEveryNode,
    shouldProcessEveryNodeExceptWhiteSpace: shouldProcessEveryNodeExceptWhiteSpace
};
