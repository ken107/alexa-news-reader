
var XMLParser = require("xmldom").DOMParser;
var parser = new XMLParser();

exports.parse = function(xml) {
  return parser.parseFromString(xml);
}
