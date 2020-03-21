
var log = require("../util/log.js");

exports.handle = async function(req, ses) {
    log.debug("Previous");

    ses.toList = Math.max(0, (ses.toList || 0) - 6);
    return require("./continue_listing").handle(req, ses);
}