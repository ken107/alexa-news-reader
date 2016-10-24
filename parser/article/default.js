
module.exports = function(doc) {
  return require("../../util/jquery.js").then(function($) {
    //only interested in these tags
    var tags = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "blockquote"];

    //remove unwanted elems
    $(doc).find("a > *").remove();
    $(doc).find(tags.map(tag => tag + " > div").join(", ")).remove();

    //enum text blocks
    var textBlocks = $(doc).find("p").parent().get();
    $.uniqueSort(textBlocks);

    //find longest text block
    var longest = {length: 0};
    textBlocks.forEach(block => {
      var text = $(block).children(tags.join(", ")).text();
      if (text.length > longest.length) longest = {block: block, length: text.length};
    });

    //return
    if (longest.block) {
      var elems = $(longest.block).children(tags.join(", ")).get();
      return elems.map(elem => $(elem).text().trim()).filter(text => text);
    }
    else throw new Error("No content");
  });
}
