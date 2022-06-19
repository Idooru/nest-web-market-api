"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.JsonResponseInterceptor = void 0;
var common_1 = require("@nestjs/common");
var rxjs_1 = require("rxjs");
var JsonResponseInterceptor = /** @class */ (function () {
    function JsonResponseInterceptor() {
    }
    JsonResponseInterceptor.prototype.intercept = function (context, next) {
        // controller 도달 전
        var req = context.getArgByIndex(0);
        var res = context.switchToHttp().getResponse();
        console.log("Request from ".concat(req.method, " ").concat(req.originalUrl));
        var now = Date.now();
        return next.handle().pipe((0, rxjs_1.map)(function (data) {
            // controller 도달 후
            console.log("Response from ".concat(req.method, " ").concat(req.originalUrl, " :: time taken : ").concat(Date.now() - now, "ms"));
            res
                .setHeader("X-Powered-By", "")
                .status(data.statusCode)
                .json(__assign({ success: true }, data));
        }));
    };
    JsonResponseInterceptor = __decorate([
        (0, common_1.Injectable)()
    ], JsonResponseInterceptor);
    return JsonResponseInterceptor;
}());
exports.JsonResponseInterceptor = JsonResponseInterceptor;
