
var log = require("../util/log.js");

exports.handle = async function(req, ses) {
    log.debug("Next");

    return require("./continue_listing").handle(req, ses);
}