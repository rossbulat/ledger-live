"use strict";
exports.__esModule = true;
exports.getRanges = exports.getDates = exports.granularities = exports.getPortfolioRangeConfig = exports.startOfWeek = exports.startOfDay = exports.startOfMonth = exports.startOfHour = exports.weekIncrement = exports.dayIncrement = exports.hourIncrement = void 0;
exports.hourIncrement = 60 * 60 * 1000;
exports.dayIncrement = 24 * exports.hourIncrement;
exports.weekIncrement = 7 * exports.dayIncrement;
function startOfHour(t) {
    return new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours());
}
exports.startOfHour = startOfHour;
function startOfMonth(t) {
    return new Date(t.getFullYear(), t.getMonth(), 1);
}
exports.startOfMonth = startOfMonth;
function startOfDay(t) {
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}
exports.startOfDay = startOfDay;
function startOfWeek(t) {
    var d = startOfDay(t);
    return new Date(d.getTime() - d.getDay() * exports.dayIncrement);
}
exports.startOfWeek = startOfWeek;
function getPortfolioRangeConfig(r) {
    return ranges[r];
}
exports.getPortfolioRangeConfig = getPortfolioRangeConfig;
exports.granularities = {
    WEEK: {
        increment: exports.weekIncrement,
        startOf: startOfWeek,
        maxDatapoints: 1000
    },
    DAY: {
        increment: exports.dayIncrement,
        startOf: startOfDay,
        maxDatapoints: 400
    },
    HOUR: {
        increment: exports.hourIncrement,
        startOf: startOfHour,
        maxDatapoints: 8 * 24
    }
};
// TODO Protfolio: this would require to introduce Account#olderOperationDate
var ranges = {
    all: {
        increment: exports.weekIncrement,
        startOf: startOfWeek,
        granularityId: "WEEK"
    },
    year: {
        count: 52,
        increment: exports.weekIncrement,
        startOf: startOfWeek,
        granularityId: "WEEK"
    },
    month: {
        count: 30,
        increment: exports.dayIncrement,
        startOf: startOfDay,
        granularityId: "DAY"
    },
    week: {
        count: 7 * 24,
        increment: exports.hourIncrement,
        startOf: startOfHour,
        granularityId: "HOUR"
    },
    day: {
        count: 24,
        increment: exports.hourIncrement,
        startOf: startOfHour,
        granularityId: "HOUR"
    }
};
function getDates(r, count) {
    var now = new Date(Date.now());
    if (count === 1)
        return [now];
    var conf = getPortfolioRangeConfig(r);
    var last = new Date(conf.startOf(now) - 1);
    var dates = [now];
    for (var i = 0; i < count - 1; i++) {
        dates.unshift(new Date(last - conf.increment * i));
    }
    return dates;
}
exports.getDates = getDates;
function getRanges() {
    return Object.keys(ranges);
}
exports.getRanges = getRanges;
//# sourceMappingURL=rangeDates.js.map