'use strict';

var assert = require('assert');
var React = require('react');
var ReactDOMServer = require('react-dom/server')
var _ = require('lodash');

var Parser = require('../index').Parser;
var ProcessNodeDefinitions = require('../index').ProcessNodeDefinitions;

describe('Html2React', function() {
    var parser = new Parser(React);

    describe('parse valid HTML', function() {
        it('should return a valid HTML string', function() {
            var htmlInput = '<p>Does this work?</p>';

            var reactComponent = parser.parse(htmlInput);
            var reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlInput);
        });

        it('should return a valid HTML string with nested elements', function() {
            var htmlInput = '<div><h1>Heading</h1></div>';

            var reactComponent = parser.parse(htmlInput);
            var reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlInput);
        });

        it('should return a valid HTML string with inline styles', function() {
            var htmlInput = '<div style="background-color: red;color: white;"></div>';

            var reactComponent = parser.parse(htmlInput);
            var reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlInput);
        });

        it('should return a valid HTML string with empty inline styles', function() {
            var htmlInput = '<div style=""></div>';
            var htmlExpected = '<div></div>';

            var reactComponent = parser.parse(htmlInput);
            var reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlExpected);
        });

        it('should return a valid HTML string with data attributes', function() {
            var htmlInput = '<div data-test-attribute="data attribute value"></div>';

            var reactComponent = parser.parse(htmlInput);
            var reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlInput);
        });

        it('should return a valid HTML string with aria attributes', function() {
            var htmlInput = '<div aria-labelledby="label1"></div>';

            var reactComponent = parser.parse(htmlInput);
            var reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlInput);
        });

        it('should return a valid HTML string with a class attribute', function() {
            var htmlInput = '<div class="class-one"></div>';

            var reactComponent = parser.parse(htmlInput);
            var reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlInput);
        });

        // FIXME: See lib/process-node-definitions.js -> processDefaultNode()
        it.skip('should return a valid HTML string with comments', function() {
            var htmlInput = '<div><!-- This is a comment --></div>';

            var reactComponent = parser.parse(htmlInput);
            var reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlInput);
        });

        // FIXME: If / when React implements HTML comments, this test can be removed
        it('should return a valid HTML string without comments', function() {
            var htmlInput = '<div><!-- This is a comment --></div>';
            var htmlExpected = '<div></div>';

            var reactComponent = parser.parse(htmlInput);
            var reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlExpected);
        });

        it('should parse br elements without warnings', function() {
            var htmlInput = '<div><p>Line one<br>Line two<br/>Line three</p></div>';
            var htmlExpected = '<div><p>Line one<br/>Line two<br/>Line three</p></div>';

            var reactComponent = parser.parse(htmlInput);
            var reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlExpected);
        });

        it('should not generate children for br tags', function() {
            var htmlInput = '<br/>';

            var reactComponent = parser.parse(htmlInput);
            assert.strictEqual((reactComponent.props.children || []).length, 0);
         });

        it('should parse void elements with all attributes and no warnings', function() {
            var htmlInput = '<p><img src="www.google.ca/logo.png"/></p>';

            var reactComponent = parser.parse(htmlInput);
            var reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlInput);
        });

        // Covers issue #9
        it('should parse textarea elements', function() {
            var htmlInput = '<textarea></textarea>';

            var reactComponent = parser.parse(htmlInput);
            var reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlInput);
        });

        it('should decode character entities in text nodes', function () {
            var htmlInput = '<div>1 &lt; 2</div>';

            var reactComponent = parser.parse(htmlInput);
            var reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlInput);
        });
    });

    describe('parse invalid HTML', function() {
        it('should throw an error when trying parsing multiple root elements', function() {
            var htmlInput = '<div></div><div></div>';

            assert.throws(function() {
                parser.parse(htmlInput);
            }, Error);
        });

        it('should throw an error with a specific message when parsing multiple root elements', function() {
            var htmlInput = '<div></div><div></div><div></div>';

            assert.throws(function() {
                parser.parse(htmlInput);
            }, /contains 3 root elements/);
        });

        it('should fix missing closing tags', function() {
            var htmlInput = '<div><p></div>';
            var htmlExpected = '<div><p></p></div>';

            var reactComponent = parser.parse(htmlInput);
            var reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);

            assert.equal(reactHtml, htmlExpected);
        });
    });

    describe('with custom processing instructions', function() {
        var parser = new Parser(React);
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
                var reactComponent = parser.parseWithInstructions(htmlInput, isValidNode, processingInstructions);

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
                var reactComponent = parser.parseWithInstructions(htmlInput, isValidNode, processingInstructions);
                var reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);
                assert.equal(reactHtml, htmlExpected);
            });

            it('should replace the children of an element', function() {
                var htmlInput = '<div><div data-test="foo"><p>Text</p><p>Text</p></div></div>';
                var htmlExpected = '<div><div data-test="foo"><h1>Heading</h1></div></div>';

                var isValidNode = function() {
                    return true;
                };

                var processingInstructions = [{
                    replaceChildren: true,
                    shouldProcessNode: function(node) {
                        return node.attribs && node.attribs['data-test'] === 'foo';
                    },
                    processNode: function(node, children, index) {
                        return React.createElement('h1', { key: index }, 'Heading');
                    }
                },
                {
                    // Anything else
                    shouldProcessNode: function(node) {
                        return true;
                    },
                    processNode: processNodeDefinitions.processDefaultNode
                }];

                var reactComponent = parser.parseWithInstructions(htmlInput, isValidNode, processingInstructions);
                var reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);
                assert.equal(reactHtml, htmlExpected);
            });

            it('should return capitalized content for all <h1> elements', function() {
                var htmlInput = '<div><h1>Title</h1><p>Paragraph</p><h1>Another title</h1></div>';
                var htmlExpected = '<div><h1>TITLE</h1><p>Paragraph</p><h1>ANOTHER TITLE</h1></div>';

                var isValidNode = function() {
                    return true;
                };

                var processingInstructions = [
                    {
                        // Custom <h1> processing
                        shouldProcessNode: function(node) {
                            return node.parent && node.parent.name && node.parent.name === 'h1';
                        },
                        processNode: function(node, children) {
                            return node.data.toUpperCase();
                        }
                    }, {
                        // Anything else
                        shouldProcessNode: function(node) {
                            return true;
                        },
                        processNode: processNodeDefinitions.processDefaultNode
                    }];
                var reactComponent = parser.parseWithInstructions(htmlInput, isValidNode, processingInstructions);
                var reactHtml = ReactDOMServer.renderToStaticMarkup(reactComponent);
                assert.equal(reactHtml, htmlExpected);
            });

            it('should generate keys for sequence items', function () {
                var htmlInput = '<ul><li>Item 1</li><li>Item 2</li><</ul>';

                var reactComponent = parser.parse(htmlInput);

                var children = _.filter(_.flatten(reactComponent.props.children), function (c) {
                  return _.has(c, 'key');
                });
                var keys = _.map(children, function (child) {
                  return child.key;
                });
                assert.deepStrictEqual(keys, ['0', '1', ]);
            });

            it('should return false in case of invalid node', function() {
                var htmlInput = '<p></p>';
                var processingInstructions = [{
                    shouldProcessNode: function(node) { return true; },
                    processNode: processNodeDefinitions.processDefaultNode,
                }, ];
                var reactComponent = parser.parseWithInstructions(htmlInput,
                    function () { return false }, processingInstructions);

                assert.equal(reactComponent, false);
            });
        });
    });
});
