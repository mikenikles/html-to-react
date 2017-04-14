'use strict';
var find = require('ramda/src/find');
var reject = require('ramda/src/reject');
var addIndex = require('ramda/src/addIndex');
var map = require('ramda/src/map');
var HtmlParser = require('htmlparser2/lib/Parser');
var DomHandler = require('domhandler');
var ProcessingInstructions = require('./processing-instructions');
var IsValidNodeDefinitions = require('./is-valid-node-definitions');
var utils = require('./utils');

function Html2ReactParser(options) {
  function parseHtmlToTree(html) {
    options = options || {};
    options.decodeEntities = true;
    var handler = new DomHandler();
    var parser = new HtmlParser(handler, options);
    parser.parseComplete(html);
    return handler.dom;
  };

  function traverseDom(node, isValidNode, processingInstructions, index) {
    if (isValidNode(node)) {
      var processingInstruction = find(function (processingInstruction) {
        return processingInstruction.shouldProcessNode(node);
      }, processingInstructions);
      if (processingInstruction != null) {
        var children = reject(function (x) {return x == null || x === false;},
          addIndex(map)(function (child, i) {
            return traverseDom(child, isValidNode, processingInstructions, i);
          }, node.children || []));

        if (processingInstruction.replaceChildren) {
          return utils.createElement(node, index, node.data, [
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

  function parseWithInstructions(html, isValidNode, processingInstructions) {
    var domTree = parseHtmlToTree(html);

    var list = domTree.map(function (domTreeItem, index) {
      return traverseDom(domTreeItem, isValidNode, processingInstructions, index);
    });
    return list.length <= 1 ? list[0] : list;
  };

  function parse(html) {
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
