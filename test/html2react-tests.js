'use strict';

var assert = require("assert");
var React = require('react');

var Html2React = require('../index').Html2React;
var ProcessNodeDefinitions = require('../index').ProcessNodeDefinitions;

describe('Html2React', function() {
    var html2react = new Html2React(React);

    describe('parse valid HTML', function() {
        it('should return a valid HTML string', function() {
            var htmlInput = '<p>Does this work?</p>';

            var reactComponent = html2react.parse(htmlInput);
            var reactHtml = React.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlInput);
        });

        it('should return a valid HTML string with nested elements', function() {
            var htmlInput = '<div><h1>Heading</h1></div>';

            var reactComponent = html2react.parse(htmlInput);
            var reactHtml = React.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlInput);
        });

        it('should return a valid HTML string with inline styles', function() {
            var htmlInput = '<div style="background-color: red;color: white;"></div>';

            var reactComponent = html2react.parse(htmlInput);
            var reactHtml = React.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlInput);
        });

        it('should return a valid HTML string with data attributes', function() {
            var htmlInput = '<div data-test-attribute="data attribute value"></div>';

            var reactComponent = html2react.parse(htmlInput);
            var reactHtml = React.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlInput);
        });

        it('should return a valid HTML string with aria attributes', function() {
            var htmlInput = '<div aria-labelledby="label1"></div>';

            var reactComponent = html2react.parse(htmlInput);
            var reactHtml = React.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlInput);
        });

        it('should return a valid HTML string with a class attribute', function() {
            var htmlInput = '<div class="class-one"></div>';

            var reactComponent = html2react.parse(htmlInput);
            var reactHtml = React.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlInput);
        });
    });

    describe('parse invalid HTML', function() {
        it('should throw an error when trying parsing multiple root elements', function() {
            var htmlInput = '<div></div><div></div>';

            assert.throws(function() {
                html2react.parse(htmlInput);
            }, Error);
        });

        it('should throw an error with a specific message when parsing multiple root elements', function() {
            var htmlInput = '<div></div><div></div><div></div>';

            assert.throws(function() {
                html2react.parse(htmlInput);
            }, /contains 3 root elements/);
        });

        it('should fix missing closing tags', function() {
            var htmlInput = '<div><p></div>';
            var htmlExpected = '<div><p></p></div>';

            var reactComponent = html2react.parse(htmlInput);
            var reactHtml = React.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlExpected);
        });
    });
});

describe('Html2React with custom processing instructions', function() {
    var html2react = new Html2React(React);
    var processNodeDefinitions = new ProcessNodeDefinitions(React);

    describe('parse valid HTML', function() {
        it('should return nothing with only a single <p> element', function() {
            var htmlInput = '<p>Does this work?</p>';
            var isValidNode = function() {
                return true;
            };
            var processingInstructions = [{
                shouldProcessNode: function(node) {
                    return node.name && node.name !== 'p';
                },
                processNode: processNodeDefinitions.processDefaultNode
            }];
            var reactComponent = html2react.parseWithInstructions(htmlInput, isValidNode, processingInstructions);

            // With only 1 <p> element, nothing is rendered
            assert.equal(reactComponent, false);
        });

        it('should return a single <h1> element within a div of <h1> and <p> as siblings', function() {
            var htmlInput = '<div><h1>Title</h1><p>Paragraph</p></div>';
            var htmlExpected = '<div><h1>Title</h1></div>';

            var isValidNode = function() {
                return true;
            };

            var processingInstructions = [{
                shouldProcessNode: function(node) {
                    return node.type === 'text' || node.name !== 'p';
                },
                processNode: processNodeDefinitions.processDefaultNode
            }];
            var reactComponent = html2react.parseWithInstructions(htmlInput, isValidNode, processingInstructions);
            var reactHtml = React.renderToStaticMarkup(reactComponent);
            assert.equal(reactHtml, htmlExpected);
        });
    });
});

