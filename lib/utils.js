'use strict';
var camelize = require('underscore.string.fp/camelize');
var toPairs = require('ramda/src/toPairs');
var reduce = require('ramda/src/reduce');
var React = require('react');
var camelCaseAttrMap = require('./camel-case-attribute-names');

function createStyleJsonFromString(styleString) {
  if (!styleString) {
    return {};
  }
  var styles = styleString.split(';');
  var singleStyle, key, value, jsonStyles = {};
  for (var i = 0; i < styles.length; i++) {
    singleStyle = styles[i].split(':');
    key = camelize(singleStyle[0]);
    value = singleStyle[1];
    if (key.length > 0 && value.length > 0) {
      jsonStyles[key] = value;
    }
  }
  return jsonStyles;
}

function createElement(node, index, data, children) {
  var elementProps = {
    key: index,
  };
  if (node.attribs) {
    elementProps = reduce(function(result, keyAndValue) {
      var key = keyAndValue[0];
      var value = keyAndValue[1];
      key = camelCaseAttrMap[key.replace(/[-:]/, '')] || key;
      if (key === 'style') {
        value = createStyleJsonFromString(value);
      } else if (key === 'class') {
        key = 'className';
      }
      result[key] = value || key;
      return result;
    }, elementProps, toPairs(node.attribs));
  }

  children = children || [];
  var allChildren = data != null ? [data,].concat(children) : children;
  return React.createElement.apply(
    null, [node.name, elementProps,].concat(allChildren)
  );
}

module.exports = {
  createElement: createElement,
};
