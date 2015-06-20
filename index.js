'use strict';

var html2react = require('./lib/html2react');
var processingInstructions = require('./lib/processing-instructions');
var isValidNodeDefinitions = require('./lib/is-valid-node-definitions');

module.exports = {
    Html2React: html2react,
    IsValidNodeDefinitions: isValidNodeDefinitions,
    ProcessingInstructions: processingInstructions
};

