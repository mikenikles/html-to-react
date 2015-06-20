'use strict';

var html2react = require('./lib/html2react');
var processingInstructions = require('./lib/processing-instructions');
var isValidNodeDefinitions = require('./lib/is-valid-node-definitions');
var processNodeDefinitions = require('./lib/process-node-definitions');

module.exports = {
    Html2React: html2react,
    ProcessingInstructions: processingInstructions,
    IsValidNodeDefinitions: isValidNodeDefinitions,
    ProcessNodeDefinitions: processNodeDefinitions,
};

