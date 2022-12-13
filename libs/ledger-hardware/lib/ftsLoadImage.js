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
var deviceAccess_1 = require("./deviceAccess");
var getDeviceInfo_1 = __importDefault(require("./getDeviceInfo"));
var errors_2 = require("../errors");
var getAppAndVersion_1 = __importDefault(require("./getAppAndVersion"));
var isDashboardName_1 = require("./isDashboardName");
var attemptToQuitApp_1 = __importDefault(require("./attemptToQuitApp"));
var pako_1 = require("pako");
var MAX_APDU_SIZE = 255;
var COMPRESS_CHUNK_SIZE = 2048;
function loadImage(_a) {
    var _this = this;
    var deviceId = _a.deviceId, hexImage = _a.hexImage;
    var sub = (0, deviceAccess_1.withDevice)(deviceId)(function (transport) {
        return new rxjs_1.Observable(function (subscriber) {
            var timeoutSub = (0, rxjs_1.of)({
                type: "unresponsiveDevice"
            })
                .pipe((0, operators_1.delay)(1000))
                .subscribe(function (e) { return subscriber.next(e); });
            var sub = (0, rxjs_1.from)((0, getDeviceInfo_1["default"])(transport))
                .pipe((0, operators_1.mergeMap)(function () { return __awaiter(_this, void 0, void 0, function () {
                var imageData, imageLength, imageSize, createImageResponse, createImageStatus, createImageStatusStr, currentOffset, chunkSize, chunkDataBuffer, chunkOffsetBuffer, apduData, commitResponse, commitStatus, commitStatusStr;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            timeoutSub.unsubscribe();
                            return [4 /*yield*/, generateFtsImageFormat(hexImage, true)];
                        case 1:
                            imageData = _a.sent();
                            imageLength = imageData.length;
                            imageSize = Buffer.alloc(4);
                            imageSize.writeUIntBE(imageLength, 0, 4);
                            subscriber.next({ type: "loadImagePermissionRequested" });
                            return [4 /*yield*/, transport.send(0xe0, 0x60, 0x00, 0x00, imageSize, [0x9000, 0x5501])];
                        case 2:
                            createImageResponse = _a.sent();
                            createImageStatus = createImageResponse.readUInt16BE(createImageResponse.length - 2);
                            createImageStatusStr = createImageStatus.toString(16);
                            // reads last 2 bytes which correspond to the status
                            if (createImageStatus === 0x5501) {
                                return [2 /*return*/, subscriber.error(new errors_2.ImageLoadRefusedOnDevice(createImageStatusStr))];
                            }
                            else if (createImageStatus !== 0x9000) {
                                return [2 /*return*/, subscriber.error(new errors_1.TransportError("Unexpected device response", createImageStatusStr))];
                            }
                            currentOffset = 0;
                            _a.label = 3;
                        case 3:
                            if (!(currentOffset < imageLength)) return [3 /*break*/, 5];
                            subscriber.next({
                                type: "progress",
                                progress: (currentOffset + 1) / imageLength
                            });
                            chunkSize = Math.min(MAX_APDU_SIZE - 4, imageLength - currentOffset);
                            chunkDataBuffer = imageData.slice(currentOffset, currentOffset + chunkSize);
                            chunkOffsetBuffer = Buffer.alloc(4);
                            chunkOffsetBuffer.writeUIntBE(currentOffset, 0, 4);
                            apduData = Buffer.concat([
                                chunkOffsetBuffer,
                                chunkDataBuffer,
                            ]);
                            return [4 /*yield*/, transport.send(0xe0, 0x61, 0x00, 0x00, apduData)];
                        case 4:
                            _a.sent();
                            currentOffset += chunkSize;
                            return [3 /*break*/, 3];
                        case 5:
                            subscriber.next({ type: "commitImagePermissionRequested" });
                            return [4 /*yield*/, transport.send(0xe0, 0x62, 0x00, 0x00, Buffer.from([]), [0x9000, 0x5501])];
                        case 6:
                            commitResponse = _a.sent();
                            commitStatus = commitResponse.readUInt16BE(commitResponse.length - 2);
                            commitStatusStr = commitStatus.toString(16);
                            // reads last 2 bytes which correspond to the status
                            if (commitStatus === 0x5501) {
                                return [2 /*return*/, subscriber.error(new errors_2.ImageCommitRefusedOnDevice(commitStatusStr))];
                            }
                            else if (commitStatus !== 0x9000) {
                                return [2 /*return*/, subscriber.error(new errors_1.TransportError("Unexpected device response", commitStatusStr))];
                            }
                            subscriber.next({
                                type: "imageLoaded"
                            });
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
exports["default"] = loadImage;
var generateFtsImageFormat = function (imgHex, compressImage) { return __awaiter(void 0, void 0, void 0, function () {
    var width, height, bpp, compression, header, imgData, dataLength_1, chunkedImgData, i, compressedChunkedImgData, compressedData, dataLength;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                width = 400;
                height = 672;
                bpp = 2;
                compression = compressImage ? 1 : 0;
                header = Buffer.alloc(8);
                header.writeUInt16LE(width, 0); // width
                header.writeUInt16LE(height, 2); // height
                header.writeUInt8((bpp << 4) | compression, 4);
                imgData = Buffer.from(imgHex, "hex");
                if (!compressImage) {
                    dataLength_1 = imgData.length;
                    header.writeUInt8(dataLength_1 & 0xff, 5); // lowest byte
                    header.writeUInt8((dataLength_1 >> 8) & 0xff, 6); // middle byte
                    header.writeUInt8((dataLength_1 >> 16) & 0xff, 7); // biggest byte
                    return [2 /*return*/, Buffer.concat([header, imgData])];
                }
                chunkedImgData = [];
                for (i = 0; i < imgData.length; i += COMPRESS_CHUNK_SIZE) {
                    chunkedImgData.push(imgData.slice(i, i + COMPRESS_CHUNK_SIZE));
                }
                return [4 /*yield*/, Promise.all(chunkedImgData.map(function (chunk) { return __awaiter(void 0, void 0, void 0, function () {
                        var compressedChunk, compressedChunkSize;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, pako_1.gzip)(chunk)];
                                case 1:
                                    compressedChunk = _a.sent();
                                    compressedChunkSize = Buffer.alloc(2);
                                    compressedChunkSize.writeUInt16LE(compressedChunk.length);
                                    return [2 /*return*/, Buffer.concat([compressedChunkSize, compressedChunk])];
                            }
                        });
                    }); }))];
            case 1:
                compressedChunkedImgData = _a.sent();
                compressedData = Buffer.concat(compressedChunkedImgData);
                dataLength = compressedData.length;
                header.writeUInt8(dataLength & 0xff, 5); // lowest byte
                header.writeUInt8((dataLength >> 8) & 0xff, 6); // middle byte
                header.writeUInt8((dataLength >> 16) & 0xff, 7); // biggest byte
                return [2 /*return*/, Buffer.concat([header, Buffer.concat(compressedChunkedImgData)])];
        }
    });
}); };
//# sourceMappingURL=ftsLoadImage.js.map