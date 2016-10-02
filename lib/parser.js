'use strict';
var find = require('ramda/src/find');
var reject = require('ramda/src/reject');
var addIndex = require('ramda/src/addIndex');
var map = require('ramda/src/map');
var htmlParser = require('htmlparser2');
var ProcessingInstructions = require('./processing-instructions');
var IsValidNodeDefinitions = require('./is-valid-node-definitions');
var utils = require('./utils');

var Html2ReactParser = function(options) {
    var parseHtmlToTree = function(html) {
        var handler = new htmlParser.DomHandler();
        var parser = new htmlParser.Parser(handler, options);
        parser.parseComplete(html);
        return handler.dom;
    };

    var traverseDom = function(node, isValidNode, processingInstructions, index) {
        if (isValidNode(node)) {
            var processingInstruction = find(function (processingInstruction) {
                return processingInstruction.shouldProcessNode(node);
            }, processingInstructions);
            if (processingInstruction != null) {
                var children = reject(function (x) {return x == null;},
                    addIndex(map)(function (child, i) {
                        return traverseDom(child, isValidNode, processingInstructions, i);
                    }, node.children || []));

                if (processingInstruction.replaceChildren) {
                    var elementProps = utils.createElementProps(node, index);
                    return utils.createElement(node.name, elementProps, node.data, [
                        processingInstruction.processNode(node, children, index),
                    ]);
                }

                return processingInstruction.processNode(node, children, index);
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    var parseWithInstructions = function(html, isValidNode, processingInstructions) {
        var domTree = parseHtmlToTree(html);
        // TODO: Deal with HTML that contains more than one root level node
        if (domTree && domTree.length !== 1) {
            throw new Error(
                'html-to-react currently only supports HTML with one single root element. ' +
                'The HTML provided contains ' + domTree.length +
                ' root elements. You can fix that by simply wrapping your HTML ' +
                'in a <div> element.');
        }
        return traverseDom(domTree[0], isValidNode, processingInstructions, 0);
    };

    var parse = function(html) {
        var processingInstructions = new ProcessingInstructions();
        return parseWithInstructions(html,
            IsValidNodeDefinitions.alwaysValid,
            processingInstructions.defaultProcessingInstructions);
    };

    return {
        parse: parse,
        parseWithInstructions: parseWithInstructions,
    };
};

module.exports = Html2ReactParser;
