
var cache = {};

exports.write = function(key, data) {
  cache[key] = {
    data: data,
    lastModified: new Date().getTime()
  };
  return Promise.resolve();
}

exports.read = function(key) {
  return Promise.resolve(cache[key]);
}
