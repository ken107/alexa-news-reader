
exports.spread = function(f, self) {
  return function(args) {
    return f.apply(self, args);
  };
};
