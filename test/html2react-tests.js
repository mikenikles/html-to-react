'use strict';

var assert = require("assert");
var React = require('react');

var Html2React = require('../index').Html2React;
var ProcessingInstructions = require('../index').ProcessingInstructions;
var IsValidNodeDefinitions = require('../index').IsValidNodeDefinitions;

describe('Html2React', function() {
    var html2react = new Html2React(React);
    var processingInstructions = new ProcessingInstructions(React);

    describe('parse valid HTML', function() {
        it('should return a valid HTML string', function() {
            var htmlInput = '<div>Does this work?</div>';

            var reactComponent = html2react.parse(htmlInput,
                IsValidNodeDefinitions.isAlwaysValidNode, processingInstructions.defaultProcessingInstructions);
            var reactHtml = React.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlInput);
        });

        it('should return a valid HTML string with nested elements', function() {
            var htmlInput = '<div><h1>Heading</h1></div>';

            var reactComponent = html2react.parse(htmlInput,
                IsValidNodeDefinitions.isAlwaysValidNode, processingInstructions.defaultProcessingInstructions);
            var reactHtml = React.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlInput);
        });

        it.skip('should return a valid HTML string with data attributes', function() {
            var htmlInput = '<div data-wrapping-attribute="wrapping"></div>';

            var reactComponent = html2react.parse(htmlInput,
                IsValidNodeDefinitions.isAlwaysValidNode, processingInstructions.defaultProcessingInstructions);
            var reactHtml = React.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlInput);
        });

        it.skip('should return a valid HTML string with inline styles', function() {
            var htmlInput = '<div style="background-color: red; color: white;"></div>';

            var reactComponent = html2react.parse(htmlInput,
                IsValidNodeDefinitions.isAlwaysValidNode, processingInstructions.defaultProcessingInstructions);
            var reactHtml = React.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlInput);
        });
    });
});

