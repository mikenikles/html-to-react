'use strict';

var forEach = require('lodash.foreach');
var compact = require('lodash.compact');
var htmlParser = require('htmlparser2');
var ProcessingInstructions = require('./processing-instructions');
var IsValidNodeDefinitions = require('./is-valid-node-definitions');

var Html2React = function(React) {
    var parseHtmlToTree = function(html) {
        var handler = new htmlParser.DomHandler();
        var parser = new htmlParser.Parser(handler);
        parser.parseComplete(html);
        return handler.dom;
    };

    var traverseDom = function(node, isValidNode, processingInstructions) {
        if (isValidNode(node)) {
            var children = [];
            forEach(node.children, function(child) {
                children.push(traverseDom(child, isValidNode, processingInstructions));
            });
            compact(children); // Remove invalid nodes
            for (var index = 0; index < processingInstructions.length; index++) {
                var processingInstruction = processingInstructions[index];
                if (processingInstruction.shouldProcessNode(node)) {
                    return processingInstruction.processNode(node, children);
                }
            }
        }
        return false;
    };

    var parseWithInstructions = function(html, isValidNode, processingInstructions) {
        var domTree = parseHtmlToTree(html);
        // TODO: Deal with HTML that contains more than one root level node
        if (domTree && domTree.length !== 1) {
            throw new Error('html-to-react currently only supports HTML with one single root element. ' +
            'The HTML provided contains ' + domTree.length + ' root elements. You can fix that by simply wrapping your HTML ' +
            'in a <div> element.');
        }
        return traverseDom(domTree[0], isValidNode, processingInstructions);
    };

    var parse = function(html) {
        var processingInstructions = new ProcessingInstructions(React);
        return parseWithInstructions(html,
            IsValidNodeDefinitions.alwaysValid,
            processingInstructions.defaultProcessingInstructions);
    };

    return {
        parse: parse,
        parseWithInstructions: parseWithInstructions
    };
};

module.exports = Html2React;
