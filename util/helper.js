
exports.applyTo = function(f, self) {
  return function(args) {
    f.apply(self, args);
  };
};
