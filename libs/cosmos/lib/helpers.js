"use strict";
exports.__esModule = true;
exports.getMainMessage = void 0;
var getMainMessage = function (messages) {
    var messagePriorities = [
        "withdraw_rewards",
        "unbond",
        "redelegate",
        "delegate",
        "transfer",
    ];
    var sortedTypes = messages
        .filter(function (m) { return messagePriorities.includes(m.type); })
        .sort(function (a, b) {
        return messagePriorities.indexOf(a.type) - messagePriorities.indexOf(b.type);
    });
    return sortedTypes[0];
};
exports.getMainMessage = getMainMessage;
//# sourceMappingURL=helpers.js.map