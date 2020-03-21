
var log = require("../util/log.js");

exports.handle = async function(req, ses) {
    log.debug("Repeat");

    return ses.lastResponse || require("./launch").handle(req, ses);
}