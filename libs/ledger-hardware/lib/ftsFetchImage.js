"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var errors_1 = require("@ledgerhq/errors");
var pako_1 = require("pako");
var deviceAccess_1 = require("./deviceAccess");
var getDeviceInfo_1 = __importDefault(require("./getDeviceInfo"));
var getAppAndVersion_1 = __importDefault(require("./getAppAndVersion"));
var isDashboardName_1 = require("./isDashboardName");
var attemptToQuitApp_1 = __importDefault(require("./attemptToQuitApp"));
var errors_2 = require("../errors");
var MAX_APDU_SIZE = 240;
function fetchImage(_a) {
    var _this = this;
    var deviceId = _a.deviceId;
    var sub = (0, deviceAccess_1.withDevice)(deviceId)(function (transport) {
        return new rxjs_1.Observable(function (subscriber) {
            var timeoutSub = (0, rxjs_1.of)({
                type: "unresponsiveDevice"
            })
                .pipe((0, operators_1.delay)(1000))
                .subscribe(function (e) { return subscriber.next(e); });
            var sub = (0, rxjs_1.from)((0, getDeviceInfo_1["default"])(transport))
                .pipe((0, operators_1.mergeMap)(function () { return __awaiter(_this, void 0, void 0, function () {
                var imageLengthResponse, imageLengthStatus, imageLength, imageBuffer, currentOffset, chunkSize, chunkRequest, imageChunk, chunkStatus, hexImage;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            timeoutSub.unsubscribe();
                            return [4 /*yield*/, transport.send(0xe0, 0x64, 0x00, 0x00)];
                        case 1:
                            imageLengthResponse = _a.sent();
                            imageLengthStatus = imageLengthResponse.readUInt16BE(imageLengthResponse.length - 2);
                            if (imageLengthStatus !== 0x9000) {
                                // this answer success even when no image is set, but the length of the image is 0
                                return [2 /*return*/, subscriber.error(new errors_1.TransportError("Unexpected device responce", imageLengthStatus.toString(16)))];
                            }
                            imageLength = imageLengthResponse.readUInt32BE(0);
                            if (imageLength === 0) {
                                return [2 /*return*/, subscriber.error(new errors_2.ImageDoesNotExistOnDevice())];
                            }
                            imageBuffer = Buffer.from([]);
                            currentOffset = 0;
                            _a.label = 2;
                        case 2:
                            if (!(currentOffset < imageLength)) return [3 /*break*/, 4];
                            subscriber.next({
                                type: "progress",
                                progress: (currentOffset + 1) / imageLength
                            });
                            chunkSize = Math.min(MAX_APDU_SIZE - 2, imageLength - currentOffset);
                            chunkRequest = Buffer.alloc(5);
                            chunkRequest.writeUInt32BE(currentOffset);
                            chunkRequest.writeUInt8(chunkSize, 4);
                            return [4 /*yield*/, transport.send(0xe0, 0x65, 0x00, 0x00, chunkRequest)];
                        case 3:
                            imageChunk = _a.sent();
                            chunkStatus = imageChunk.readUInt16BE(imageChunk.length - 2);
                            if (chunkStatus !== 0x9000) {
                                // TODO: map all proper errors
                                return [2 /*return*/, subscriber.error(new errors_1.TransportError("Unexpected device responce", chunkStatus.toString(16)))];
                            }
                            imageBuffer = Buffer.concat([
                                imageBuffer,
                                imageChunk.slice(0, imageChunk.length - 2),
                            ]);
                            currentOffset += chunkSize;
                            return [3 /*break*/, 2];
                        case 4: return [4 /*yield*/, parseFtsImageFormat(imageBuffer)];
                        case 5:
                            hexImage = _a.sent();
                            subscriber.next({ type: "imageFetched", hexImage: hexImage });
                            subscriber.complete();
                            return [2 /*return*/];
                    }
                });
            }); }), (0, operators_1.catchError)(function (e) {
                if (e instanceof errors_1.DeviceOnDashboardExpected ||
                    (e &&
                        e instanceof errors_1.TransportStatusError &&
                        [0x6e00, 0x6d00, 0x6e01, 0x6d01, 0x6d02].includes(
                        // @ts-expect-error typescript not checking agains the instanceof
                        e.statusCode))) {
                    return (0, rxjs_1.from)((0, getAppAndVersion_1["default"])(transport)).pipe((0, operators_1.concatMap)(function (appAndVersion) {
                        return !(0, isDashboardName_1.isDashboardName)(appAndVersion.name)
                            ? (0, attemptToQuitApp_1["default"])(transport, appAndVersion)
                            : (0, rxjs_1.of)({
                                type: "appDetected"
                            });
                    }));
                }
                return (0, rxjs_1.throwError)(e);
            }))
                .subscribe(subscriber);
            return function () {
                timeoutSub.unsubscribe();
                sub.unsubscribe();
            };
        });
    });
    return sub;
}
exports["default"] = fetchImage;
// transforms from a FTS binary image format to an LLM hex string format
var parseFtsImageFormat = function (ftsImageBuffer) { return __awaiter(void 0, void 0, void 0, function () {
    var bppCompressionByte, compression, dataLengthBuffer, dataLength, imageData, uncompressedImageData, offset, currentChunkSize, chunk, uncompressedChunk;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                bppCompressionByte = ftsImageBuffer.readUInt8(4);
                compression = bppCompressionByte & 0x0f;
                dataLengthBuffer = Buffer.from([
                    ftsImageBuffer.readUInt8(5),
                    ftsImageBuffer.readUInt8(6),
                    ftsImageBuffer.readUInt8(7),
                    0x00,
                ]);
                dataLength = dataLengthBuffer.readUInt32LE();
                imageData = ftsImageBuffer.slice(8);
                if (compression === 0) {
                    return [2 /*return*/, imageData.toString("hex")];
                }
                uncompressedImageData = Buffer.from([]);
                offset = 0;
                _a.label = 1;
            case 1:
                if (!(offset < dataLength)) return [3 /*break*/, 3];
                currentChunkSize = imageData.readUInt16LE(offset);
                offset += 2;
                chunk = imageData.slice(offset, offset + currentChunkSize);
                return [4 /*yield*/, (0, pako_1.ungzip)(chunk)];
            case 2:
                uncompressedChunk = _a.sent();
                uncompressedImageData = Buffer.concat([
                    uncompressedImageData,
                    uncompressedChunk,
                ]);
                offset += currentChunkSize;
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/, uncompressedImageData.toString("hex")];
        }
    });
}); };
//# sourceMappingURL=ftsFetchImage.js.map