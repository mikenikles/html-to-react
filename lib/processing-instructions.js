'use strict';

var ShouldProcessNodeDefinitions = require('./should-process-node-definitions');
var ProcessNodeDefinitions = require('./process-node-definitions');

var ProcessingInstructions = function(React) {
    var processNodeDefinitions = new ProcessNodeDefinitions(React);

    return {
        defaultProcessingInstructions: [{
            shouldProcessNode: ShouldProcessNodeDefinitions.shouldProcessEveryNode,
            processNode: processNodeDefinitions.processDefaultNode
        }],
        defaultProcessingInstructionsWithInlineStyle: [{
            shouldProcessNode: ShouldProcessNodeDefinitions.shouldProcessEveryNode,
            processNode: processNodeDefinitions.processNodeWithInlineStyle
        }],
        defaultProcessingInstructionsWithDataAttribtues: [{
            shouldProcessNode: ShouldProcessNodeDefinitions.shouldProcessEveryNode,
            processNode: processNodeDefinitions.processNodeWithDataAttributes
        }]
    };
};

module.exports = ProcessingInstructions;

