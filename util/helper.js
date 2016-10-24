
exports.expand = function(f, self) {
  return function(args) {
    f.apply(self, args);
  };
};
