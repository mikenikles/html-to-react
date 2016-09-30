'use strict';

var ShouldProcessNodeDefinitions = require('./should-process-node-definitions');
var ProcessNodeDefinitions = require('./process-node-definitions');

var ProcessingInstructions = function() {
    var processNodeDefinitions = new ProcessNodeDefinitions();

    return {
        defaultProcessingInstructions: [{
            shouldProcessNode: ShouldProcessNodeDefinitions.shouldProcessEveryNode,
            processNode: processNodeDefinitions.processDefaultNode,
        },],
    };
};

module.exports = ProcessingInstructions;
