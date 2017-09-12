
exports.minutesAgo = (now, minutes) => new Date(now.getTime() - (minutes * 60 * 1000));

exports.minutesAdd = (now, minutes) => new Date(now.getTime() + (minutes * 60 * 1000));
