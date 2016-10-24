
exports.write = function(key, body) {
  cache[key] = {
    Body: body,
    LastModified: new Date().toISOString()
  };
  return Promise.resolve(null);
}

exports.read = function(key) {
  return Promise.resolve(cache[key]);
}
