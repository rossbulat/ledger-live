export var hourIncrement = 60 * 60 * 1000;
export var dayIncrement = 24 * hourIncrement;
export var weekIncrement = 7 * dayIncrement;
export function startOfHour(t) {
    return new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours());
}
export function startOfMonth(t) {
    return new Date(t.getFullYear(), t.getMonth(), 1);
}
export function startOfDay(t) {
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}
export function startOfWeek(t) {
    var d = startOfDay(t);
    return new Date(d.getTime() - d.getDay() * dayIncrement);
}
export function getPortfolioRangeConfig(r) {
    return ranges[r];
}
export var granularities = {
    WEEK: {
        increment: weekIncrement,
        startOf: startOfWeek,
        maxDatapoints: 1000
    },
    DAY: {
        increment: dayIncrement,
        startOf: startOfDay,
        maxDatapoints: 400
    },
    HOUR: {
        increment: hourIncrement,
        startOf: startOfHour,
        maxDatapoints: 8 * 24
    }
};
// TODO Protfolio: this would require to introduce Account#olderOperationDate
var ranges = {
    all: {
        increment: weekIncrement,
        startOf: startOfWeek,
        granularityId: "WEEK"
    },
    year: {
        count: 52,
        increment: weekIncrement,
        startOf: startOfWeek,
        granularityId: "WEEK"
    },
    month: {
        count: 30,
        increment: dayIncrement,
        startOf: startOfDay,
        granularityId: "DAY"
    },
    week: {
        count: 7 * 24,
        increment: hourIncrement,
        startOf: startOfHour,
        granularityId: "HOUR"
    },
    day: {
        count: 24,
        increment: hourIncrement,
        startOf: startOfHour,
        granularityId: "HOUR"
    }
};
export function getDates(r, count) {
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
export function getRanges() {
    return Object.keys(ranges);
}
//# sourceMappingURL=rangeDates.js.map