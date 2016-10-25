
var cache = {};

exports.write = function(key, data, lastModified) {
  cache[key] = {
    data: data,
    lastModified: lastModified || new Date().getTime()
  };
}

exports.read = function(key) {
  if (!cache[key]) throw new Error("NOT_FOUND");
  return cache[key];
}
