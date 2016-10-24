
module.exports = function(xml) {
  var XMLParser = require("xmldom").DOMParser;
  return new XMLParser().parseFromString(xml);
}
