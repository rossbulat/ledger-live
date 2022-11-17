var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { BigNumber } from "bignumber.js";
var gasForTransaction = {
    send: 100000,
    delegate: 300000,
    undelegate: 350000,
    redelegate: 550000,
    claimReward: 300000,
    claimRewardCompound: 400000
};
// Default fees in uosmo
// Dear future developer working on this file, if fees become non-zero
// make sure to flip estimatedFees.isZero() to !estimatedFees.isZero() in
// './deviceTransactionConfig.ts'.
export var DEFAULT_FEES = 0;
export var MIN_GAS_FEE = 0.0025; // Min gas fee in uosmo (https://commonwealth.im/osmosis/discussion/6298-draft-minimum-gas-fee)
export var DEFAULT_GAS = 100000;
/**
 * Fetch the transaction fees for a transaction
 */
var getEstimatedFees = function (mode) { return __awaiter(void 0, void 0, void 0, function () {
    var gas;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getEstimatedGas(mode)];
            case 1:
                gas = _a.sent();
                return [2 /*return*/, gas.times(MIN_GAS_FEE)];
        }
    });
}); };
/**
 * Fetch the gas for a transaction
 */
export var getEstimatedGas = function (mode) { return __awaiter(void 0, void 0, void 0, function () {
    var estimatedGas;
    return __generator(this, function (_a) {
        estimatedGas = gasForTransaction[mode];
        if (!estimatedGas) {
            return [2 /*return*/, new BigNumber(DEFAULT_GAS)];
        }
        return [2 /*return*/, new BigNumber(estimatedGas)];
    });
}); };
export default getEstimatedFees;
//# sourceMappingURL=js-getFeesForTransaction.js.map