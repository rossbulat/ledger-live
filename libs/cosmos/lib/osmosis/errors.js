"use strict";
exports.__esModule = true;
exports.OsmosisErrorBroadcasting = exports.OsmosisSignatureSize = exports.OsmosisWrongSignatureHeader = void 0;
var errors_1 = require("@ledgerhq/errors");
exports.OsmosisWrongSignatureHeader = (0, errors_1.createCustomErrorClass)("OsmosisWrongSignatureHeader");
exports.OsmosisSignatureSize = (0, errors_1.createCustomErrorClass)("OsmosisSignatureSize");
exports.OsmosisErrorBroadcasting = (0, errors_1.createCustomErrorClass)("OsmosisErrorBroadcasting");
//# sourceMappingURL=errors.js.map