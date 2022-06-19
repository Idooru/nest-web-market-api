"use strict";
exports.__esModule = true;
exports.LoggerMiddleware = void 0;
var common_1 = require("@nestjs/common");
var LoggerMiddleware = /** @class */ (function () {
    function LoggerMiddleware() {
    }
    LoggerMiddleware.prototype.use = function (req, res, next) {
        res.on("finish", function () {
            var ip = req.ip, originalUrl = req.originalUrl, method = req.method;
            var statusCode = res.statusCode, statusMessage = res.statusMessage;
            var logger = new common_1.Logger(originalUrl);
            if (400 <= statusCode || statusCode >= 599) {
                var logger_1 = new common_1.Logger("".concat(res.statusCode, ":").concat(res.statusMessage));
                return logger_1.error("".concat(method, " ").concat(originalUrl));
            }
            return logger.log("".concat(method, " ").concat(originalUrl, " ").concat(ip, " - ").concat(statusCode, " ").concat(statusMessage));
        });
        next();
    };
    return LoggerMiddleware;
}());
exports.LoggerMiddleware = LoggerMiddleware;
