
exports.minutesAgo = function (now, minutes) {
  return new Date(now.getTime() - minutes * 60 * 1000);
};

exports.minutesAdd = function (now, minutes) {
  return new Date(now.getTime() + minutes * 60 * 1000);
};
