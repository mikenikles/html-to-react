'use strict';

var _ = require('lodash');
var htmlparser = require('htmlparser2');

var Html2React = function(React) {
    var parseHtmlToTree = function(html) {
        var handler = new htmlparser.DomHandler();
        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(html);
        return handler.dom;
    };

    var traverseDom = function(node, isValidNode, processingInstructions) {
        if (isValidNode(node)) {
            var children = [];
            _.each(node.children, function(child) {
                children.push(traverseDom(child, isValidNode, processingInstructions));
            });
            _.compact(children); // Remove invalid nodes
            for (var index = 0; index < processingInstructions.length; index++) {
                var processingInstruction = processingInstructions[index];
                if (processingInstruction.shouldProcessNode(node)) {
                    return processingInstruction.processNode(node, children);
                }
            }
        }
        return false;
    };

    var parse = function(html, isValidNode, processingInstructions) {
        var domTree = parseHtmlToTree(html);
        // TODO: Deal with HTML that contains more than one root level node
        if (domTree && domTree.length !== 1) {
            throw new Error('html2react currently only supports HTML with one single root element.' +
            'The HTML provided contains %s root elements. You can fix that by simply wrapping your HTML' +
            'in a <div> element', domTree.length);
        }
        return traverseDom(domTree[0], isValidNode, processingInstructions);
    };

    return {
        parse: parse
    };
};

module.exports = Html2React;

